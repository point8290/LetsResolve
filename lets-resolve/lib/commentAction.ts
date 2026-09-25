"use server";

import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/get-error-message";
import { apiGet, apiSend } from "./server/api-client";
import Comment from "./model/Comment";
import Page from "./model/Page";

export async function handleCommentCreate(
  prevState: string | undefined,
  formData: FormData,
  ticketId: string
) {
  try {
    await apiSend<Comment>(`/ticket/${ticketId}/comments`, "POST", {
      body: formData.get("body"),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidatePath(`/dashboard/tickets/ticket/${ticketId}`);
  return "";
}

export const fetchComments = async (ticketId: string): Promise<Page<Comment>> => {
  return apiGet<Page<Comment>>(`/ticket/${ticketId}/comments`, { limit: "200" });
};
