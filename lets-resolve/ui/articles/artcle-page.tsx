import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Article from "@/lib/model/Article";
import ArticleItem from "./article-item";
import { fetchArticles } from "@/lib/articleAction";
import EmptyText from "../emptyText";

export default async function ArticlePage() {
  const { items: articles } = await fetchArticles();

  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-typography">
            Articles
          </h1>
          <p className="mt-1 text-sm text-muted">
            Your knowledge base, so tickets don&apos;t have to repeat themselves.
          </p>
        </div>
        <Link
          href={"/dashboard/articles/create-article"}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-buttons px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-buttons-hover"
        >
          <PlusIcon className="h-4 w-4" />
          New article
        </Link>
      </div>

      <div className="mt-6 space-y-2.5">
        {articles && articles.length > 0 ? (
          articles.map((item: Article) => {
            return <ArticleItem key={item.ArticleId} article={item} />;
          })
        ) : (
          <EmptyText text={"No articles yet"} />
        )}
      </div>
    </main>
  );
}
