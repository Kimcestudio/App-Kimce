import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "COLLABORATOR" | "LEAD";
    };
  }

  interface User {
    id: string;
    role: "ADMIN" | "COLLABORATOR" | "LEAD";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "COLLABORATOR" | "LEAD";
  }
}
