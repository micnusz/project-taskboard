"use client";

import { deleteTask, getTask } from "@/actions/actions";
import Spinner from "@/lib/Spinner";
import formatPriority from "@/modules/format-priority";
import formatStatus from "@/modules/format-status";
import formatType from "@/modules/format-type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { formatDate } from "@/modules/format-date";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import formatRole from "@/modules/format-role";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import UpdatePost from "../FormUpdate";
import { useRouter } from "next/navigation";

type TaskPageProps = {
  slug: string;
};

const TaskPage = ({ slug }: TaskPageProps) => {
  const router = useRouter();
  const { data: taskData } = useQuery({
    queryKey: ["task", slug],
    queryFn: () => getTask(slug),
    enabled: !!slug,
  });

  const queryClient = useQueryClient();

  if (taskData === undefined) return <Spinner />;
  if (taskData === null) return <div>Task not found.</div>;

  const handleDelete = async () => {
    const res = await deleteTask(taskData.id);

    if (res.message === "Task deleted successfully!") {
      // Invalidate task list and task detail before redirect
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task", taskData.id] });

      console.log({ message: res.message, type: "success" });

      // Redirect after invalidation
      router.push("/");
    } else {
      console.log({ message: res.message, type: "error" });
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 h-screen flex flex-col gap-8 bg-background">
      <section className="bg-card shadow-md rounded-md p-6 border-4">
        <div className="flex justify-between mb-6">
          {/* Left side: Title + Status/Type/Priority + Created At */}
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <Label className="text-muted-foreground uppercase text-xs tracking-wide">
                Title
              </Label>
              <h1 className="text-3xl font-extrabold text-foreground truncate">
                {taskData?.title}
              </h1>
            </div>

            <ul className="flex gap-6 flex-wrap">
              {["Status", "Type", "Priority"].map((label, i) => {
                const value =
                  label === "Status"
                    ? formatStatus(taskData?.status)
                    : label === "Type"
                    ? formatType(taskData?.type)
                    : formatPriority(taskData?.priority);
                return (
                  <li key={i}>
                    <Label className="block text-muted-foreground uppercase text-xs tracking-wide mb-1">
                      {label}
                    </Label>
                    <Badge variant="outline" className="text-sm">
                      {value}
                    </Badge>
                  </li>
                );
              })}
            </ul>

            <div>
              <Label className="uppercase text-xs tracking-wide text-muted-foreground">
                Created At
              </Label>
              <p className="text-foreground">
                {formatDate(taskData.createdAt)}
              </p>
            </div>
          </div>

          {/* Right side: Created By */}
          <div className="flex flex-col items-end max-w-xs">
            <Label className="text-muted-foreground uppercase text-xs tracking-wide mb-1">
              Created By
            </Label>
            <h3 className="text-xl font-semibold text-foreground">
              <Tooltip>
                <TooltipTrigger className="flex items-center space-x-1 cursor-pointer hover:text-chart-3">
                  <span className="truncate max-w-[150px]">
                    {taskData?.author?.name}
                  </span>
                  <MoreVertical className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-y-2 max-w-xs">
                    <Label className="block text-muted-foreground uppercase text-xs ">
                      Name:
                    </Label>
                    <span className="text-lg">{taskData?.author?.name}</span>
                    <Label className="block text-muted-foreground uppercase text-xs ">
                      Email:
                    </Label>
                    <span className="text-lg break-words">
                      {taskData?.author?.email}
                    </span>
                    <Label className="block text-muted-foreground uppercase text-xs ">
                      Role:
                    </Label>
                    <span className="text-lg">
                      {formatRole(taskData?.author?.role)}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </h3>
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between gap-4 text-muted-foreground">
          <div>
            <Label className="uppercase text-xs tracking-wide">Deadline</Label>
            <p className="text-foreground">
              {taskData.deadline
                ? formatDate(taskData.deadline)
                : "No deadline"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <Label className="text-muted-foreground uppercase text-xs tracking-wide">
            Description
          </Label>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {taskData?.description || "No description provided."}
          </p>
        </div>
        {/* Update */}
        <div className="flex flex-row gap-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="max-w-[15rem] justify-start "
              >
                Edit Task
              </Button>
            </DialogTrigger>
            <DialogContent className="min-h-[20rem] max-h-screen">
              <DialogHeader>
                <DialogTitle>Edit Task:</DialogTitle>
                <UpdatePost task={taskData} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            className="max-w-[15rem] justify-start text-red-400"
            onClick={() => handleDelete()}
          >
            Delete Task
          </Button>
        </div>
      </section>
    </main>
  );
};

export default TaskPage;
