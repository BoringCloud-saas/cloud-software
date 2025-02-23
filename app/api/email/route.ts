import { NextResponse, NextRequest } from "next/server";

import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm";

import jwt from "jsonwebtoken";
import axios from "axios"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();  

        const authToken = request.cookies.get('auth_token');
        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token found' }, { status: 401 });
        }
        const SECRET = process.env.SECRET;
        if (!SECRET) {
            return NextResponse.json({ message: "env Problem in prove Auth" }, { status: 400 });
        }

        const historyID = body.historyID;   
        const stringToken = authToken.value;

        const decoded = jwt.verify(stringToken, SECRET) as jwt.JwtPayload
        const accessToken = decoded.accessToken;
        try {
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.access_token, accessToken))
                .limit(1);
            
            console.log("existingUser ------>", existingUser)
            if (existingUser.length > 0) {
                const sub = existingUser[0].sub
                try {
                    const user = await db.select().from(users).where(eq(users.sub, sub)).limit(1);
                    const DBH = user[0].historyID

                    console.log("DBH -->", DBH)
                } catch (err) {
                    console.error(err)
                }
            }
        } catch (err) {
            console.error(err)
        }

        return NextResponse.json({ message: "success", status: 200 })
    } catch (err) {
        return NextResponse.json({ message: "validating email catch error", status: 400 })
    }
}