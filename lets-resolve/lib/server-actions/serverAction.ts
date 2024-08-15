"use server";

import { revalidatePath } from "next/cache";

export async function revalidateArticleList() {
  revalidatePath("/dashboard/articles");
}

export async function revalidateTicketList() {
  revalidatePath("/dashboard/tickets");
}
