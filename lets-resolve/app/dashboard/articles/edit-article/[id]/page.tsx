import { fetchArticle } from "@/lib/articleAction";
import ArticleForm from "@/ui/articles/article-form";
export default async function EditArticle({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const article = await fetchArticle(params?.id);
  return <ArticleForm isEditForm={true} article={article} />;
}
