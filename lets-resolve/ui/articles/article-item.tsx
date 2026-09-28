"use client";
import Link from "next/link";
import { Button } from "../button";
import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { handleArticleDelete } from "@/lib/articleAction";
import { useRouter } from "next/navigation";
import Article from "@/lib/model/Article";
import useAuthUser from "@/app/hooks/use-auth-user";
import Avatar from "../avatar";

export default function ArticleItem({ article }: { article: Article }) {
  const router = useRouter();
  const user = useAuthUser();
  const onEditArticle = () => {
    router.push(`/dashboard/articles/edit-article/${article.ArticleId}`);
  };
  return (
    <div className="card group relative flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:border-accent/30">
      <Link
        href={`/dashboard/articles/article/${article.ArticleId}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <Avatar label={article.Author} />
        <div className="min-w-0">
          <p className="truncate font-medium text-typography">{article.Title}</p>
          <p className="mt-0.5 truncate text-sm text-muted">{article.Description}</p>
        </div>
      </Link>
      <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button
          variant="ghost"
          onClick={onEditArticle}
          aria-label="Edit article"
          size="icon"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        {user?.isAdmin && (
          <Button
            variant="ghost"
            onClick={() => handleArticleDelete(article.ArticleId)}
            aria-label="Delete article"
            size="icon"
            className="hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </div>
  );
}
