import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST() {
  // Sign out from Supabase Auth session if there is one
  await supabase.auth.signOut();

  // Remove JWT cookie
  const response = NextResponse.json(
    { message: "Signed out" },
    { status: 200 }
  );

  // Remove the sb-access-token cookie
  response.cookies.set("sb-access-token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}
