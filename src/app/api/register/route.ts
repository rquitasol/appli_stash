import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { encryptPassword } from "../../../lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      console.error(
        "Registration error: Missing required fields",
        { email, password, name }
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Check if email already exists
    const { data: existing, error: checkError } =
      await supabase
        .from("user")
        .select("id")
        .eq("email", email);
    if (checkError) {
      console.error(
        "Registration error: DB check",
        checkError.message
      );
      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }
    if (existing.length > 0) {
      console.warn(
        "Registration attempt for existing email:",
        email
      );
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }
    // Encrypt password
    const encryptedPassword = encryptPassword(password);
    // Insert new user
    const { data: newUser, error: insertError } =
      await supabase
        .from("user")
        .insert([
          { email, password: encryptedPassword, name },
        ])
        .select();
    if (insertError) {
      console.error(
        "Registration error: Insert failed",
        insertError.message
      );
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
    console.log("Registration successful for:", email);
    // Create JWT token with user data
    const user = newUser[0];
    const { signJwt } = await import("../../../lib/jwt");
    const token = signJwt({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    // Set token as HTTP-only cookie
    const response = NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    console.error("Registration error: Unexpected", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
