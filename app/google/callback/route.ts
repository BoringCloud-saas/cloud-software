import { NextResponse, NextRequest } from "next/server";

import axios from "axios"

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const authorizationCode = url.searchParams.get("code");

        return NextResponse.json({ message: "success", status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: err, status: 400 })
    }
}