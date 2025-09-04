import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/requireAuth";

export async function GET(request: NextRequest) {
  // Require authentication
  const user = requireAuth(request);
  if (!user || user instanceof NextResponse) return user;
  // Authorized: return user info or protected data
  return NextResponse.json({ message: "Authorized", user });
}
