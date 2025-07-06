"use client";
import { TaskWithAuthor } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { deletePost } from "./actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdatePost from "@/components/FormUpdate";

export default function ActionsCell({ task }: { task: TaskWithAuthor }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const res = await deletePost(task.id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task", task.id] });
      // możesz tu dodać jakiś toast lub inny feedback
    } else {
      // obsłuż błąd
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/task/${task.slug}`}>View Task</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start ">
                Edit Task
              </Button>
            </DialogTrigger>
            <DialogContent className="min-h-[20rem] max-h-screen">
              <DialogHeader>
                <DialogTitle>Edit Task:</DialogTitle>
                <UpdatePost task={task} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
