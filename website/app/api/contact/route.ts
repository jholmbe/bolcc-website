import { NextResponse } from "next/server";
import { Resend } from "resend";

import { DEFAULT_LOCALE } from "@/i18n/config";
import { client } from "@/sanity/client";
import { CONTACT_PAGE_QUERY, type ContactPageContent } from "@/sanity/queries";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const recentSubmissions = new Map<string, number[]>();

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  recentSubmissions.set(ip, timestamps);
  return false;
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots that fill hidden fields are rejected quietly.
  if (asTrimmedString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const message = asTrimmedString(body.message);

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.error("Missing RESEND_API_KEY or CONTACT_FROM_EMAIL");
    return NextResponse.json(
      { error: "Contact form is not configured" },
      { status: 503 },
    );
  }

  const content = await client.fetch<ContactPageContent>(CONTACT_PAGE_QUERY, {
    locale: DEFAULT_LOCALE,
  });

  const toEmail = content?.email?.trim();
  if (!toEmail || !EMAIL_PATTERN.test(toEmail)) {
    console.error("contactPage.email is missing or invalid");
    return NextResponse.json(
      { error: "Contact form is not configured" },
      { status: 503 },
    );
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message || "(No message provided)",
  ].filter((line): line is string => line !== null);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Website contact from ${name}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
