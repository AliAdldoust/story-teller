

import {NextResponse} from 'next/server'

import bcrypt from "bcrypt";
import pool from "@/lib/db";




export async function POST(request){

    try{

        const {username, email, password} = await request.json();


        if (!username || !email || !password){
            return NextResponse.json(
                {error: "email, and password are required. "},
                { status: 400 }
            )
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


        if (typeof password !== "string" ||
                password.length < 6 ||
                Buffer.byteLength(password, "utf8") > 72) {
            return NextResponse.json(
                {
                error:
                    "Password must be at least 6 characters and no more than 72 UTF-8 bytes.",
                },
                { status: 400 }
            );
            }

        const passwordHash = await bcrypt.hash(password, 12);



        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING username, email`,
            [username, email, passwordHash]
            );


            return NextResponse.json({message:"account created succesfully", 
                user: result.rows[0],}, 
                {status: 201}
            )

        


    } catch(error){

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Username or email is already registered." },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating your account." },
      { status: 500 }
    )






    }




} 