import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harness Labs | Blog",
  description:
    "Thoughts on mathematics, software engineering, and the intersection of theory and practice.",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="flex flex-grow flex-col items-center text-foreground py-20">
      <div className="w-full space-y-16">
        <section className="text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Harness Labs
          </p>
          <h1 className="text-4xl sm:text-5xl mb-12">Blog</h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Thoughts on mathematics, software engineering, and the intersection of theory and
            practice.
          </p>
        </section>

        <section className="max-w-3xl mx-auto w-full">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon.</p>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block border-t py-8 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold group-hover:text-muted-foreground transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground">{post.description}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <time className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
