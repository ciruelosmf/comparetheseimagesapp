import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function compareImages(image1Url, image2Url) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Compare these two images and tell me if they appear to be of the same subject (person, animal, or object). Provide a confidence percentage for your answer." },
            { type: "image_url", image_url: image1Url },
            { type: "image_url", image_url: image2Url },
          ],
        },
      ],
    });

    const result = response.choices[0].message.content;
    return { result };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
