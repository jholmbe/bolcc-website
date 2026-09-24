import { createClient } from "next-sanity";

/**
 * Authenticated Sanity client for webhook writes. Never import this into a
 * Client Component — the token must stay server-side.
 */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is not set");
  }

  return createClient({
    projectId: "iala0u3l",
    dataset: "production",
    apiVersion: "2026-03-23",
    useCdn: false,
    token,
  });
}
