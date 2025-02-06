// Code: lib/auth.ts
import {v4 as uuid} from "uuid";
import {encode as defaultEncode} from "next-auth/jwt";

import {prisma} from "@/lib/prisma";
import {PrismaAdapter} from "@auth/prisma-adapter";
import NextAuth, {Profile, User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {loginSchema} from "@/lib/schemas/login";
import bcrypt from "bcryptjs";
import Google from "@auth/core/providers/google";

const adapter = PrismaAdapter(prisma);

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter,
    pages: {
        signIn: '/login',
        error: '/login',
    },
    providers: [
        Google({
            profile(profile: Profile): User {

                return {
                    id: profile.sub,
                    name: profile.name,
                    emailVerified: new Date(),
                    email: profile.email,
                    username: profile.email?.split('@')[0] ?? undefined,
                    image: profile.picture,
                } as User;
            },
        }),
        Credentials({
            credentials: {
                identifier: {label: "Email or Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            authorize: async (credentials) => {
                const validatedCredentials = loginSchema.safeParse(credentials);

                if (!validatedCredentials.success) return null;

                const {identifier, password} = validatedCredentials.data;

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            {email: identifier},
                            {username: identifier}
                        ]
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        password: true,
                    }
                });

                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.password ?? "");
                return isValid ? user : null;
            },
        }),
    ],
    callbacks: {
        async signIn({account, profile}) {
            if (account?.provider === "google") {
                const email = profile?.email;
                return !!(email &&
                    (email.endsWith("@diu.edu.bd") || email.endsWith("@s.diu.edu.bd")|| email.endsWith("@gmail.com") ));
            }
            return true;
        },
        async jwt({token, account}) {
            if (account?.provider === "credentials") {
                token.credentials = true;
            }
            return token;
        },
    },
    jwt: {
        encode: async function (params) {
            if (params.token?.credentials) {
                const sessionToken = uuid();

                if (!params.token.sub) {
                    throw new Error("No user ID found in token");
                }

                const createdSession = await adapter?.createSession?.({
                    sessionToken: sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });

                if (!createdSession) {
                    throw new Error("Failed to create session");
                }

                return sessionToken;
            }
            return defaultEncode(params);
        },
    },
});