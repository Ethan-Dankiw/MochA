import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Optional: store sessions in a database
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },

  // Add this callback to redirect after login
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to /app/interview/page after login
      return `${baseUrl}/interview`
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }