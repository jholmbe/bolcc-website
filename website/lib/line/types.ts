export type LineSource = {
  type: string;
  groupId?: string;
  userId?: string;
};

export type LineContentProvider = {
  type: "line" | "external";
  originalContentUrl?: string;
};

export type LineMessage = {
  id: string;
  type: string;
  text?: string;
  contentProvider?: LineContentProvider;
};

export type LineEvent = {
  type: string;
  mode?: string;
  timestamp?: number;
  replyToken?: string;
  source?: LineSource;
  message?: LineMessage;
  unsend?: { messageId: string };
};

export type LineWebhookBody = {
  destination?: string;
  events?: LineEvent[];
};
