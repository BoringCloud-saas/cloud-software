import { NextRequest, NextResponse } from "next/server"

import axios from "axios"
import jwt from "jsonwebtoken"

import { db } from "@/db/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token');

        if (!authToken) {
            console.log("No auth token found !");
            return NextResponse.json({ message: 'Auth token not found' }, { status: 401 });
        }

        const SECRET = process.env.SECRET;
        if (!SECRET) {
            return NextResponse.json({ message: "env Problem in prove Auth" }, { status: 400 });
        }

        const stringToken = authToken.value;
        const decoded = jwt.verify(stringToken, SECRET) as jwt.JwtPayload;
        if (decoded && typeof decoded === "object" && "accesstoken" in decoded) {
            const accessToken = decoded.accesstoken
            try {
                const response = await axios.post(
                    "https://gmail.googleapis.com/gmail/v1/users/me/watch",
                    {
                      labelIds: ["INBOX"],  // Überwache nur das INBOX-Label
                      topicName: "projects/the-boring-cloud-450516/topics/SaaSTopic",  // Das Topic, das du verwenden möchtest
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,  // Bearer Token für Authentifizierung
                      },
                    }
                );
                
                console.log("Watch request successful:", response.data);

                return NextResponse.json({ message: "Watch request successful", status: 200 });
            } catch (err) {
                console.error(err)
                return NextResponse.json({ message: "Catch error: Watch request not successful", status: 200 });
            }
        } else {
            console.log("jwt missmatch in proveAuth")
            return NextResponse.json({ message: "jwt missmatch in proveAuth", status: 200 })
        }
    } catch (err) {
        console.log("PGmail watch request Catch Error")
        return NextResponse.json({ message: err, status: 400 })
    }
}