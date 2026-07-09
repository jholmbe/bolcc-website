import { PortableText, type SanityDocument } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("post");
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug, locale },
    options,
  );

  if (!post) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <Link href="/about" className="hover:underline">
          {t("backToPosts")}
        </Link>
        <p className="mt-8">Post not found.</p>
      </main>
    );
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/about" className="hover:underline">
        {t("backToPosts")}
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose">
        <p>
          {t("published")}{" "}
          {new Date(post.publishedAt).toLocaleDateString(
            locale === "zh" ? "zh-CN" : "en-US",
          )}
        </p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
