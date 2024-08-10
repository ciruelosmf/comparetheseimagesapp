// pages/api/auth/[...nextauth].js
//import NextAuth from 'next-auth';
//import GoogleProvider from 'next-auth/providers/google';
//import { kv } from '@vercel/kv';

//export default NextAuth({
//  providers: [
 //   GoogleProvider({
   //   clientId: process.env.GOOGLE_CLIENT_ID,
     // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //}),
  //],
  //callbacks: {
    //async signIn({ user, account }) {
      //if (account.provider === "google") {
        //const { email } = user;
        //const userId = `user:${email}`;
        
        // Check if user exists, if not, create a new user with initial credits
        //const exists = await kv.exists(userId);
        //if (!exists) {
          //await kv.hset(userId, {
            //email,
            //credits: 10, // Initial credits
            //createdAt: Date.now()
          //});
        //}
        //return true;
      //}
      //return false;
    //},
    //async session({ session, token }) {
      //if (session.user) {
        //session.user.id = `user:${session.user.email}`;
      //}
      //return session;
    //},
  //},
//});