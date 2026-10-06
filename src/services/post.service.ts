// src/services/post.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";
import type { Locale } from "./product.service";

export interface PostItemDTO {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
}

export const getPublishedPostsService = (locale: Locale) =>
  unstable_cache(
    async (): Promise<PostItemDTO[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
          collection: "posts",
          locale,
          where: { status: { equals: "published" } },
          sort: "-publishedAt",
          depth: 1,
        });

        return res.docs.map((doc: any) => ({
          id: String(doc.id),
          title: doc.title || "",
          slug: doc.slug || "",
          excerpt: doc.excerpt || "",
          coverImage:
            typeof doc.coverImage === "object"
              ? doc.coverImage?.url
              : undefined,
          publishedAt: doc.publishedAt || doc.createdAt,
        }));
      } catch (err) {
        console.error("Error fetching posts:", err);
        return [];
      }
    },
    ["published-posts-cache", locale],
    { revalidate: 3600, tags: ["posts"] },
  )();

export const getPostBySlugService = (slug: string, locale: Locale) =>
  unstable_cache(
    async () => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
          collection: "posts",
          locale,
          where: {
            and: [
              { slug: { equals: slug } },
              { status: { equals: "published" } },
            ],
          },
          limit: 1,
          depth: 1,
        });
        return res.docs[0] || null;
      } catch {
        return null;
      }
    },
    ["post-detail-by-slug", slug, locale],
    { revalidate: 3600, tags: ["posts", `post-${slug}`] },
  )();
