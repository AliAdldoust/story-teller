
import { NextResponse } from "next/server";
import pool from "@/lib/db";


export async function GET(){
            
    try{

        const result = await pool.query(
      "SELECT id, title, image_url, content FROM stories ORDER BY id DESC")

      return NextResponse.json(result.rows)

    }catch(error){
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { message: "Failed to fetch stories" },
      { status: 500 }
    )

    }

}