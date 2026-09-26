"use client";
import Article from "@/lib/model/Article";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { handleArticleDelete } from "@/lib/articleAction";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";
import Avatar from "../avatar";

export default function ArticleDetail({ article }: { article: Article }) {
  const router = useRouter();
  const user = useAuthUser();
  const onEditArticle = () => {
    router.push(`/dashboard/articles/edit-article/${article.ArticleId}`);
  };

  return (
    <div className="card mx-auto my-6 flex flex-col gap-5 p-6 md:w-2/3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar label={article.Author} size="lg" />
          <div>
            <h1 className="font-display text-xl font-semibold text-typography">
              {article.Title}
            </h1>
            <p className="text-sm text-muted">By {article.Author}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" onClick={onEditArticle} aria-label="Edit article">
            <PencilIcon className="h-4 w-4" />
          </Button>
          {user?.isAdmin && (
            <Button
              variant="ghost"
              onClick={() => handleArticleDelete(article.ArticleId)}
              aria-label="Delete article"
              className="hover:text-danger"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {article.Description && (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-typography">
          {article.Description}
        </p>
      )}

      {article.Attachments && article.Attachments.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {article.Attachments.map((url, index) => (
            <a
              key={`attachment-${url.substring(url.length - 12)}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[120px] w-[120px] overflow-hidden rounded-lg border border-separator bg-shadow bg-cover bg-center transition-opacity hover:opacity-80"
              style={{ backgroundImage: `url(${url})` }}
              aria-label={`Open attachment ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
