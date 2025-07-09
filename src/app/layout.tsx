import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-provider";
import Header from "@/components/layout/Header";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Project Taskboard",
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
        </QueryProvider>
      </body>
    </html>
  );
}
