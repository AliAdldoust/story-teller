import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import pool from "@/lib/db";



export async function GET(){


    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
                return NextResponse.json(
                    { error: "You must log in first." },
                    { status: 401 }
                );
                }


        const secretValue = process.env.AUTH_SECRET;

        const secret = new TextEncoder().encode(secretValue);

                if (!secretValue) {
                throw new Error("AUTH_SECRET is not configured.");
                }

        const { payload } = await jwtVerify(token, secret, {
                algorithms: ["HS256"],
                });


        const userId = payload.sub;


        const result = await pool.query(
            `SELECT id, username, email
            FROM users
            WHERE id = $1`,
            [userId]
            );

        const user = result.rows[0];

        if (!user) {
            return NextResponse.json({error: "user account not found"}, {
                status: 401
            })
        }

        return NextResponse.json({ user });


    }catch(error){

        console.log("Profile API error:", error);

        return NextResponse.json({error: "Unable to retrieve your profile."}, 
            {status: 500}
        )

    }


}





