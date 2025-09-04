import { NextResponse } from "next/server";

export async function POST() {
  // Remove JWT cookie
  const response = NextResponse.json(
    { message: "Signed out" },
    { status: 200 }
  );
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
