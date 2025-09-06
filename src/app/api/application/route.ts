import { NextRequest, NextResponse } from "next/server";
import { getSupabaseForUser } from "../../../lib/supabaseClient";
import { logError } from "../../../lib/jwtUtils";

export interface Application {
  id?: string;
  user_id: string;
  company_name: string;
  url: string;
  status: string;
  position: string;
  priority_level: string;
  notes: string;
}

// CREATE
export async function POST(request: NextRequest) {
  const access_token = request.cookies.get(
    "sb-access-token"
  )?.value;
  if (!access_token) {
    logError(
      "POST /api/application",
      "Unauthorized: No Supabase access token"
    );
    return NextResponse.json(
      {
        error:
          "Unauthorized: Invalid or missing authentication.",
      },
      { status: 401 }
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const {
    company_name,
    url,
    status,
    position,
    priority_level,
    notes,
  } = body;
  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("POST /api/application", userError);
    return NextResponse.json(
      { error: "Failed to get user from access token" },
      { status: 401 }
    );
  }
  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from("application")
    .insert([
      {
        user_id,
        company_name,
        url,
        status,
        position,
        priority_level,
        notes,
      },
    ])
    .select();
  if (error) {
    logError("POST /api/application", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(data[0], { status: 201 });
}

// READ (all for user)
export async function GET(request: NextRequest) {
  const access_token = request.cookies.get(
    "sb-access-token"
  )?.value;
  if (!access_token) {
    logError(
      "GET /api/application",
      "Unauthorized: No Supabase access token"
    );
    return NextResponse.json(
      {
        error:
          "Unauthorized: Invalid or missing authentication.",
      },
      { status: 401 }
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("GET /api/application", userError);
    return NextResponse.json(
      { error: "Failed to get user from access token" },
      { status: 401 }
    );
  }
  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from("application")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    logError("GET /api/application", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

// UPDATE
export async function PUT(request: NextRequest) {
  const access_token = request.cookies.get(
    "sb-access-token"
  )?.value;
  if (!access_token) {
    logError(
      "PUT /api/application",
      "Unauthorized: No Supabase access token"
    );
    return NextResponse.json(
      {
        error:
          "Unauthorized: Invalid or missing authentication.",
      },
      { status: 401 }
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const {
    id,
    company_name,
    url,
    status,
    position,
    priority_level,
    notes,
  } = body;
  if (!id) {
    return NextResponse.json(
      { error: "Missing application id" },
      { status: 400 }
    );
  }
  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("PUT /api/application", userError);
    return NextResponse.json(
      { error: "Failed to get user from access token" },
      { status: 401 }
    );
  }
  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from("application")
    .update({
      company_name,
      url,
      status,
      position,
      priority_level,
      notes,
    })
    .eq("id", id)
    .eq("user_id", user_id)
    .select();
  if (error) {
    logError("PUT /api/application", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(data[0]);
}

// DELETE
export async function DELETE(request: NextRequest) {
  const access_token = request.cookies.get(
    "sb-access-token"
  )?.value;
  if (!access_token) {
    logError(
      "DELETE /api/application",
      "Unauthorized: No Supabase access token"
    );
    return NextResponse.json(
      {
        error:
          "Unauthorized: Invalid or missing authentication.",
      },
      { status: 401 }
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json(
      { error: "Missing application id" },
      { status: 400 }
    );
  }
  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("DELETE /api/application", userError);
    return NextResponse.json(
      { error: "Failed to get user from access token" },
      { status: 401 }
    );
  }
  const user_id = userData.user.id;
  const { error } = await supabaseUser
    .from("application")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);
  if (error) {
    logError("DELETE /api/application", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true });
}
