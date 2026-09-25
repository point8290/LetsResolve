"use server";

import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateTicketList } from "./server-actions/serverAction";
import { apiGet, apiSend } from "./server/api-client";
import Ticket from "./model/Ticket";
import Page from "./model/Page";

export async function handleTicketCreate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await apiSend<Ticket>("/ticket", "POST", formData);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateTicketList();
  redirect("/dashboard/tickets");
}

export async function handleTicketUpdate(
  prevState: string | undefined,
  formData: FormData,
  ticketId: string
) {
  try {
    await apiSend<Ticket>(`/ticket/${ticketId}`, "PUT", formData);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateTicketList();
  redirect("/dashboard/tickets");
}

export async function handleTicketDelete(id: string) {
  try {
    await apiSend(`/ticket/${id}`, "DELETE");
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateTicketList();
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  customerId?: string;
  cursor?: string;
}

export async function fetchTickets(filters: TicketFilters = {}): Promise<Page<Ticket>> {
  return apiGet<Page<Ticket>>("/ticket/all", {
    status: filters.status,
    priority: filters.priority,
    customerId: filters.customerId,
    cursor: filters.cursor,
  });
}

export async function fetchTicketsForCustomer(customerId: string): Promise<Page<Ticket>> {
  return fetchTickets({ customerId });
}

export const fetchTicket = async (id: string): Promise<Ticket> => {
  return apiGet<Ticket>(`/ticket/${id}`);
};
