import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import jwt from "jsonwebtoken";
import axios from "axios"

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token');

        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'No auth token found' }, { status: 401 });
        }
        const SECRET = process.env.SECRET;
        if (!SECRET) {
            return NextResponse.json({ message: "env Problem in prove Auth" }, { status: 400 });
        }

        try {
            const stringToken = authToken.value;
            const decoded = jwt.verify(stringToken, SECRET) as jwt.JwtPayload;
            if (decoded && typeof decoded === "object" && "accesstoken" in decoded) {
                const accessToken = decoded.accesstoken;

                const result = await db.select().from(users).where(eq(users.access_token, accessToken))
                if (result.length === 0) {
                    return NextResponse.json({ message: "accessToken not found in proveAuth", status: 200 })
                } else {
                    try {
                        const response = await axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo", {
                            params: { access_token: accessToken },
                        });
                        const data = response.data;
                        const expiresInSeconds = parseInt(data.expires_in, 10);
                        const minutes = Math.floor(expiresInSeconds / 60);
                        const seconds = expiresInSeconds % 60;
        
                        const result = await db.select().from(users)
                        const userInfo = result[0]
                        const { name } = userInfo
        
                        console.log(`Token läuft ab in: ${minutes} Minuten und ${seconds} Sekunden`);

                        return NextResponse.json({ message: "success", name: name, status: 200 })
                    } catch (err) {
                        console.log("1")
                        const result = await db.select().from(users).where(eq(users.access_token, accessToken))
                        const refreshToken = result[0].refresh_token
                        console.log("2")

                        const tokenUrl = 'https://oauth2.googleapis.com/token';
                        const tokenResponse = await fetch(tokenUrl, {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams({
                                client_id: process.env.GOOGLE_CLIENT_ID || "",
                                client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
                                refresh_token: refreshToken,
                                grant_type: "refresh_token",
                            }).toString(),
                        });
                        console.log("3")
                        const data = await tokenResponse.json()
                        const accesstoken = data.access_token
                        try {
                            const x = await db
                                .update(users)
                                .set({access_token: accesstoken})
                                .where(eq(users.access_token, accesstoken))

                            
                            console.log(x)
                            console.log("new token -------->", accesstoken)
                            console.log("4")
                            const SECRET = process.env.SECRET
                            if (!SECRET) {
                                return NextResponse.json({ message: "env Problem in callback route" }, { status: 400 });
                            }
                            console.log("5")
                            const result = await db.select().from(users).where(eq(users.access_token, accesstoken))
                            console.log("6")
                            const userInfo = result[0]
                            console.log("7")
                            const { name } = userInfo
                            console.log("8")

                            console.log("new access token", accesstoken)
                            const jwtToken = jwt.sign({ accesstoken }, SECRET, { expiresIn: "24h" });
                            console.log("9")
                            const response = NextResponse.json({ message: name }, { status: 200 });
                            console.log("10")
                            response.cookies.set("auth_token", jwtToken, {
                                httpOnly: true,
                                secure: true,
                                path: "/",
                            });
                            return response
                        } catch (err) {
                            console.error(err)
                            return NextResponse.json({ message: "Something went wrong, please try again later", status: 200 })
                        }
                    }
                }
            } else {
                console.log("JWT IF ERROR")
            }
        } catch (err) {
            console.log("jwt missmatch in proveAuth")
            return NextResponse.json({ message: "jwt missmatch in proveAuth", status: 200 })
        }
        return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log("Prove Auth Catch Error")
        return NextResponse.json({ message: err, status: 400 })
    }
}