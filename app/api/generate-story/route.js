import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://ai.boxapi.ir/ai/v1",
  apiKey: process.env.BOXAPI_API_KEY,
});


export async function POST(request){

    try{

        const {words, number} = await request.json();
    


        // Inside your POST function:
        const response = await client.chat.completions.create({
            model: "gpt-5.4-mini",

            messages: [
                {
                    role: "system",
                    content:
                        `تو یک داستانگوی خلاق برای کودکان به زبان فارسی هستی. تمام محتوایی که تولید میکنی باید به زبان فارسی باشد.
                         محتوای تو نباید چیزی جز داستان باشد. داستانهای تخیلی برای کودکان بین ۵ تا ۱۰ سال بنویس.
                         مفهوم داستان باید حول کلماتی باشد که کاربر ارائه میدهد. تو باید از آن کلمات استفاده کنی.
                         اگر کلمهای ارائه نشد، نپرس و توضیح نده، یک داستان تصادفی تولید کن.`,
                },
                {
                    role: "user",
                    content: `Write a children's story with ${number} words, using these words: ${words.join(", ")}`,
                },
            ],
            max_completion_tokens: 700,

        });

        const story = response.choices[0].message.content;


    return Response.json({ story });
    }

     catch (error) {
    console.error("BOX API error:", error);

    return Response.json(
        { error: String(error) },
        { status: 500 }
    );
}

}