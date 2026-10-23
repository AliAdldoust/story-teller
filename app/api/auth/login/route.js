import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import pool from "@/lib/db";




const secret = new TextEncoder().encode(process.env.AUTH_SECRET);


export async function POST(request){


    try{


        const body = await request.json();
        const email = body.email.trim().toLowerCase();
        const password = body.password.trim()

        if (!email || !password || Buffer.byteLength(password, "utf8") > 72){
            return NextResponse.json({
                error: "Please enter your username/email and password." },
        {status: 400})
        }

        const result = await pool.query(
            `SELECT id, username, email, password_hash
            FROM users
            WHERE email = $1`, 
            [email]
        )

        const user = result.rows[0];

        const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) :  false;

        if (!passwordMatches) {
            return NextResponse.json({error: "Invalid username/email or password."}, {status: 401})
            
        }




        const token = await new SignJWT({username: user.username})
                .setProtectedHeader({ alg: "HS256" })
                .setSubject(String(user.id))
                .setIssuedAt()
                .setExpirationTime("7d")
                .sign(secret);




        const response = NextResponse.json({message: "Login successful!", user: {id: user.id, 
            email: user.email, username: user.username
        }})

        response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        });

        return response;



    }catch(error){

        console.error("login error", error);
        return NextResponse.json({error: "Something went wrong while logging in."}, {status: 500})
    }




}