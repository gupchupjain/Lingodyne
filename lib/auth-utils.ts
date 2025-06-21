import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function isOTPExpired(expiresAt: string): boolean {
  return new Date() > new Date(expiresAt)
}
