// src/app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { kv } from '@vercel/kv';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const userId = `user:${user.email}`;
        
        try {
          const exists = await kv.exists(userId);
          if (!exists) {
            await kv.hset(userId, {
              email: user.email,
              credits: 10,
              createdAt: Date.now()
            });
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return '/auth/error?error=DatabaseError';
        }
      }
      return false;
    },
    async session({ session }) {
      if (session?.user) {
        session.user.id = `user:${session.user.email}`;
      }
      return session;
    },
  },
  pages: {
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };