import asyncio
import json
import logging
import datetime
import os
import time

from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    JobContext,
    JobProcess,
    RoomInputOptions,
    RoomIO,
    RoomOutputOptions,
    StopResponse,
    WorkerOptions,
    WorkerPermissions,
    cli,
    llm,
    utils,
)
from livekit.plugins import openai, silero
from openai import AsyncOpenAI as OpenAIAsyncClient
import supabase

load_dotenv()

logger = logging.getLogger("transcriber")
logging.getLogger("asyncio").setLevel(logging.WARNING)
logging.getLogger("livekit.agents").setLevel(logging.WARNING)
logging.getLogger("hpack").setLevel(logging.WARNING)

_openai_client = OpenAIAsyncClient()
_supabase_client = supabase.create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))


async def summarize_transcript(transcript_context: str) -> str:
    if not transcript_context or not transcript_context.strip():
        return ""

    response = await _openai_client.chat.completions.create(
        model="gpt-4o",
        temperature=0.2,
        max_completion_tokens=400,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a precise meeting summarizer. "
                    "Your task is to produce a clear summary of meeting transcripts. "
                    "Follow these rules strictly:\n"
                    "- Output 5–10 concise bullet points.\n"
                    "- Include key decisions and action items.\n"
                    "- Be objective and avoid speculation.\n"
                    "- Write in the same language as the transcript. "
                    "If multiple languages are used, default to Korean."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Summarize the following transcript:\n\n{transcript_context}"
                ),
            },
        ],
    )

    return (response.choices[0].message.content or "").strip()

class Transcriber(Agent):
    def __init__(
        self,
        *,
        created_at: float,
        participant_identity: str,
        participant_name: str,
        transcript_log: list[dict[str, str]],
    ):
        super().__init__(
            instructions="not-needed",
            stt=openai.STT(model="gpt-4o-transcribe"),
        )
        self.created_at = created_at
        self.participant_identity = participant_identity
        self.participant_name = participant_name
        self.transcript_log = transcript_log
    async def on_user_turn_completed(self, chat_ctx: llm.ChatContext, new_message: llm.ChatMessage):
        user_transcript = new_message.text_content
        logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] {self.participant_identity} -> {user_transcript}")

        self.transcript_log.append({
            "timestamp": round(time.monotonic() - self.created_at, 2),
            "participant": self.participant_name,
            "transcript": user_transcript,
        })

        raise StopResponse()


class MultiUserTranscriber:
    def __init__(self, ctx: JobContext):
        self.ctx = ctx
        self._sessions: dict[str, AgentSession] = {}
        self._tasks: set[asyncio.Task] = set()

        self.created_at: float | None = None
        self.started_at: str = ""
        self.ended_at: str = ""
        self.transcript_log: list[dict[str, str]] = []

    def start(self):
        self.created_at = time.monotonic()
        self.started_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
        logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] starting transcriber for {self.ctx.room.name}")

        self.ctx.room.on("participant_connected", self.on_participant_connected)
        self.ctx.room.on("participant_disconnected", self.on_participant_disconnected)

    async def aclose(self):
        logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] closing transcriber for {self.ctx.room.name}")

        await utils.aio.cancel_and_wait(*self._tasks)

        await asyncio.gather(*[self._close_session(session) for session in self._sessions.values()])

        self.ctx.room.off("participant_connected", self.on_participant_connected)
        self.ctx.room.off("participant_disconnected", self.on_participant_disconnected)

        self.ended_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

        await self._dump_session()


    def on_participant_connected(self, participant: rtc.RemoteParticipant):
        if participant.identity in self._sessions:
            return

        logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] starting session for {participant.identity}")
        task = asyncio.create_task(self._start_session(participant))
        self._tasks.add(task)

        def on_task_done(task: asyncio.Task):
            try:
                self._sessions[participant.identity] = task.result()
            finally:
                self._tasks.discard(task)

        task.add_done_callback(on_task_done)

    def on_participant_disconnected(self, participant: rtc.RemoteParticipant):
        if (session := self._sessions.pop(participant.identity)) is None:
            return

        logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] closing session for {participant.identity}")
        task = asyncio.create_task(self._close_session(session))
        self._tasks.add(task)
        task.add_done_callback(lambda _: self._tasks.discard(task))


    async def _start_session(self, participant: rtc.RemoteParticipant) -> AgentSession:
        if participant.identity in self._sessions:
            return self._sessions[participant.identity]

        session = AgentSession(
            vad=self.ctx.proc.userdata["vad"],
        )
        room_io = RoomIO(
            agent_session=session,
            room=self.ctx.room,
            participant=participant,
            input_options=RoomInputOptions(
                text_enabled=False,
                video_enabled=False,
            ),
            output_options=RoomOutputOptions(
                transcription_enabled=True,
                audio_enabled=False,
            ),
        )
        await room_io.start()
        await session.start(
            agent=Transcriber(
                created_at=self.created_at,
                participant_identity=participant.identity,
                participant_name=participant.name,
                transcript_log=self.transcript_log,
            )
        )
        return session

    async def _close_session(self, sess: AgentSession) -> None:
        await sess.drain()
        await sess.aclose()


    async def _dump_session(self) -> None:
        if not self.transcript_log or len(self.transcript_log) == 0:
            return

        server_id = ""
        try:
            rooms = _supabase_client.table("rooms").select("server_id").eq("id", self.ctx.room.name).single().execute()
            server_id = rooms.data["server_id"]
        except Exception as e:
            logger.error(f"[{(time.monotonic() - self.created_at):.2f}s] server id retrieval failed for {self.ctx.room.name}: {e}")

        summary = ""
        transcript_context = "\n".join(f"{item['participant']} -> {item['transcript']}" for item in self.transcript_log)
        try:
            summary = await summarize_transcript(transcript_context)
        except Exception as e:
            logger.error(f"[{(time.monotonic() - self.created_at):.2f}s] transcript summary generation failed for {self.ctx.room.name}: {e}")

        payload = {
            "server_id": server_id,
            "started_at": self.started_at,
            "ended_at": self.ended_at,
            "transcript": self.transcript_log,
            "summary": summary,
        }

        try:
            result = _supabase_client.table("meeting_logs").insert(payload).execute()
            logger.info(f"[{(time.monotonic() - self.created_at):.2f}s] successfully inserted session log for {self.ctx.room.name}")
        except Exception as e:
            logger.error(f"[{(time.monotonic() - self.created_at):.2f}s] session log insertion failed for {self.ctx.room.name}: {e}")


async def entrypoint(ctx: JobContext):
    transcriber = MultiUserTranscriber(ctx)
    transcriber.start()

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    for participant in ctx.room.remote_participants.values():
        transcriber.on_participant_connected(participant)

    async def cleanup():
        await transcriber.aclose()

    ctx.add_shutdown_callback(cleanup)


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
            permissions=WorkerPermissions(
                hidden=True,
                can_publish=False,
                can_publish_data=False
            )
        )
    )
