import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseForUser } from '../../../lib/supabaseClient';
import { logError, getAccessToken } from '../../../lib/jwtUtils';
import { handleCORS, handleOPTIONS } from '../../../lib/corsHandler';

import { ApplicationPriority, ApplicationStatus } from '@shared/types';

export interface Application {
  id?: string;
  user_id: string;
  company_name: string;
  url: string;
  status: ApplicationStatus;
  position: string;
  priority_level: ApplicationPriority;
  notes: string;
}

// CREATE
export async function POST(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError('POST /api/application', 'Unauthorized: No Supabase access token');
    return handleCORS(
      request,
      NextResponse.json(
        {
          error: 'Unauthorized: Invalid or missing authentication.',
        },
        { status: 401 }
      )
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
  }: {
    company_name: string;
    url: string;
    status: ApplicationStatus;
    position: string;
    priority_level: ApplicationPriority;
    notes: string;
  } = body;
  // Get user id from JWT
  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError('POST /api/application', userError);
    return handleCORS(
      request,
      NextResponse.json({ error: 'Failed to get user from access token' }, { status: 401 })
    );
  }
  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from('application')
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
    logError('POST /api/application', error);
    return handleCORS(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }
  return handleCORS(request, NextResponse.json(data[0], { status: 201 }));
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function OPTIONS(request: NextRequest) {
  return handleOPTIONS(request);
}

// READ (all for user)
export async function GET(request: NextRequest) {
  // If userId is provided as a query param, fetch all applications for that user (admin/API use)
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get('userId');
  const searchQuery = searchParams.get('search');

  if (userIdParam) {
    // Only allow this for authorized/admin users in production!
    const access_token = getAccessToken(request);

    if (!access_token) {
      return handleCORS(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }
    const supabaseUser = getSupabaseForUser(access_token);
    const { data, error } = await supabaseUser
      .from('application')
      .select('*')
      .eq('user_id', userIdParam);
    if (error) {
      return handleCORS(request, NextResponse.json({ error: error.message }, { status: 500 }));
    }
    return handleCORS(request, NextResponse.json(data));
  }

  // Default: get all applications for the current user (from JWT)
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError('GET /api/application', 'Unauthorized: No Supabase access token');
    return handleCORS(
      request,
      NextResponse.json(
        {
          error: 'Unauthorized: Invalid or missing authentication.',
        },
        { status: 401 }
      )
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  // Get user id from JWT
  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError('GET /api/application', userError);
    return handleCORS(
      request,
      NextResponse.json({ error: 'Failed to get user from access token' }, { status: 401 })
    );
  }
  const user_id = userData.user.id;

  // Build query with search functionality
  let query = supabaseUser.from('application').select('*').eq('user_id', user_id);

  // Add search filters if search query is provided
  if (searchQuery && searchQuery.trim()) {
    const trimmedQuery = searchQuery.trim();
    query = query.or(`company_name.ilike.%${trimmedQuery}%,position.ilike.%${trimmedQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    logError('GET /api/application', error);
    return handleCORS(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }
  return handleCORS(request, NextResponse.json(data));
}

// UPDATE
export async function PUT(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError('PUT /api/application', 'Unauthorized: No Supabase access token');
    return handleCORS(
      request,
      NextResponse.json(
        {
          error: 'Unauthorized: Invalid or missing authentication.',
        },
        { status: 401 }
      )
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const { id, company_name, url, status, position, priority_level, notes } = body;
  if (!id) {
    return handleCORS(
      request,
      NextResponse.json({ error: 'Missing application id' }, { status: 400 })
    );
  }
  // Get user id from JWT
  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError('PUT /api/application', userError);
    return handleCORS(
      request,
      NextResponse.json({ error: 'Failed to get user from access token' }, { status: 401 })
    );
  }
  const user_id = userData.user.id;
  const { data, error } = await supabaseUser
    .from('application')
    .update({
      company_name,
      url,
      status,
      position,
      priority_level,
      notes,
    })
    .eq('id', id)
    .eq('user_id', user_id)
    .select();
  if (error) {
    logError('PUT /api/application', error);
    return handleCORS(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }
  return handleCORS(request, NextResponse.json(data[0]));
}

// DELETE
export async function DELETE(request: NextRequest) {
  const access_token = getAccessToken(request);

  if (!access_token) {
    logError('DELETE /api/application', 'Unauthorized: No Supabase access token');
    return handleCORS(
      request,
      NextResponse.json(
        {
          error: 'Unauthorized: Invalid or missing authentication.',
        },
        { status: 401 }
      )
    );
  }
  const supabaseUser = getSupabaseForUser(access_token);
  const body = await request.json();
  const { id } = body;
  if (!id) {
    return handleCORS(
      request,
      NextResponse.json({ error: 'Missing application id' }, { status: 400 })
    );
  }
  // Get user id from JWT
  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    logError('DELETE /api/application', userError);
    return handleCORS(
      request,
      NextResponse.json({ error: 'Failed to get user from access token' }, { status: 401 })
    );
  }
  const user_id = userData.user.id;
  const { error } = await supabaseUser
    .from('application')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) {
    logError('DELETE /api/application', error);
    return handleCORS(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }
  return handleCORS(request, NextResponse.json({ success: true }));
}
