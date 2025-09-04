import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

import crypto from "crypto";

function encryptPassword(password: string): string {
  const secret = process.env.PASSWORD_SECRET;
  if (!secret) throw new Error("Missing PASSWORD_SECRET env variable");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
  return hash;
}

// GET: Check if email exists
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("user")
    .select("id")
    .eq("email", email);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ exists: data.length > 0 });
}

// POST: Register new user

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from("user")
      .select("id")
      .eq("email", email);
    if (checkError)
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }
    // Encrypt password
    const encryptedPassword = encryptPassword(password);
    // Insert new user
    const { data, error } = await supabase
      .from("user")
      .insert([{ email, password: encryptedPassword, name }])
      .select();
    if (error)
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    return NextResponse.json({ user: data[0] }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message, details: err }, { status: 500 });
  }
}
