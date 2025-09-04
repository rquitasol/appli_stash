import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { encryptPassword } from "../../../lib/encryption";
import { signJwt } from "../../../lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const encryptedPassword = encryptPassword(password);
    const { data, error } = await supabase
      .from("user")
      .select("id, email, name")
      .eq("email", email)
      .eq("password", encryptedPassword);
    if (error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const user = data && data[0] ? data[0] : null;
    if (!user) {
      return NextResponse.json(
        { error: "User not found after authentication." },
        { status: 500 }
      );
    }
    const token = signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Set token as HTTP-only cookie
    const response = NextResponse.json(
      { user },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message, details: err },
      { status: 500 }
    );
  }
}
