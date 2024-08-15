"use client";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { handleArticleDelete } from "@/lib/articleAction";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Article from "@/lib/model/Article";

export default function ArticleItem({ article }: { article: Article }) {
  const router = useRouter();
  const onEditArticle = () => {
    router.push(`/dashboard/articles/edit-article/${article.ArticleId}`);
  };
  return (
    <div className="flex justify-between items-center bg-secondary rounded-lg px-4  py-2 my-2">
      <div className="flex items-center gap-2">
        <div className="relative h-[50px] w-[50px] aspect-square">
          <Image src="/logo.png" fill className="object-cover" alt="avatar" />
        </div>
        <div>
          <strong>{article.Author}</strong>
          <p>{article.Title}</p>
          <p>{article.Description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onEditArticle} className="w-full bg-secondary">
          <PencilIcon className=" h-4 w-4 " />
        </Button>
        <Button
          onClick={() => handleArticleDelete(article.ArticleId)}
          className="w-full bg-secondary"
        >
          <TrashIcon className=" h-4 w-4 " />
        </Button>
      </div>
    </div>
  );
}
