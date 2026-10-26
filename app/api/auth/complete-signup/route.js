
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import pendingVerifications from "@/lib/pending-verifications";

export async function POST(request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string"
        ? body.username.trim().toLowerCase()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password = body.password;

    // Validate the registration details.
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must contain 3–30 lowercase letters, numbers, or underscores.",
        },
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

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and no more than 72 UTF-8 bytes.",
        },
        { status: 400 }
      );
    }

    // Check the server-side verification record.
    // Do not trust a verification status sent by the frontend.
    const pending = pendingVerifications.get(email);

    if (!pending || pending.verified !== true) {
      return NextResponse.json(
        { error: "Please verify your email before completing registration." },
        { status: 403 }
      );
    }

    // The verification must still be within its validity period.
    if (pending.expiresAt <= Date.now()) {
      pendingVerifications.delete(email);

      return NextResponse.json(
        { error: "Your verification has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Check whether the username or email is already registered.
    const existingUser = await pool.query(
      `SELECT id
       FROM users
       WHERE username = $1 OR email = $2
       LIMIT 1`,
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "Username or email is already registered." },
        { status: 409 }
      );
    }

    // Hash the password before saving it.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the verified account.
    const result = await pool.query(
      `INSERT INTO users (
        username,
        email,
        password_hash,
        email_verified
      )
      VALUES ($1, $2, $3, TRUE)
      RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    // Remove the temporary verification record after successful insertion.
    pendingVerifications.delete(email);

    return NextResponse.json(
      {
        message: "Your account has been created successfully!",
        user: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complete signup error:", error);

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Username or email is already registered." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while creating your account." },
      { status: 500 }
    );
  }
}
