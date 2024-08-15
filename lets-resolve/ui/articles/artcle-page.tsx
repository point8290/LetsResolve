import { PlusIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Article from "@/lib/model/Article";
import ArticleItem from "./article-item";
import { fetchArticles } from "@/lib/articleAction";
import EmptyText from "../emptyText";

export default async function ArticlePage() {
  const articles = await fetchArticles();

  return (
    <main className="w-full md:w-2/3 mx-auto py-6">
      <div className="flex rounded-lg  text-sm md:mx-0 h-10 flex-column ">
        <div className="w-1/2 bg-secondary">
          <button
            name="0"
            className={` h-full hover:opacity-60 items-center font-semibold flex grow text-left py-1 px-4 bg-secondary`}
          >
            <AdjustmentsHorizontalIcon height={20} />
            <span className={`pl-1 font-semibold`}>Filter</span>
          </button>
        </div>
        <div className="w-1/2 flex bg-secondary">
          <Link
            href={"/dashboard/articles/create-article"}
            className={`grow h-full hover:opacity-60 py-1 px-4 justify-end bg-secondary items-center font-semibold flex`}
          >
            <PlusIcon height={20} />
            <span className={`pl-1 font-semibold `}>New Article</span>
          </Link>
        </div>
      </div>
      <div>
        {articles && articles.length > 0 ? (
          articles.map((item: Article) => {
            return <ArticleItem key={item.ArticleId} article={item} />;
          })
        ) : (
          <EmptyText text={"No Articles"} />
        )}
      </div>
    </main>
  );
}
