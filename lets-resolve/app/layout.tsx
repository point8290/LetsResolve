import type { Metadata } from "next";
import "./globals.css";
import ConfigureAmplifyClientSide from "./amplify-cognito-config";
import { inter } from "@/ui/fonts";
import Header from "@/ui/header";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Let's Resolve",
  description: "Customer query ticketing and AI chatbot application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
