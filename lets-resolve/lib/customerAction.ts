"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/utils/get-error-message";
import { apiGet, apiSend } from "./server/api-client";
import Customer from "./model/Customer";
import Page from "./model/Page";

function revalidateCustomerViews(customerId?: string) {
  revalidatePath("/dashboard/customers");
  if (customerId) {
    revalidatePath(`/dashboard/customers/customer/${customerId}`);
  }
}

export async function handleCustomerCreate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await apiSend<Customer>("/customer", "POST", {
      name: formData.get("name"),
      domain: formData.get("domain") || undefined,
      notes: formData.get("notes") || undefined,
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateCustomerViews();
  redirect("/dashboard/customers");
}

export async function handleCustomerUpdate(
  prevState: string | undefined,
  formData: FormData,
  customerId: string
) {
  try {
    await apiSend<Customer>(`/customer/${customerId}`, "PUT", {
      name: formData.get("name"),
      domain: formData.get("domain") || undefined,
      notes: formData.get("notes") || undefined,
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateCustomerViews(customerId);
  redirect(`/dashboard/customers/customer/${customerId}`);
}

export async function handleCustomerDelete(id: string) {
  try {
    await apiSend(`/customer/${id}`, "DELETE");
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateCustomerViews();
}

export const fetchCustomers = async (): Promise<Page<Customer>> => {
  return apiGet<Page<Customer>>("/customer/all");
};

export const fetchCustomer = async (id: string): Promise<Customer> => {
  return apiGet<Customer>(`/customer/${id}`);
};
