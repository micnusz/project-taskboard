import { getAuthorTask } from "@/actions/actions";
import AuthorPage from "@/components/pages/AuthorPage";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type TaskServerPageProps = {
  params: Promise<{ id: string }>;
};
const TaskServerPage = async ({ params }: TaskServerPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["author", id],
    queryFn: () => getAuthorTask(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthorPage id={id} />
    </HydrationBoundary>
  );
};

export default TaskServerPage;
