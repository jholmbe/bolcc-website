import { revalidatePath } from "next/cache";

import { LOCALES } from "@/i18n/config";
import { getWriteClient } from "@/sanity/writeClient";

import type { LineEvent, LineMessage } from "./types";

const ATTACH_WINDOW_MS = 3 * 60 * 1000;
const LINE_DATA_API = "https://api-data.line.me/v2/bot/message";
const LINE_API = "https://api.line.me/v2/bot";

type StoredAnnouncement = {
  _id: string;
  lineMessageId: string;
  textLineMessageId?: string;
  text?: string;
  imageIds?: string[] | null;
};

function announcementDocId(lineMessageId: string): string {
  return `announcement-${lineMessageId}`;
}

function channelAccessToken(): string {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  }
  return token;
}

function isAllowedGroup(groupId: string): boolean {
  const allowed = process.env.LINE_GROUP_ID;
  if (!allowed) {
    console.warn(
      `[line] LINE_GROUP_ID is not set; accepting group ${groupId}. Set this env var after the first message.`,
    );
    return true;
  }
  return groupId === allowed;
}

function isAllowedUser(userId: string | undefined): boolean {
  const allowed = process.env.LINE_ANNOUNCER_USER_ID;
  if (!allowed) {
    return true;
  }
  return Boolean(userId) && userId === allowed;
}

export function revalidateAnnouncements(): void {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
  }
  revalidatePath("/");
}

export async function replyToLine(
  replyToken: string | undefined,
  text: string,
): Promise<void> {
  if (!replyToken) {
    return;
  }

  const response = await fetch(`${LINE_API}/message/reply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${channelAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  if (!response.ok) {
    console.error(
      "[line] reply failed",
      response.status,
      await response.text().catch(() => ""),
    );
  }
}

async function downloadLineImage(
  message: LineMessage,
): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  if (message.contentProvider?.type === "external") {
    const url = message.contentProvider.originalContentUrl;
    if (!url) {
      throw new Error("External image is missing originalContentUrl");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download external image (${response.status})`);
    }
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      contentType,
      filename: filenameFor(message.id, contentType),
    };
  }

  const response = await fetch(`${LINE_DATA_API}/${message.id}/content`, {
    headers: { Authorization: `Bearer ${channelAccessToken()}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to download LINE image (${response.status})`);
  }
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType,
    filename: filenameFor(message.id, contentType),
  };
}

function filenameFor(messageId: string, contentType: string): string {
  const subtype = contentType.split("/")[1]?.split(";")[0] ?? "jpeg";
  const extension = subtype === "jpeg" ? "jpg" : subtype;
  return `${messageId}.${extension}`;
}

async function findRecentAnnouncement(
  groupId: string,
  userId: string | undefined,
  timestampMs: number,
): Promise<StoredAnnouncement | null> {
  const since = new Date(timestampMs - ATTACH_WINDOW_MS).toISOString();
  const client = getWriteClient();

  const userFilter = userId ? " && userId == $userId" : "";
  return client.fetch<StoredAnnouncement | null>(
    `*[_type == "announcement" && groupId == $groupId${userFilter} && publishedAt > $since]
      | order(publishedAt desc)[0]{
        _id,
        lineMessageId,
        text,
        "imageIds": images[].lineMessageId
      }`,
    { groupId, userId, since },
  );
}

async function findAnnouncementByLineId(
  messageId: string,
): Promise<StoredAnnouncement | null> {
  const client = getWriteClient();
  return client.fetch<StoredAnnouncement | null>(
    `*[_type == "announcement" && (
        lineMessageId == $messageId ||
        textLineMessageId == $messageId ||
        $messageId in images[].lineMessageId
      )][0]{
        _id,
        lineMessageId,
        textLineMessageId,
        text,
        "imageIds": images[].lineMessageId
      }`,
    { messageId },
  );
}

async function uploadImage(message: LineMessage): Promise<{ _id: string }> {
  const { buffer, contentType, filename } = await downloadLineImage(message);
  return getWriteClient().assets.upload("image", buffer, {
    filename,
    contentType,
  });
}

function imageBlock(messageId: string, assetId: string) {
  return {
    _key: messageId,
    _type: "announcementImage",
    lineMessageId: messageId,
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: assetId,
      },
    },
  };
}

