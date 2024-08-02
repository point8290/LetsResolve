import { getErrorMessage } from "@/utils/get-error-message";
import { signUp } from "aws-amplify/auth";
import { redirect } from "next/navigation";

export async function handleTicketSubmit(
    prevState: string | undefined,
    formData: FormData
  ) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: String(formData.get("email")),
        password: String(formData.get("password")),
        options: {
          userAttributes: {
            email: String(formData.get("email")),
            name: String(formData.get("name")),
            phone_number: String(formData.get("phone")),
          },
          // optional
          autoSignIn: true,
        },
      });
    } catch (error) {
      return getErrorMessage(error);
    }
    redirect("/dashboard/tickets");
  }