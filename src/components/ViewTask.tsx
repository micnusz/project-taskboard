"use client";

import { deleteTask } from "@/actions/actions";
import formatPriority from "@/modules/format-priority";
import formatStatus from "@/modules/format-status";
import formatType from "@/modules/format-type";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/modules/format-date";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import formatRole from "@/modules/format-role";
import { MoreVertical } from "lucide-react";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import UpdatePost from "./FormUpdate";
import { ScrollArea } from "./ui/scroll-area";
import { TaskWithAuthor } from "@/lib/types";
import { useToastStore } from "@/lib/toast-store";

type ViewTaskProps = {
  taskData: TaskWithAuthor;
};

const ViewTask = ({ taskData }: ViewTaskProps) => {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const res = await deleteTask(taskData.id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      addToast({
        className: "bg-chart-1",
        title: "Task deleted successfully!",
        description: `At ${new Date().toLocaleString()}`,
      });
    } else {
      addToast({
        className: "bg-destructive",
        title: "Error: Task deletion failed!",
        description: `At ${new Date().toLocaleString()}`,
      });
    }
  };

  return (
    <div>
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
            <p className="text-foreground">{formatDate(taskData.createdAt)}</p>
          </div>
        </div>

        {/* Right side: Created By */}
        <div className="flex flex-col items-end max-w-xs">
          <Label className="text-muted-foreground uppercase text-xs tracking-wide mb-1">
            Created By
          </Label>
          <h3 className="text-xl font-semibold text-foreground">
            <Tooltip>
              <TooltipTrigger
                className="flex items-center space-x-1 cursor-pointer hover:text-chart-3"
                tabIndex={-1}
              >
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
            {taskData.deadline ? formatDate(taskData.deadline) : "No deadline"}
          </p>
        </div>
      </div>

      {/* Description */}
      <Label className="text-muted-foreground uppercase text-xs tracking-wide">
        Description
      </Label>
      <ScrollArea className="h-72 rounded-md border mb-8">
        <div className="p-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {taskData?.description || "No description provided."}
          </p>
        </div>
      </ScrollArea>
      {/* Update */}
      <div className="flex flex-row gap-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="max-w-[15rem] justify-start ">
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
    </div>
  );
};

export default ViewTask;