async function handleText(event: LineEvent, message: LineMessage): Promise<void> {
  const groupId = event.source?.groupId;
  const userId = event.source?.userId;
  const text = message.text?.trim();
  if (!groupId || !text) {
    return;
  }

  const timestampMs = event.timestamp ?? Date.now();
  const recent = await findRecentAnnouncement(groupId, userId, timestampMs);
  const client = getWriteClient();

  if (recent && !recent.text) {
    await client
      .patch(recent._id)
      .set({ text, textLineMessageId: message.id })
      .commit();
    revalidateAnnouncements();
    await replyToLine(event.replyToken, "Published on the website / 已发布到网站");
    return;
  }

  await client.createIfNotExists({
    _id: announcementDocId(message.id),
    _type: "announcement",
    lineMessageId: message.id,
    textLineMessageId: message.id,
    text,
    images: [],
    publishedAt: new Date(timestampMs).toISOString(),
    groupId,
    userId,
  });
  revalidateAnnouncements();
  await replyToLine(event.replyToken, "Published on the website / 已发布到网站");
}

async function handleImage(
  event: LineEvent,
  message: LineMessage,
): Promise<void> {
  const groupId = event.source?.groupId;
  const userId = event.source?.userId;
  if (!groupId) {
    return;
  }

  if (await findAnnouncementByLineId(message.id)) {
    await replyToLine(event.replyToken, "Published on the website / 已发布到网站");
    return;
  }

  const timestampMs = event.timestamp ?? Date.now();
  const recent = await findRecentAnnouncement(groupId, userId, timestampMs);
  const asset = await uploadImage(message);
  const client = getWriteClient();
  const block = imageBlock(message.id, asset._id);

  if (recent) {
    await client
      .patch(recent._id)
      .setIfMissing({ images: [] })
      .append("images", [block])
      .commit();
    revalidateAnnouncements();
    await replyToLine(event.replyToken, "Published on the website / 已发布到网站");
    return;
  }

  await client.createIfNotExists({
    _id: announcementDocId(message.id),
    _type: "announcement",
    lineMessageId: message.id,
    text: "",
    images: [block],
    publishedAt: new Date(timestampMs).toISOString(),
    groupId,
    userId,
  });
  revalidateAnnouncements();
  await replyToLine(event.replyToken, "Published on the website / 已发布到网站");
}

async function handleEdit(event: LineEvent, message: LineMessage): Promise<void> {
  const text = message.text?.trim();
  if (!text) {
    return;
  }

  const existing = await findAnnouncementByLineId(message.id);
  if (!existing) {
    return;
  }

  await getWriteClient().patch(existing._id).set({ text }).commit();
  revalidateAnnouncements();
  await replyToLine(event.replyToken, "Updated on the website / 已更新到网站");
}

async function handleUnsend(messageId: string): Promise<void> {
  const existing = await findAnnouncementByLineId(messageId);
  if (!existing) {
    return;
  }

  const isImage = existing.imageIds?.includes(messageId) ?? false;
  const isText =
    existing.textLineMessageId === messageId ||
    (existing.lineMessageId === messageId && !isImage);
  const remainingImages =
    existing.imageIds?.filter((id) => id !== messageId) ?? [];
  const remainingText = isText ? "" : existing.text;

  if (!remainingText && remainingImages.length === 0) {
    await getWriteClient().delete(existing._id);
    revalidateAnnouncements();
    return;
  }

  const unsets: string[] = [];
  if (isText) {
    unsets.push("text", "textLineMessageId");
  }
  if (isImage) {
    unsets.push(`images[_key=="${messageId}"]`);
  }
  if (unsets.length > 0) {
    await getWriteClient().patch(existing._id).unset(unsets).commit();
  }
  revalidateAnnouncements();
}

export async function handleLineEvent(event: LineEvent): Promise<void> {
  if (event.mode === "standby") {
    console.info("[line] ignoring standby event", event.type);
    return;
  }

  if (event.type === "join") {
    console.info("[line] Bot joined group", event.source?.groupId);
    return;
  }

  const groupId = event.source?.groupId;
  if (event.source?.type !== "group" || !groupId) {
    console.info("[line] ignoring non-group event", {
      type: event.type,
      sourceType: event.source?.type,
    });
    return;
  }

  if (!isAllowedGroup(groupId)) {
    console.info("[line] ignoring group (LINE_GROUP_ID mismatch)", groupId);
    return;
  }

  if (!isAllowedUser(event.source.userId)) {
    console.info("[line] ignoring user (LINE_ANNOUNCER_USER_ID mismatch)");
    return;
  }

  if (event.type === "unsend" && event.unsend?.messageId) {
    await handleUnsend(event.unsend.messageId);
    return;
  }

  const message = event.message;
  if (!message) {
    return;
  }

  if (event.type === "messageEdited") {
    await handleEdit(event, message);
    return;
  }

  if (event.type !== "message") {
    return;
  }

  if (message.type === "text") {
    await handleText(event, message);
    return;
  }

  if (message.type === "image") {
    await handleImage(event, message);
  }
}
