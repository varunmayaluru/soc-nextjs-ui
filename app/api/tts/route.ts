import { type NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize the ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      voice = "EXAVITQu4vr4xnSDxMaL",
      model = "eleven_multilingual_v2",
    } = await request.json();

    console.log("Using voice ID:", voice)

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Get streaming audio from ElevenLabs
    const audioStream = await elevenlabs.textToSpeech.stream(voice, {
      modelId: model,
      text,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.4,
        similarityBoost: 0.9,
        useSpeakerBoost: true,
        speed: 1.0,
      },
    });

    // Use Web Stream Reader to read chunks
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // Convert chunks into Node.js Buffer
    const audioBuffer = Buffer.concat(
      chunks.map((chunk) => Buffer.from(chunk))
    );

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600", // 1 hour cache
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
