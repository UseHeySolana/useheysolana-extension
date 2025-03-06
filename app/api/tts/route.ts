import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text;

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    if (!text) {
      return NextResponse.json({ error: "No Text Provided" }, { status: 400 });
    }
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const readableStream = mp3.body as ReadableStream;
    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
    // const buffer = Buffer.from(await mp3.arrayBuffer());

    // // Return the audio data with appropriate headers
    // return new NextResponse(buffer, {
    //   headers: {
    //     "Content-Type": "audio/mpeg",
    //     "Content-Length": buffer.byteLength.toString(),
    //   },
    // });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      {
        error: "Failed to process audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}