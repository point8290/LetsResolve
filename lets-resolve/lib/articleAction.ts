import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateArticleList } from "./server-actions/serverAction";

export async function handleArticleCreate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const data = await fetch("https://letsresolve.onrender.com/article", {
      method: "POST",
      body: formData,
    });
    console.log(data);
  } catch (error) {
    return getErrorMessage(error);
  }

  revalidateArticleList();
  redirect("/dashboard/articles");
}

export async function handleArticleUpdate(
  prevState: string | undefined,
  formData: FormData,
  articleId: string
) {
  console.log("here", formData);
  try {
    const data = await fetch(
      `https://letsresolve.onrender.com/article/${articleId}`,
      {
        method: "PUT",

        body: formData,
      }
    );
    console.log(data);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateArticleList();
  redirect("/dashboard/articles");
}

export async function handleArticleDelete(id: string) {
  try {
    const data = await fetch(`https://letsresolve.onrender.com/article/${id}`, {
      method: "DELETE",
    });
    revalidateArticleList();
  } catch (error) {
    return getErrorMessage(error);
  }
}
export const fetchArticles = async () => {
  const response = await fetch("https://letsresolve.onrender.com/article/all");
  const data = await response.json();
  return data;
};

export const fetchArticle = async (id: string) => {
  console.log(`https://letsresolve.onrender.com/article/${id}`);
  const response = await fetch(
    `https://letsresolve.onrender.com/article/${id}`
  );
  console.log(response);
  const data = await response.json();
  return data;
};
