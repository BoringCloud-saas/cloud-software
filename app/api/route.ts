import { NextRequest, NextResponse } from "next/server";

let historyID: string | null = null;
let lastSentID: string | null = null;

const setCorsHeaders = (res: NextResponse) => {
    res.headers.set("Access-Control-Allow-Origin", "*"); // Erlaubt alle Ursprünge
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Erlaubte Methoden
    res.headers.set("Access-Control-Allow-Headers", "Content-Type"); // Erlaubte Header
    return res;
};

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      if (body.historyID) {
        historyID = body.historyID;
        console.log("SSE ------> ", historyID)
      }
  
      return setCorsHeaders(NextResponse.json({ message: "Success", status: "200" }));
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Anfrage:", error);
      return setCorsHeaders(NextResponse.json({ message: "Failed", status: "400" }));
    }
}

export async function GET(req: NextRequest) {
    let lastSentID: string | null = null;
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue('data: "200 OK"\n\n');

            const heartbeatInterval = setInterval(() => {
            controller.enqueue('data: "heartbeat"\n\n');
            }, 30000);

            const interval = setInterval(() => {
                if (historyID !== null && historyID !== lastSentID) {
                  controller.enqueue(`data: ${JSON.stringify({ historyID })}\n\n`);
                  lastSentID = historyID; // Aktualisiere die zuletzt gesendete ID
                  historyID = null;
                }
            }, 2000);

            req.signal.addEventListener('abort', () => {
                clearInterval(interval);
                clearInterval(heartbeatInterval); // Stoppe den Heartbeat
                controller.close(); // Schließe den Stream
            });
        }
    })

    return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
    });
}