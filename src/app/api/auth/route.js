// src/app/api/auth/route.js
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = `user:${session.user.email}`;

  try {
    // Fetch user credits, initialize if not set
    let credits = await kv.get(`${userId}:credits`);
    if (credits === null) {
      credits = 10; // Default to 10 if not set
      await kv.set(`${userId}:credits`, credits);
    }

    return NextResponse.json({
      user: session.user,
      credits: Number(credits)
    });
  } catch (error) {
    console.error('Error in auth route:', error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}