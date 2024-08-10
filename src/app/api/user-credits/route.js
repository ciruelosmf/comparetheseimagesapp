// src/app/api/user-credits.js
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  console.log('userId-------------3333333333333333-:', userId);

  try {
    const credits = await kv.hget(userId, 'credits') || 10;;
    console.log('    user credits--------------:', credits);

    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Error fetching user creeeeeror   user credits--------------dits:', error);
    return NextResponse.json({ error: 'An error occurred while fetching user creeeeeror   user credits--------------dits' }, { status: 500 });
  }
}