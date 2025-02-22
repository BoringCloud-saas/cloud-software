import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const base64Data = body?.message?.data
        if (base64Data) {
            const buffer = Buffer.from(base64Data, 'base64');
            const decoded = JSON.parse(buffer.toString());
            const historyID = decoded.historyId
            console.log("------------------------->", historyID)
        }
        return NextResponse.json({ message: "success", status: "200" });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ message: "Web hook Failed", status: "400" });
    }
}