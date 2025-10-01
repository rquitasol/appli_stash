import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '../../../lib/jwtUtils';

export async function GET(request: NextRequest) {
  const access_token = getAccessToken(request);
  if (!access_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Use Supabase client to get user info from access_token
  const { getSupabaseForUser } = await import('../../../lib/supabaseClient');
  const supabaseUser = getSupabaseForUser(access_token);
  const { data: userData, error: userError } = await supabaseUser.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, email, user_metadata } = userData.user;
  const name = user_metadata?.name || null;
  return NextResponse.json({
    id,
    email,
    name,
    token: access_token, // Include token in the response for the extension
  });
}
