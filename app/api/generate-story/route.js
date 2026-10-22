import OpenAI from "openai";

const hf = new OpenAI({
    apiKey: process.env.HF_TOKEN,
});



export async function POST(request){

    try{

        const {words, number} = await request.json();
    
        if (words.length === 0) {
        return Response.json(
            { error: "Please provide some words." },
            { status: 400 }
        );
    }



        // Inside your POST function:
        const response = await hf.chat.completions.create({
            model: "openai/gpt-oss-120b:fastest",

            messages: [
                {
                    role: "system",
                    content:
                        "You are a creative storyteller for children. Write imaginative, age-appropriate stories using all the words provided by the user.",
                },
                {
                    role: "user",
                    content: `Write a children's story with ${number} words, using these words: ${words.join(", ")}`,
                },
            ],
            max_tokens: 700,

        });

        const story = response.choices[0].message.content;


    return Response.json({ story });
    }

     catch (error) {
    console.error("Hugging face ERROR:", error);

    return Response.json(
        { error: String(error) },
        { status: 500 }
    );
}

}