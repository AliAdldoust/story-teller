

export async function POST(request){

  try{
    const { text } = await request.json();

      if (!text || typeof text !== "string") {
      return Response.json(
        { error: "Please provide text to read."},
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return Response.json(
        { error: "Text must be 1,000 characters or fewer." },
        { status: 400 }
      );
    }

    const ttsResponse = await fetch("https://freetts.org/api/v1/tts", 
      {method: "POST", 
        headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.FREETTS_API_KEY,
      },
      body: JSON.stringify({
        text,
        voice: "fa-IR-FaridNeural",
        rate: "+0%",
        pitch: "+0Hz",
        output_format: "mp3",
      }),

      }
    )

      const ttsData = await ttsResponse.json();

      if (!ttsResponse.ok) {
        console.error("FreeTTS status:", ttsResponse.status);
        console.error("FreeTTS response:", ttsData);

        return Response.json(
          {
            error:
              ttsData.message ||
              ttsData.error ||
              JSON.stringify(ttsData) ||
              "FreeTTS could not generate the audio.",
          },
          { status: ttsResponse.status }
        );
      }



    const audioResponse = await fetch(
      `https://freetts.org/api/audio/${encodeURIComponent(
        ttsData.file_id
      )}`
    );

    if (!audioResponse.ok) {
      return Response.json(
        { error: "Could not download the generated audio." },
        { status: 502 }
      );
    }



        return new Response(audioResponse.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });









  }catch(error){
    console.error("TTS error:", error);

    return Response.json(
      { error: "Could not generate audio." },
      { status: 500 }
    );


  }


}