import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles CORS headers for API routes
 * @param req The Next.js request object
 * @param res The Next.js response object to be modified with CORS headers
 */
export function handleCORS(req: NextRequest, res: NextResponse): NextResponse {
  // Get the origin from the request
  const origin = req.headers.get('origin');

  // Clone the response and add CORS headers
  const corsResponse = new NextResponse(res.body, res);

  // Set CORS headers - when using credentials, origin must be specific (not '*')
  if (origin) {
    corsResponse.headers.set('Access-Control-Allow-Origin', origin);
  }
  corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  corsResponse.headers.set('Access-Control-Allow-Credentials', 'true');

  return corsResponse;
}

/**
 * Handles OPTIONS preflight requests for CORS
 */
export function handleOPTIONS(req: NextRequest): NextResponse {
  const res = new NextResponse(null, { status: 204 }); // No content
  const origin = req.headers.get('origin');

  // Set CORS headers for preflight - when using credentials, origin must be specific
  if (origin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
  }
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return res;
}
