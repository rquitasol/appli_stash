import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable must be set and not use the default value."
  );
}

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
