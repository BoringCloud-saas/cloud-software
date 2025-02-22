import { NextResponse, NextRequest } from "next/server";

import { eq } from "drizzle-orm"; 
import { users } from "@/db/schema"
import { db } from "@/db/db"

import jwt from "jsonwebtoken"
import axios from "axios"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const authorizationCode = url.searchParams.get("code");

        if (!authorizationCode) {
            return NextResponse.json({ message: "Kein Authorization Code erhalten" }, { status: 400 });
        }

        const tokenUrl = "https://oauth2.googleapis.com/token";
        const params = new URLSearchParams();

        params.append("code", authorizationCode);
        params.append("client_id", process.env.GOOGLE_CLIENT_ID || "");
        params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "");
        params.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL || "");
        params.append("grant_type", "authorization_code");

        const tokenResponse = await axios.post(tokenUrl, params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token || null;

        const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
        const userInfoResponse = await axios.get(userInfoUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const { sub, name, given_name, family_name, email } = userInfoResponse.data;

        const existingUser = await db.select().from(users).where(eq(users.sub, sub)).limit(1)
        if (existingUser.length > 0) {
            const userAccessToken = existingUser[0].access_token;
            await db
                .update(users)
                .set({access_token: accessToken})
                .where(eq(users.access_token, userAccessToken));
        } else {
            const x = await db.insert(users).values({
                access_token: accessToken,
                refresh_token: refreshToken,
                sub,
                name,
                given_name,
                family_name,
                email,
                historyID: 'default',
            });
            console.log(x)
        }

        const SECRET = process.env.SECRET
        if (!SECRET) {
            return NextResponse.json({ message: "env Problem in callback route" }, { status: 400 });
        }

        const jwtToken = jwt.sign({ accessToken }, SECRET, { expiresIn: "2h" });

        const response = NextResponse.redirect("https://85fa1bc9fb46.ngrok.app/home");

        response.cookies.set("auth_token", jwtToken, {
            httpOnly: true,
            secure: true,
            path: "/",
        });
    
        return response;
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: err, status: 400 })
    }
}