import { NextRequest, NextResponse } from "next/server";
import {
  supabase,
  supabaseAdmin,
} from "../../../lib/supabaseClient";
import { encryptPassword } from "../../../lib/encryption";

function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(
      `[${context}]`,
      error.message,
      error.stack
    );
  } else {
    console.error(`[${context}]`, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      logError(
        "Registration error: Missing required fields",
        { email, password, name }
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
    if (authError) {
      logError("Supabase Auth Create User", authError);
      if (
        authError.message &&
        authError.message.includes("not allowed")
      ) {
        logError("User not allowed", authError);
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }
    const supabaseUserId = authUser.user?.id;
    if (!supabaseUserId) {
      logError("No Supabase user id returned", authUser);
      return NextResponse.json(
        { error: "Failed to create user in auth." },
        { status: 500 }
      );
    }
    // 2. Insert into custom user table
    const encryptedPassword = encryptPassword(password);
    const { data: newUser, error: insertError } =
      await supabase
        .from("user")
        .insert([
          {
            id: supabaseUserId,
            email,
            name,
            password: encryptedPassword,
          },
        ])
        .select();
    if (insertError) {
      logError("Insert custom user table", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
    // 3. Sign in to get Supabase Auth access_token
    const user = newUser[0];
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (signInError || !signInData.session) {
      logError("Supabase Auth signIn", signInError);
      return NextResponse.json(
        {
          error:
            signInError?.message ||
            "Failed to sign in after registration",
        },
        { status: 500 }
      );
    }
    const access_token = signInData.session.access_token;
    // 4. Set Supabase Auth access_token as HTTP-only cookie
    const response = NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
    response.cookies.set("sb-access-token", access_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error) {
    logError("Registration error: Unexpected", error);
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
