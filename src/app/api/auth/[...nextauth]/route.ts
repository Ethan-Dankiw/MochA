/**
 * Location: src/app/api/auth/[...nextauth]/route.ts
 * Replace the existing file at this path.
 */
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { upsertGoogleUser } from "@/lib/database/userquery"
import { createSession } from "@/lib/session/session";

export const authOptions: AuthOptions = {
    secret: process.env.SESSION_SECRET,
    providers: [
        GoogleProvider({
            clientId:     process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        // Fires after Google confirms who the user is.
        // Writes them into leetcode.sqlite so they exist for all future queries.
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.id) {
                // 1. Sync with SQLite
                await upsertGoogleUser({
                    id:    user.id,
                    email: user.email!,
                    name:  user.name  ?? null,
                    image: user.image ?? null,
                });

                await createSession(user.id);
                
                return true;
            }
            return false;
        },

        // Bake userId into the JWT cookie stored in the browser.
        async jwt({ token, user }) {
            if (user) token.userId = user.id
            return token
        },

        // Expose session.user.id to server components and API routes.
        // The `id` field is typed because of src/types/next-auth.d.ts.
        async session({ session, token }) {
            if (token.userId && session.user) {
                session.user.id = token.userId as string
            }
            return session
        },

        async redirect({ baseUrl }) {
            return `${baseUrl}/interview`
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }