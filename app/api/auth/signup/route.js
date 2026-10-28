import { NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";
import pool from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import pendingVerifications from "@/lib/pending-verifications";




export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check whether this email already exists in users.
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    // Generate a six-digit verification code.
    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const codeHash = createHash("sha256").update(code).digest("hex");
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Store only the verification information temporarily.
    pendingVerifications.set(email, {
      codeHash,
      expiresAt,
    });

    // Send the code to the email address.
    await sendVerificationEmail(email, code);

    return NextResponse.json(
      {
        message: "Please check your email for the verification code.",
        requiresVerification: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Could not send the verification code." },
      { status: 500 }
    );
  }
}