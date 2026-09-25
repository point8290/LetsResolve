"use server";

import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/get-error-message";
import { apiGet, apiSend } from "./server/api-client";
import Contact from "./model/Contact";
import Page from "./model/Page";

export async function handleContactCreate(
  prevState: string | undefined,
  formData: FormData,
  customerId: string
) {
  try {
    await apiSend<Contact>(`/customer/${customerId}/contacts`, "POST", {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidatePath(`/dashboard/customers/customer/${customerId}`);
  return "success";
}

export async function handleContactDelete(customerId: string, contactId: string) {
  try {
    await apiSend(`/customer/${customerId}/contacts/${contactId}`, "DELETE");
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidatePath(`/dashboard/customers/customer/${customerId}`);
}

export const fetchContacts = async (customerId: string): Promise<Page<Contact>> => {
  return apiGet<Page<Contact>>(`/customer/${customerId}/contacts`);
};
