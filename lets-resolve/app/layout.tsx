import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import { bodyFont } from "@/ui/fonts";
import Header from "@/ui/header";
import { AuthProvider } from "./context/AuthContext";
import { Amplify } from "aws-amplify";
import { config } from "@/config/aws-config";

export const metadata: Metadata = {
  title: "Let's Resolve",
  description: "Raise your doubts",
};

Amplify.configure({ ...config }, { ssr: true });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bodyFont.className}>
        <ConfigureAmplifyClientSide />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
