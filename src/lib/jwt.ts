import jwt from "jsonwebtoken";

export interface JwtUser {
  id: string;
  email: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable must be set and not use the default value."
  );
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  } catch {
    return null;
  }
}
