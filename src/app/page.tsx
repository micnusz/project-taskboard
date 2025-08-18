"use server";

import HomeClientPage from "@/components/pages/Home";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Taskboard",
    description: "Home Page - Project Taskboard",
  };
};

export default async function Home() {
  return <HomeClientPage />;
}
