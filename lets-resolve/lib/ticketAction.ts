import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateTicketList } from "./server-actions/serverAction";

export async function handleTicketCreate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const data = await fetch("https://letsresolve.onrender.com/ticket", {
      method: "POST",
      body: formData,
    });
    console.log(data);
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
  console.log("here", formData);
  try {
    const data = await fetch(
      `https://letsresolve.onrender.com/ticket/${ticketId}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    console.log(data);
  } catch (error) {
    return getErrorMessage(error);
  }
  revalidateTicketList();
  redirect("/dashboard/tickets");
}
export async function handleTicketDelete(id: string) {
  try {
    const data = await fetch(`https://letsresolve.onrender.com/ticket/${id}`, {
      method: "DELETE",
    });
    revalidateTicketList();
  } catch (error) {
    return getErrorMessage(error);
  }
}
export const fetchTickets = async () => {
  const response = await fetch("https://letsresolve.onrender.com/ticket/all");
  const data = await response.json();
  return data;
};

export const fetchTicket = async (id: string) => {
  console.log(`https://letsresolve.onrender.com/ticket/${id}`);
  const response = await fetch(`https://letsresolve.onrender.com/ticket/${id}`);
  console.log(response);
  const data = await response.json();
  return data;
};
