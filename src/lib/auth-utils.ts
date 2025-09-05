import { verifyJwt, JwtUser } from "../lib/jwt";
import { NextRequest } from "next/server";

export function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = token ? (verifyJwt(token) as JwtUser) : null;
  if (!user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return user;
}
