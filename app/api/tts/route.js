import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Story text is required." },
        { status: 400 }
      );
    }

    // The anonymous free tier allows 500 characters per request.
    if (text.length > 500) {
      return NextResponse.json(
        { error: "For this test, the text must be 500 characters or fewer." },
        { status: 400 }
      );
    }

    // Find the Persian Amir voice.
    const voicesResponse = await fetch(
      "https://api.tts.ai/v1/voices/?language=fa&model=piper"
    );


    if (!voicesResponse.ok) {
      throw new Error("Could not retrieve available voices.");
    }


    const voicesData = await voicesResponse.json();

        const voice = voicesData.voices?.find(
        (item) => item.language === "fa" && /amir/i.test(item.name)
        );

    if (!voice) {
      throw new Error("The Persian Amir voice was not found.");
    }

    // Ask the AI service to generate speech.
    const ttsResponse = await fetch(
      "https://api.tts.ai/v1/tts/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "piper",
          voice: voice.id,
          language: "fa",
          text,
          format: "mp3",
        }),
      }
    );

    const job = await ttsResponse.json();

    if (!ttsResponse.ok) {
      return NextResponse.json(
        { error: job.error || "Speech generation failed." },
        { status: ttsResponse.status }
      );
    }

    if (!job.uuid) {
      throw new Error("The speech service did not return a job ID.");
    }

    // Wait for the generated audio.
    let result;

    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const resultResponse = await fetch(
        `https://api.tts.ai/v1/speech/results/?uuid=${encodeURIComponent(job.uuid)}`
      );

      result = await resultResponse.json();

      if (!resultResponse.ok || result.status === "failed") {
        throw new Error(result.error || "Audio generation failed.");
      }

      if (result.status === "completed" && result.result_url) {
        break;
      }
    }

    if (result?.status !== "completed" || !result.result_url) {
      throw new Error("Audio generation timed out. Please try again.");
    }

    console.log("Audio URL hostname:", new URL(result.result_url).hostname);

    // Retrieve the MP3 and send it back to the frontend.
    const audioResponse = await fetch(result.result_url);

    if (!audioResponse.ok) {
      throw new Error("Could not download the generated audio.");
    }

    return new Response(await audioResponse.arrayBuffer(), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while generating speech.",
      },
      { status: 500 }
    );
  }
}