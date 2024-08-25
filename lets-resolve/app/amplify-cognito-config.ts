"use client";

import { Amplify } from "aws-amplify";

import { config } from "@/config/aws-config";

Amplify.configure(
  { ...config },
  {
    ssr: true,
  }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
