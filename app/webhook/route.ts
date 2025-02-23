import { NextRequest, NextResponse } from "next/server"

import axios from "axios"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const base64Data = body?.message?.data
        if (base64Data) {
            const buffer = Buffer.from(base64Data, 'base64');
            const decoded = JSON.parse(buffer.toString());
            const historyID = decoded.historyId

            const eventSourceUrl = "https://85fa1bc9fb46.ngrok.app/api";
            await fetch(eventSourceUrl, {
                method: "POST",
                body: JSON.stringify({ historyID }),
                headers: {
                  "Content-Type": "application/json",
                },
            });
        }
        return NextResponse.json({ message: "success", status: "200" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Web hook Failed", status: "400" });
    }
}