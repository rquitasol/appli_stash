import { verifyJwt } from "../lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export function requireAuth(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = token ? verifyJwt(token) : null;
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  return user;
}
