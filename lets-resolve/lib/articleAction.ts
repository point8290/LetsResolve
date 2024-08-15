import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateArticleList } from "./server-actions/serverAction";

export async function handleArticleCreate(
  prevState: string | undefined,
  formData: FormData
) {
  console.log("here", formData);
  try {
    const payload = {
      Title: String(formData.get("title")),
      Description: String(formData.get("description")),
      Author: String(formData.get("author")),
    };
    const data = await fetch("http://localhost:4000/article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    const payload = {
      Title: String(formData.get("title")),
      Description: String(formData.get("description")),
      Author: String(formData.get("author")),
    };
    const data = await fetch(`http://localhost:4000/article/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(data);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateArticleList();
  redirect("/dashboard/articles");
}

export async function handleArticleDelete(id: string) {
  try {
    const data = await fetch(`http://localhost:4000/article/${id}`, {
      method: "DELETE",
    });
    revalidateArticleList();
  } catch (error) {
    return getErrorMessage(error);
  }
}
export const fetchArticles = async () => {
  const response = await fetch("http://localhost:4000/article/all");
  const data = await response.json();
  return data;
};

export const fetchArticle = async (id: string) => {
  console.log(`http://localhost:4000/article/${id}`);
  const response = await fetch(`http://localhost:4000/article/${id}`);
  console.log(response);
  const data = await response.json();
  return data;
};
