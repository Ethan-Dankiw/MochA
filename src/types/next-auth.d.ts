/**
 * next-auth.d.ts
 * Location: src/types/next-auth.d.ts
 *
 * NextAuth's default Session type does not include `id` on user.
 * This declaration merges our custom field in so TypeScript stops complaining.
 * No imports needed anywhere — TypeScript picks this up automatically.
 */
import "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id:     string
            name?:  string | null
            email?: string | null
            image?: string | null
        }
    }
}