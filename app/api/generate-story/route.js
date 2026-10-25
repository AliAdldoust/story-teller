import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.GAPGPT_API_KEY,
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
        const response = await client.chat.completions.create({
            model: "gpt-4o",

            messages: [
                {
                    role: "system",
                    content:
                        `You are a creative storyteller for children in Persian language. All your generated content 
                         must be in Persian.
                         Your content must not be anything other than a story.
                         Write imaginative stories for children aged between 5 to 10.
                         The concept of the story must be around the words provided by the user. You must use that words.
                         if no words are provided, do not ask or explain, generate a random story.`,
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