"use server";

import { getTasks } from "@/actions/actions";
import HomeClientPage from "@/components/pages/Home";
import { getQueryClient } from "@/lib/get-query-client";
import Spinner from "@/lib/Spinner";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <React.Suspense fallback={<Spinner />}>
        <HomeClientPage />
      </React.Suspense>
    </HydrationBoundary>
  );
}
