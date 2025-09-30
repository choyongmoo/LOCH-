import datetime
import asyncio
from typing import List
from dotenv import load_dotenv

from livekit import agents
from livekit import api
from livekit.agents import AgentSession, Agent, CloseEvent, RoomInputOptions, RoomOutputOptions, UserInputTranscribedEvent
from livekit.plugins import (
    openai,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    session = AgentSession()
    room = ctx.room

    _active_tasks = set()

    def handle_text_stream(reader, participant_identity):
        task = asyncio.create_task(async_handle_text_stream(reader, participant_identity))
        _active_tasks.add(task)
        task.add_done_callback(lambda t: _active_tasks.remove(t))

    async def async_handle_text_stream(reader, participant_identity):
        info = reader.info

        print(
            f'Text stream received from {participant_identity}\n'
            f'  Topic: {info.topic}\n'
            f'  Timestamp: {info.timestamp}\n'
            f'  Size: {info.size}'  # Optional, only available if the stream was sent with `send_text`
        )

        # Option 1: Process the stream incrementally using an async for loop.
        # async for chunk in reader:
        #     print(f"Next chunk: {chunk}")

        # Option 2: Get the entire text after the stream completes.
        text = await reader.read_all()
        print(f"Received text: {text}")

    room.register_text_stream_handler("lk.chat", handle_text_stream)

    @session.on("user_input_transcribed")
    def on_user_input_transcribed(event: UserInputTranscribedEvent):
        open("session.log", "a").write(
            f"--- USER INPUT TRANSCRIBED EVENT ---\n"
            f"User input transcribed: {event.transcript}\n"
            f"final: {event.is_final}\n"
            f"speaker id: {event.speaker_id}\n"
            f"created at: {event.created_at}\n")

    @session.on("close")
    def on_close(event: CloseEvent):
        open("session.log", "w").write("")
        # asyncio.run(ctx.delete_room())

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
            sync_transcription=False
        ),
    )

if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
