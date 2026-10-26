import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, code) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_SENDER_EMAIL,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to My Story!</h2>
        <p>Use the following code to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; background: #f4effa; text-align: center; border-radius: 10px;">
          ${code}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Could not send verification email.");
  }

  return data;
}