
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.BOXAPI_API_KEY,
  baseURL: "https://ai.boxapi.ir/ai/v1",
});

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return Response.json(
        { error: "Please provide text to read." },
        { status: 400 }
      );
    }

    const audioResponse = await client.audio.speech.create({
      model: "gemini-3.8-flash-tts",
      input: text,
      voice: "Kore",
      response_format: "pcm",
    });

    const audioBuffer = Buffer.from(
      await audioResponse.arrayBuffer()
    );

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gemini TTS error:", {
      message: error.message,
      status: error.status,
      details: error.error,
      requestID: error.requestID,
    });

    return Response.json(
      {
        error: "Could not generate audio.",
        details:
          error.error?.message || error.message,
      },
      { status: error.status || 500 }
    );
  }
}