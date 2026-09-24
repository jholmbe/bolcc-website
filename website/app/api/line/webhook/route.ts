import { NextResponse } from "next/server";

import { handleLineEvent } from "@/lib/line/processWebhook";
import { verifyLineSignature } from "@/lib/line/signature";
import type { LineWebhookBody } from "@/lib/line/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, service: "line-webhook" });
}

export async function POST(request: Request) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) {
    console.error("[line] LINE_CHANNEL_SECRET is not set");
    return new NextResponse("Webhook is not configured", { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifyLineSignature(body, signature, channelSecret)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: LineWebhookBody;
  try {
    payload = JSON.parse(body) as LineWebhookBody;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const events = payload.events ?? [];
  console.info("[line] webhook", {
    eventCount: events.length,
    types: events.map((event) => event.type),
    sourceTypes: events.map((event) => event.source?.type),
    groupIds: events.map((event) => event.source?.groupId),
  });
  for (const event of events) {
    try {
      await handleLineEvent(event);
    } catch (error) {
      console.error("[line] failed to handle event", event.type, error);
      return new NextResponse("Event handling failed", { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
