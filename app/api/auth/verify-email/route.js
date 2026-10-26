
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import pendingVerifications from "@/lib/pending-verifications";

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

    // Retrieve the temporary verification information.
    const pending = pendingVerifications.get(email);

    if (!pending) {
      return NextResponse.json(
        { error: "No pending verification was found. Please request a new code." },
        { status: 400 }
      );
    }

    // Check whether the code has expired.
    if (pending.expiresAt <= Date.now()) {
      pendingVerifications.delete(email);

      return NextResponse.json(
        { error: "Your verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the submitted code.
    const submittedHash = createHash("sha256")
      .update(code)
      .digest();

    const storedHash = Buffer.from(pending.codeHash, "hex");

    // Compare the hashes safely.
    if (
      storedHash.length !== submittedHash.length ||
      !timingSafeEqual(storedHash, submittedHash)
    ) {
      return NextResponse.json(
        { error: "Incorrect verification code." },
        { status: 400 }
      );
    }

    // Mark this email as verified temporarily.
    pendingVerifications.set(email, {
      ...pending,
      verified: true,
      verifiedAt: Date.now(),
    });

    return NextResponse.json({
      message: "Email verified successfully! You can now complete registration.",
      verified: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      { error: "Something went wrong while verifying your email." },
      { status: 500 }
    );
  }
}
