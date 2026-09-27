import type { Metadata } from "next";
import "@/app/_styles/globals.css";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import { bodyFont, titleFont } from "@/ui/fonts";
import Header from "@/ui/header";
import { AuthProvider } from "./context/AuthContext";
import { Amplify } from "aws-amplify";
import { config } from "@/config/aws-config";

export const metadata: Metadata = {
  title: "Let's Resolve",
  description: "Support ticketing and CRM for growing teams.",
};

Amplify.configure({ ...config }, { ssr: true });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${titleFont.variable}`}>
      <body className={`${bodyFont.className} antialiased`}>
        <ConfigureAmplifyClientSide />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
