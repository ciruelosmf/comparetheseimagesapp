import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
 
export async function GET() {
  const user = await kv.hgetall('user:matias');
  return NextResponse.json(user);
}


// Database Design using Vercel KV

// Key structure:
// user:{userId}:info - Stores user information
// user:{userId}:credits - Stores user's credit balance

// Example of storing user information
await kv.hset(`user:${userId}:info`, {
    email: user.email,
    username: user.username,
    createdAt: Date.now()
  });
  
  // Example of setting initial credits
  await kv.set(`user:${userId}:credits`, 0);
  
  // Utility functions for managing user data and credits
  
  import { kv } from '@vercel/kv';
  
  export async function getUserInfo(userId) {
    return await kv.hgetall(`user:${userId}:info`);
  }
  
  export async function getUserCredits(userId) {
    return await kv.get(`user:${userId}:credits`) || 0;
  }
  
  export async function addCredits(userId, amount) {
    return await kv.incrby(`user:${userId}:credits`, amount);
  }
  
  export async function useCredit(userId) {
    const credits = await getUserCredits(userId);
    if (credits > 0) {
      await kv.decrby(`user:${userId}:credits`, 1);
      return true;
    }
    return false;
  }
  
  // Example usage in API route
  export default async function handler(req, res) {
    const { userId } = req.query;
    const userInfo = await getUserInfo(userId);
    const credits = await getUserCredits(userId);
  
    if (await useCredit(userId)) {
      // Perform image comparison
      // ...
      res.status(200).json({ result: 'Comparison successful', remainingCredits: credits - 1 });
    } else {
      res.status(403).json({ error: 'Not enough credits' });
    }
  }