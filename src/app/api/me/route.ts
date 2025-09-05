import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "../../../lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const user = verifyJwt(token);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  // Only return safe user info
  const { id, email, name } = user as any;
  return NextResponse.json({ id, email, name });
}
