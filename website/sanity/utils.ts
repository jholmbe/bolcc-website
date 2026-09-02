import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { client } from "./client";

/**
 * Shared options for every `client.fetch` call. Change the revalidate window
 * here once instead of in every page.
 */
export const SANITY_FETCH = { next: { revalidate: 30 } };

const { projectId, dataset } = client.config();

/**
 * Build an image URL from a Sanity image reference. Returns `null` when the
 * client is not configured (keeps callers null-safe).
 */
export const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
