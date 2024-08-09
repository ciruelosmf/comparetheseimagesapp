import { put } from '@vercel/blob';
import { compareImages } from '../../utils/openai-util';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image1, image2 } = req.body;
    console.log(3);

    // Upload images to Vercel Blob Storage
    const [blob1, blob2] = await Promise.all([
      put(`image1-${Date.now()}.png`, image1, { access: 'public' }),
      put(`image2-${Date.now()}.png`, image2, { access: 'public' })
    ]);

    // Compare images using OpenAI API
    const comparisonResult = await compareImages(blob1.url, blob2.url);

    res.status(200).json(comparisonResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'A2n error occurred while processing the images' });
  }
}
