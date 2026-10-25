


import {NextResponse} from 'next/server'
import pool from "@/lib/db";

export async function GET(request, {params}){

    try{

        const { id } = await params;
        const result = await pool.query('SELECT id, title, content, image_url FROM stories WHERE id = $1', 
            [id]
        )

        return NextResponse.json(result.rows[0])



    }catch{
            console.error("Error fetching story:", error);

            return NextResponse.json(
            { message: "Failed to fetch story" },
            { status: 500 }
            );


    }

}