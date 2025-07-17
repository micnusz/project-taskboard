import { deleteTask } from "@/actions/actions";
import { useToastStore } from "@/lib/toast-store";
import { TaskWithAuthor } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";

export const useDeleteTask = (onSuccess?: () => void) => {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string, table?: Table<TaskWithAuthor[]>) => {
    const res = await deleteTask(id);

    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task-count"] });
      await queryClient.invalidateQueries({ queryKey: ["author-tasks"] });

      addToast({
        className: "bg-chart-1",
        title: "Task deleted successfully!",
        description: `At ${new Date().toLocaleString()}`,
      });
      table?.resetRowSelection?.();
      onSuccess?.();
    } else {
      addToast({
        className: "bg-destructive",
        title: "Error: Task failed!",
        description: `At ${new Date().toLocaleString()}`,
      });
    }
  };

  return { handleDelete };
};
