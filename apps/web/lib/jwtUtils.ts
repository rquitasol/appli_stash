// logError is still used, but all JWT helpers are removed. If needed, move logError elsewhere.
import { NextRequest } from "next/server";

export function logError(context: string, error: unknown) {
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

/**
 * Extracts the access token from a request
 * Looks in cookies first, then Authorization header
 * @param request The NextRequest object
 * @returns The access token or null if not found
 */
export function getAccessToken(
  request: NextRequest
): string | null {
  // Check for token in cookie first
  let access_token =
    request.cookies.get("sb-access-token")?.value || null;

  // If not in cookie, check Authorization header
  if (!access_token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      access_token = authHeader.substring(7);
    }
  }

  return access_token;
}
