import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";
import { revalidateTicketList } from "./server-actions/serverAction";

export async function handleTicketCreate(
  prevState: string | undefined,
  formData: FormData
) {
  console.log("here", formData);
  try {
    const payload = {
      Subject: String(formData.get("subject")),
      Description: String(formData.get("description")),
      AssignedTo: String(formData.get("assignedTo")),
    };
    const data = await fetch("http://localhost:4000/ticket", {
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
    const payload = {
      Subject: String(formData.get("subject")),
      Description: String(formData.get("description")),
      AssignedTo: String(formData.get("assignedTo")),
    };
    const data = await fetch(`http://localhost:4000/ticket/${ticketId}`, {
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
  revalidateTicketList();
  redirect("/dashboard/tickets");
}
export async function handleTicketDelete(id: string) {
  try {
    const data = await fetch(`http://localhost:4000/ticket/${id}`, {
      method: "DELETE",
    });
    revalidateTicketList();
  } catch (error) {
    return getErrorMessage(error);
  }
}
export const fetchTickets = async () => {
  const response = await fetch("http://localhost:4000/ticket/all");
  const data = await response.json();
  return data;
};

export const fetchTicket = async (id: string) => {
  console.log(`http://localhost:4000/ticket/${id}`);
  const response = await fetch(`http://localhost:4000/ticket/${id}`);
  console.log(response);
  const data = await response.json();
  return data;
};
