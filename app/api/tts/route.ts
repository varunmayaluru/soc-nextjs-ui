import { type NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      voice = "JBFqnCBsd6RMkjVDRZzb",
      model = "eleven_multilingual_v2",
    } = await request.json();

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

    // Create streaming audio from text
    const audioStream = await elevenlabs.textToSpeech.stream(voice, {
      modelId: model,
      text,
      outputFormat: "mp3_44100_128",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.8,
        useSpeakerBoost: true,
        speed: 1.0,
      },
    });

    // ✅ Use Web ReadableStream reader (compatible with Edge Runtime)
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    // Combine chunks into a buffer
    const audioBuffer = Buffer.concat(
      chunks.map((chunk) => Buffer.from(chunk))
    );

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
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
