"use server";

import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateArticleList } from "./server-actions/serverAction";
import { apiGet, apiSend } from "./server/api-client";
import Article from "./model/Article";
import Page from "./model/Page";

export async function handleArticleCreate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await apiSend<Article>("/article", "POST", formData);
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
  try {
    await apiSend<Article>(`/article/${articleId}`, "PUT", formData);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateArticleList();
  redirect("/dashboard/articles");
}

export async function handleArticleDelete(id: string) {
  try {
    await apiSend(`/article/${id}`, "DELETE");
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateArticleList();
}

export const fetchArticles = async (): Promise<Page<Article>> => {
  return apiGet<Page<Article>>("/article/all");
};

export const fetchArticle = async (id: string): Promise<Article> => {
  return apiGet<Article>(`/article/${id}`);
};
