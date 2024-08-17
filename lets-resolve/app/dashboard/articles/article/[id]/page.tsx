import { fetchArticle } from "@/lib/articleAction";
import ArticleDetail from "@/ui/articles/article-detail";
export default async function EditArticle({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const article = await fetchArticle(params?.id);
  return <ArticleDetail article={article} />;
}
