"use server";

import { searchTask } from "@/actions/actions";
import HomeClientPage from "@/components/pages/Home";
import { getQueryClient } from "@/lib/get-query-client";
import Spinner from "@/lib/Spinner";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default async function Home() {
  const queryText = "";
  const offset = 0;
  const limit = 20;
  const priority = undefined;
  const status = undefined;
  const type = undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks", queryText, limit, offset, priority, status, type],
    queryFn: () => searchTask(queryText, limit, offset, priority, status, type),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <React.Suspense fallback={<Spinner />}>
        <HomeClientPage />
      </React.Suspense>
    </HydrationBoundary>
  );
}
