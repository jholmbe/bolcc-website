import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "iala0u3l",
  dataset: "production",
  apiVersion: "2026-03-23",
  useCdn: false,
});