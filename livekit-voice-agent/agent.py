import os, json, time, datetime
from dotenv import load_dotenv

from livekit.agents import (
    JobContext, UserInputTranscribedEvent, WorkerOptions, cli,
    AgentSession, Agent, RoomInputOptions, RoomOutputOptions,
)
from livekit.plugins import openai as lk_openai, noise_cancellation, silero

from supabase import create_client, Client
from openai import AsyncOpenAI

load_dotenv(".env")

sb: Client = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])
oa = AsyncOpenAI()

async def summarize_text(text: str) -> str:
    if not text.strip():
        return "No transcript available."
    prompt = (
        "Summarize this meeting in 5~10 bullet points, answer in most used language of the transcript. "
        "Emphasize key decisions, action items (with owners/dates if mentioned), "
        "and any blockers. Keep it concise.\n\nTranscript:\n" + text
    )
    resp = await oa.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a precise meeting summarizer."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )
    return (resp.choices[0].message.content or "").strip()

async def entrypoint(ctx: JobContext):
    session = AgentSession()

    t0 = time.monotonic()
    started_at = datetime.datetime.now(datetime.timezone.utc)

    transcript_log = []

    @session.on("user_input_transcribed")
    def on_user_input_transcribed(evt: UserInputTranscribedEvent):
        if evt.is_final:
            transcript_log.append({
                "time": round(time.monotonic() - t0, 3),
                "text": evt.transcript,
            })

    async def dump_to_supabase():
        ended_at = datetime.datetime.now(datetime.timezone.utc)

        # Build plain text for summarization
        full_text = "\n".join(f"- {item['text']}" for item in transcript_log)

        # Generate summary
        try:
            summary = await summarize_text(full_text)
            print(summary)
        except Exception as e:
            summary = f"(summary unavailable: {e})"

        # Find server_id via rooms.id == LiveKit room name
        try:
            print(ctx.room.name)
            rooms = sb.from_("rooms").select("server_id").eq("id", ctx.room.name).single().execute()
            server_id = rooms.data["server_id"]
        except Exception as e:
            print(f"Failed to resolve server_id for room '{ctx.room.name}': {e}")
            return

        payload = {
            "server_id": server_id,
            "transcript": {
                "time_unit": "seconds_since_session_start",
                "items": transcript_log,
            },
            "summary": summary,
            "started_at": started_at.isoformat(),
            "ended_at": ended_at.isoformat(),
        }

        try:
            res = sb.table("meeting_logs").insert(payload).execute()
            print(f"Inserted meeting_log id={res.data[0]['id'] if res.data else 'unknown'}")
        except Exception as e:
            print(f"Insert into meeting_logs failed: {e}")

    ctx.add_shutdown_callback(dump_to_supabase)

    await ctx.connect()

    await session.start(
        room=ctx.room,
        agent=Agent(
            stt=lk_openai.STT(model="gpt-4o-mini-transcribe"),
            vad=silero.VAD.load(),
            instructions="You are a helpful assistant that transcribes user speech to text.",
        ),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
            close_on_disconnect=False,
            text_enabled=False,
        ),
        room_output_options=RoomOutputOptions(audio_enabled=False),
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
