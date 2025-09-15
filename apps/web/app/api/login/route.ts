import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { encryptPassword } from "../../../lib/encryption";

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
      console.error("User not found after authentication.");
      return NextResponse.json(
        { error: "User not found after authentication." },
        { status: 500 }
      );
    }
    // Get Supabase Auth access_token for this user
    // (Assume user is already registered in Supabase Auth)
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (signInError || !signInData.session) {
      return NextResponse.json(
        {
          error:
            signInError?.message ||
            "Failed to sign in with Supabase Auth",
        },
        { status: 401 }
      );
    }
    const access_token = signInData.session.access_token;
    // Set Supabase Auth access_token as HTTP-only cookie
    const response = NextResponse.json(
      {
        user,
        token: access_token, // Include the token in the response body for the extension
      },
      { status: 200 }
    );
    response.cookies.set("sb-access-token", access_token, {
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
