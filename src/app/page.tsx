"use server";

import { getTaskCount, getAuthors, searchTask } from "@/actions/actions";
import HomeClientPage from "@/components/pages/Home";
import { getQueryClient } from "@/lib/get-query-client";
import Spinner from "@/lib/Spinner";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Taskboard",
    description: "Home Page - Project Taskboard",
  };
};

export default async function Home() {
  const queryText = "";
  const offset = 0;
  const limit = 10;
  const priority = undefined;
  const status = undefined;
  const type = undefined;
  const date = undefined;
  const sortField = "createdAt";
  const sortOrder = "desc";
  const author = undefined;

  const queryClient = getQueryClient();

  //Prefetch users
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getAuthors(),
  });

  //Prefetch task-count
  await queryClient.prefetchQuery({
    queryKey: ["task-count", queryText, priority, status, type, date, author],
    queryFn: () =>
      getTaskCount(queryText, priority, status, type, date, author),
  });

  //Prefetch tasks
  await queryClient.prefetchQuery({
    queryKey: [
      "tasks",
      queryText,
      limit,
      offset,
      priority,
      status,
      type,
      date,
      sortField,
      sortOrder,
      author,
    ],
    queryFn: () =>
      searchTask(
        queryText,
        limit,
        offset,
        priority,
        status,
        type,
        date,
        sortField,
        sortOrder,
        author
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Spinner />}>
        <HomeClientPage />
      </Suspense>
    </HydrationBoundary>
  );
}
