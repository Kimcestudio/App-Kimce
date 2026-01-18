import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb, firebaseReady } from "./firebase-admin";
import { type UserProfile } from "./types";

const demoUsers: UserProfile[] = [
  {
    id: "demo-admin",
    name: "Ana Pérez",
    email: "admin@kimce.studio",
    role: "ADMIN",
    position: "Directora",
    statusActive: true
  },
  {
    id: "demo-collab",
    name: "Luis Gómez",
    email: "luis@kimce.studio",
    role: "COLLABORATOR",
    position: "Diseñador",
    statusActive: true
  }
];

async function findUserByEmail(email: string) {
  if (!firebaseReady) {
    return demoUsers.find((user) => user.email === email) ?? null;
  }

  const snapshot = await getDb()
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0]?.data() as UserProfile;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const user = await findUserByEmail(credentials.email);
        if (!user || !user.statusActive) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserProfile["role"]) ?? "COLLABORATOR";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

export const { handlers, auth } = NextAuth(authOptions);
