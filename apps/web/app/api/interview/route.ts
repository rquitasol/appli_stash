import { NextRequest, NextResponse } from "next/server";
import { getSupabaseForUser } from "../../../lib/supabaseClient";
import {
  logError,
  getAccessToken,
} from "../../../lib/jwtUtils";
import {
  handleCORS,
  handleOPTIONS,
} from "../../../lib/corsHandler";

export interface Interview {
  id?: string;
  user_id?: string;
  application_id?: number;
  type: string;
  schedule: string; // timestamp
  interviewer: string;
  status: string;
  notes: string;
}

// CREATE
export async function POST(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError(
      "POST /api/interview",
      "Unauthorized: No Supabase access token"
    );
    return handleCORS(
      request,
      NextResponse.json(
        {
          error:
            "Unauthorized: Invalid or missing authentication.",
        },
        { status: 401 }
      )
    );
  }

  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const {
    application_id,
    type,
    schedule,
    interviewer,
    status,
    notes,
  }: {
    application_id?: number;
    type: string;
    schedule: string;
    interviewer: string;
    status: string;
    notes: string;
  } = body;

  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("POST /api/interview", userError);
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Failed to get user from access token" },
        { status: 401 }
      )
    );
  }

  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from("interview")
    .insert([
      {
        user_id,
        application_id,
        type,
        schedule,
        interviewer,
        status,
        notes,
      },
    ])
    .select();

  if (error) {
    logError("POST /api/interview", error);
    return handleCORS(
      request,
      NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    );
  }

  return handleCORS(
    request,
    NextResponse.json(data[0], { status: 201 })
  );
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function OPTIONS(request: NextRequest) {
  return handleOPTIONS(request);
}

// READ (all for user)
export async function GET(request: NextRequest) {
  // If userId is provided as a query param, fetch all interviews for that user (admin/API use)
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");
  const searchQuery = searchParams.get("search");

  if (userIdParam) {
    // Only allow this for authorized/admin users in production!
    const access_token = getAccessToken(request);

    if (!access_token) {
      return handleCORS(
        request,
        NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      );
    }

    const supabaseUser = getSupabaseForUser(access_token);

    // Build query with search functionality for admin use
    let query = supabaseUser
      .from("interview")
      .select("*")
      .eq("user_id", userIdParam);

    // Add search filters if search query is provided
    if (searchQuery && searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim();
      query = query.or(
        `company_name.ilike.%${trimmedQuery}%,position.ilike.%${trimmedQuery}%,interviewer.ilike.%${trimmedQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return handleCORS(
        request,
        NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      );
    }

    return handleCORS(request, NextResponse.json(data));
  }

  // Normal user request - get interviews for authenticated user
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError(
      "GET /api/interview",
      "Unauthorized: No Supabase access token"
    );
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    );
  }

  const supabaseUser = getSupabaseForUser(access_token);

  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("GET /api/interview", userError);
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Failed to get user from access token" },
        { status: 401 }
      )
    );
  }

  const user_id = userData.user.id;

  // Build query with search functionality
  let query = supabaseUser
    .from("interview")
    .select("*")
    .eq("user_id", user_id);

  // Add search filters if search query is provided
  if (searchQuery && searchQuery.trim()) {
    const trimmedQuery = searchQuery.trim();
    query = query.or(
      `company_name.ilike.%${trimmedQuery}%,position.ilike.%${trimmedQuery}%,interviewer.ilike.%${trimmedQuery}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    logError("GET /api/interview", error);
    return handleCORS(
      request,
      NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    );
  }

  return handleCORS(request, NextResponse.json(data));
}

// UPDATE
export async function PUT(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError(
      "PUT /api/interview",
      "Unauthorized: No Supabase access token"
    );
    return handleCORS(
      request,
      NextResponse.json(
        {
          error:
            "Unauthorized: Invalid or missing authentication.",
        },
        { status: 401 }
      )
    );
  }

  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const {
    id,
    application_id,
    type,
    schedule,
    interviewer,
    status,
    notes,
  }: {
    id: string;
    application_id?: number;
    type: string;
    schedule: string;
    interviewer: string;
    status: string;
    notes: string;
  } = body;

  if (!id) {
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Interview ID is required for update" },
        { status: 400 }
      )
    );
  }

  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("PUT /api/interview", userError);
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Failed to get user from access token" },
        { status: 401 }
      )
    );
  }

  const user_id = userData.user.id;

  // Update the interview, ensuring it belongs to the authenticated user
  const { data, error } = await supabaseUser
    .from("interview")
    .update({
      application_id,
      type,
      schedule,
      interviewer,
      status,
      notes,
    })
    .eq("id", id)
    .eq("user_id", user_id) // Ensure user can only update their own interviews
    .select();

  if (error) {
    logError("PUT /api/interview", error);
    return handleCORS(
      request,
      NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    );
  }

  if (!data || data.length === 0) {
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Interview not found or access denied" },
        { status: 404 }
      )
    );
  }

  return handleCORS(
    request,
    NextResponse.json(data[0], { status: 200 })
  );
}

// DELETE
export async function DELETE(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError(
      "DELETE /api/interview",
      "Unauthorized: No Supabase access token"
    );
    return handleCORS(
      request,
      NextResponse.json(
        {
          error:
            "Unauthorized: Invalid or missing authentication.",
        },
        { status: 401 }
      )
    );
  }

  const supabaseUser = getSupabaseForUser(access_token);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Interview ID is required for deletion" },
        { status: 400 }
      )
    );
  }

  // Get user id from JWT
  const { data: userData, error: userError } =
    await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError("DELETE /api/interview", userError);
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Failed to get user from access token" },
        { status: 401 }
      )
    );
  }

  const user_id = userData.user.id;

  // Delete the interview, ensuring it belongs to the authenticated user
  const { data, error } = await supabaseUser
    .from("interview")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id) // Ensure user can only delete their own interviews
    .select();

  if (error) {
    logError("DELETE /api/interview", error);
    return handleCORS(
      request,
      NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    );
  }

  if (!data || data.length === 0) {
    return handleCORS(
      request,
      NextResponse.json(
        { error: "Interview not found or access denied" },
        { status: 404 }
      )
    );
  }

  return handleCORS(
    request,
    NextResponse.json(
      { message: "Interview deleted successfully" },
      { status: 200 }
    )
  );
}
