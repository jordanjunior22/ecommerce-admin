import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter"

const adminEmails = ['brymojunior5@gmail.com']
export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user})=> {
      if(adminEmails.includes(session?.user?.email)){
        return session;
      }else{
        return false;
      }
    }

  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      
    }),
    // ...add more providers here
  ],

};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    throw 'not admin';
  }
  return session
}
export const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};