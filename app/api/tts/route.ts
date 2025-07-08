import { type NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "EXAVITQu4vr4xnSDxMaL", model = "eleven_multilingual_v2" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const stream = await elevenlabs.textToSpeech.stream(voice, {
      modelId: model,
      text,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.7,
        similarityBoost: 0.9,
        useSpeakerBoost: false,
        speed: 0.85,
      },
    });

    return new NextResponse(stream as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
