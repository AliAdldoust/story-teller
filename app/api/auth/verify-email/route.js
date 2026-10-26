import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import pool from "@/lib/db";



export async function POST(request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(code)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid email address and six-digit code." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, email_verified, email_verification_code_hash,
              email_verification_expires_at
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or verification code." },
        { status: 400 }
      );
    }

    if (user.email_verified) {
      return NextResponse.json({
        message: "Your email is already verified.",
      });
    }

    if (
      !user.email_verification_code_hash ||
      !user.email_verification_expires_at ||
      new Date(user.email_verification_expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { error: "Your verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const submittedHash = createHash("sha256").update(code).digest();
    const storedHash = Buffer.from(
      user.email_verification_code_hash,
      "hex"
    );

    if (
      storedHash.length !== submittedHash.length ||
      !timingSafeEqual(storedHash, submittedHash)
    ) {
      return NextResponse.json(
        { error: "Incorrect verification code." },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE users
       SET email_verified = TRUE,
           email_verification_code_hash = NULL,
           email_verification_expires_at = NULL
       WHERE id = $1`,
      [user.id]
    );

    return NextResponse.json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying your email." },
      { status: 500 }
    );
  }
}