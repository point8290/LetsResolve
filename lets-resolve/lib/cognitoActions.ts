import { redirect } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
  confirmUserAttribute,
  updatePassword,
  confirmResetPassword,
  resetPassword,
  updateUserAttributes,
  UpdateUserAttributesOutput,
  UserAttributeKey,
} from "aws-amplify/auth";
import { getErrorMessage } from "@/utils/get-error-message";

export async function handleSignUp(
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
  redirect("/auth/confirm-signup");
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
  prevState: string | undefined,
  formData: FormData,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
    });
    await autoSignIn();
    setIsAuthenticated(true);
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/login");
}

export async function handleSignIn(
  prevState: string | undefined,
  formData: FormData,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) {
  let redirectLink = "/dashboard";
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      redirectLink = "/auth/confirm-signup";
    }
    setIsAuthenticated(true);
  } catch (error) {
    return getErrorMessage(error);
  }

  redirect(redirectLink);
}

export async function handleSignOut(afterSignOut: () => void) {
  try {
    await signOut();
    afterSignOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
}

export async function handleUpdateUserAttribute(
  prevState: string,
  formData: FormData
) {
  const attributeKey = "email";
  let attributeValue = formData.get("email");
  const currentAttributeValue = formData.get("current_email");
  if (attributeValue === currentAttributeValue) {
    return "";
  }

  try {
    const output = await updateUserAttribute({
      userAttribute: {
        attributeKey: String(attributeKey),
        value: String(attributeValue),
      },
    });
    return handleUpdateUserAttributeNextSteps(output);
  } catch (error) {
    console.log(error);
    return "error";
  }
}

export async function handleUpdateUserAttributes(
  prevState: string,
  formData: FormData
) {
  let location: string | null = null;
  // @ts-ignore
  const updateAttributes: {
    picture: string | undefined;
    name: string | undefined;
  } = {};
  const attributeValue: FormDataEntryValue | null = formData.get("name");
  const currentAttributeValue: FormDataEntryValue | null =
    formData.get("current_name");

  if (currentAttributeValue !== attributeValue) {
    updateAttributes.name = String(attributeValue);
  }

  if (formData.get("profileImage")) {
    const response = await fetch("http://localhost:4000/user/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    location = data.location;
  }

  if (location != null) {
    updateAttributes.picture = String(location);
  }

  try {
    const output = await updateUserAttributes({
      userAttributes: updateAttributes,
    });
    return handleUpdateUserAttributesNextSteps(output);
  } catch (error) {
    console.log(error);
    return "error";
  }
}

function handleUpdateUserAttributesNextSteps(
  output: UpdateUserAttributesOutput
) {
  const { nextStep } = output;
  switch (nextStep?.nextStep?.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
    default:
      return "success";
  }
}
function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      return `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`;
    case "DONE":
      return "success";
  }
}

export async function handleUpdatePassword(
  prevState: "success" | "error" | undefined,
  formData: FormData
) {
  const currentPassword = formData.get("current_password");
  const newPassword = formData.get("new_password");

  if (currentPassword === newPassword) {
    return;
  }

  try {
    await updatePassword({
      oldPassword: String(currentPassword),
      newPassword: String(newPassword),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

export async function handleConfirmUserAttribute(
  prevState: "success" | "error" | undefined,
  formData: FormData
) {
  const code = formData.get("code");

  if (!code) {
    return;
  }

  try {
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }

  return "success";
}

export async function handleResetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await resetPassword({ username: String(formData.get("email")) });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/reset-password/confirm");
}

export async function handleConfirmResetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await confirmResetPassword({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("code")),
      newPassword: String(formData.get("password")),
    });
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect("/auth/login");
}
