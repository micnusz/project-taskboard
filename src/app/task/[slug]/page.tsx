"use server";

import { getTask } from "@/actions/actions";
import TaskPage from "@/components/pages/TaskPage";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const task = await getTask(slug);
  const title = task?.title ?? "Default title";
  return {
    title: `${title}`,
    description: `${title}`,
  };
};

const TaskServerPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["task", slug],
    queryFn: () => getTask(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPage slug={slug} />
    </HydrationBoundary>
  );
};

export default TaskServerPage;
