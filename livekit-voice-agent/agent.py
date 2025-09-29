import datetime
from typing import List
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, CloseEvent, ConversationItemAddedEvent, RoomInputOptions, RoomOutputOptions, UserInputTranscribedEvent
from livekit.plugins import (
    openai,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

class ConversationLogEntry:
    def __init__(self, transcript: str, speaker_id: str, timestamp: datetime.datetime):
        self.transcript = transcript
        self.speaker_id = speaker_id
        self.timestamp = timestamp

    def __str__(self):
        return f"[{self.timestamp}] {self.speaker_id}: {self.transcript}"

async def entrypoint(ctx: agents.JobContext):
    session = AgentSession()
    room = ctx.room
    convlog: List[ConversationLogEntry] = []

    @session.on("user_input_transcribed")
    def on_user_input_transcribed(event: UserInputTranscribedEvent):
        open("session.log", "a").write(
            f"User input transcribed: {event.transcript}\n"
            f"final: {event.is_final}\n"
            f"speaker id: {event.speaker_id}\n"
            f"created at: {event.created_at}\n")

        if event.is_final:
            convlog.append(ConversationLogEntry(
                transcript=event.transcript,
                speaker_id=event.speaker_id,
                timestamp=event.created_at
            ))



    @session.on("conversation_item_added")
    def on_conversation_item_added(event: ConversationItemAddedEvent):
        open("session.log", "a").write(
            f"Conversation item added from {event.item.role}: {event.item.text_content}.\n"
            f"interrupted: {event.item.interrupted}\n"
            f"created at: {event.created_at}\n")

        for content in event.item.content:
            if isinstance(content, str):
                print(f" - text: {content}")
                # room.local_participant.send_text("test")

    @session.on("close")
    def on_close(event: CloseEvent):
        open("session.log", "a").write(
            f"Session closed with error: {event.error}\n"
            f"created at: {event.created_at}\n")


    await session.start(
        room=ctx.room,
        agent=Agent(
            stt=openai.STT(model="gpt-4o-mini-transcribe"),
            llm=openai.LLM(model="gpt-4o-mini"),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
            instructions="You are a helpful AI assistant.",
        ),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
        room_output_options=RoomOutputOptions(
            audio_enabled=False,
        ),
    )

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
