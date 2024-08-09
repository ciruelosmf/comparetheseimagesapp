import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:  process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log(11111);
  try {
    const { image1, image2 } = await request.json();
    console.log(2222);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Compare these two images and tell me if they appear to be of the same subject (person, animal, or object). Provide a confidence percentage for your answer." },
            { type: "image_url", image_url: { url: image1 } },
            { type: "image_url", image_url: { url: image2 } },
          ],
        },
      ],
    });

    const result = response.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An 1 error occurred while processing the images' }, { status: 500 });
  }
}
