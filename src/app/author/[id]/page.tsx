import {
  getAuthorInfo,
  getAuthorName,
  getAuthorTask,
  getAuthorTaskCount,
} from "@/actions/actions";
import AuthorPage from "@/components/pages/AuthorPage";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

type TaskServerPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: TaskServerPageProps): Promise<Metadata> => {
  const { id } = await params;
  const author = await getAuthorName(id);
  const name = author?.name ?? "Default title";

  return {
    title: `${name} - Author Page`,
    description: `Author Page: ${name} - Taskboard`,
  };
};

const TaskServerPage = async ({ params }: TaskServerPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const queryText = "";
  const offset = 0;
  const limit = 10;
  const priority = undefined;
  const status = undefined;
  const type = undefined;
  const date = undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [
      "author-tasks",
      id,
      queryText,
      limit,
      offset,
      priority,
      status,
      type,
      date,
    ],
    queryFn: () =>
      getAuthorTask(id, queryText, limit, offset, priority, status, type, date),
  });

  await queryClient.prefetchQuery({
    queryKey: ["author-info", id],
    queryFn: () => getAuthorInfo(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["task-count", id, queryText, priority, status, type, date],
    queryFn: () =>
      getAuthorTaskCount(id, queryText, priority, status, type, date),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthorPage id={id} />
    </HydrationBoundary>
  );
};

export default TaskServerPage;
