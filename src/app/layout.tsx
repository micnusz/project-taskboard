import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-provider";
import Header from "@/components/layout/Header";
import ToastContainer from "@/components/ToastContainer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Taskboard",
  description: "Home Page - Project Taskboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <QueryProvider>
          <Header />
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
