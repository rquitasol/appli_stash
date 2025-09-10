import crypto from "crypto";

export function encryptPassword(password: string): string {
  const secret = process.env.PASSWORD_SECRET;
  if (!secret) throw new Error("Missing PASSWORD_SECRET env variable");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
  return hash;
}
