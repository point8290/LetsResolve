"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
  },
};

Amplify.configure(
  { Auth: authConfig },
  {
    ssr: true, // this will make amplify use cookies for state storage, by default amplify uses localstorage for state storage
  }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
