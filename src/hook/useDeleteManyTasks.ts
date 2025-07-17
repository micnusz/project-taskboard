// src/hooks/useDeleteManyTasks.ts
import { deleteTask } from "@/actions/actions";
import { useToastStore } from "@/lib/toast-store";
import { TaskWithAuthor } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";

export const useDeleteManyTasks = () => {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const handleDeleteMany = async (
    ids: string[],
    table?: Table<TaskWithAuthor[]>
  ) => {
    try {
      for (const id of ids) {
        const res = await deleteTask(id);
        if (res.message !== "Tasks deleted successfully!") {
          console.warn(`Failed to delete task with ID: ${id}`);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task-count"] });

      addToast({
        className: "bg-chart-1",
        title: "Tasks deleted successfully!",
        description: `At ${new Date().toLocaleString()}`,
      });

      table?.resetRowSelection?.();
    } catch {
      addToast({
        className: "bg-destructive",
        title: "Error: Tasks failed!",
        description: `At ${new Date().toLocaleString()}`,
      });
    }
  };

  return { handleDeleteMany };
};
