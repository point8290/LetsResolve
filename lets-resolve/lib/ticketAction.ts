import { getErrorMessage } from "@/utils/get-error-message";
import { redirect } from "next/navigation";

export async function handleTicketSubmit(
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
  redirect("/dashboard/tickets");
}
