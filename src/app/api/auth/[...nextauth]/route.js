import prisma from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'your account',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                    image: user.profilePic,
                    isAdmin: user.isAdmin,
                    randomKey: createId(),
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    isAdmin: token.isAdmin,
                    randomKey: token.randomKey
                }
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    isAdmin: user.isAdmin,
                    randomKey: user.randomKey
                };
            }
            return token;
        }
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };

