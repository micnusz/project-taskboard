"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "../../prisma/prisma";
import { ScrollArea } from "./ui/scroll-area";
import { formatDate } from "@/modules/format-date";
import formatStatus from "@/modules/format-status";
import formatPriority from "@/modules/format-priority";
import formatType from "@/modules/format-type";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import UpdatePost from "./FormUpdate";
import DeleteTaskAlert from "./DeleteTaskAlert";
import { useDeleteTask } from "@/hook/useDeleteTask";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const { handleDelete } = useDeleteTask();

  return (
    <Card className="w-full h-full flex flex-col ">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardAction className="text-muted-foreground text-sm">
          {formatDate(task.createdAt)}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-x-6 gap-y-4 py-4 flex-wrap text-sm">
          <div className="flex flex-col gap-y-1">
            <Label className="label">Status:</Label>
            <span>{formatStatus(task.status)}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="label">Type:</Label>
            <span>{formatType(task.type)}</span>
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="label">Priority:</Label>
            <span>{formatPriority(task.priority)}</span>
          </div>
        </div>
        <ScrollArea className="h-60 rounded-md border mb-8">
          <div className="p-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {task?.description || "No description provided."}
            </p>
          </div>
        </ScrollArea>
        <div className="flex flex-row gap-x-2">
          {/* Update Task */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Task</Button>
            </DialogTrigger>
            <DialogContent className="min-h-[20rem] max-h-screen">
              <DialogHeader>
                <DialogTitle>Edit Task:</DialogTitle>
                <UpdatePost task={task} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* Delete Task */}
          <DeleteTaskAlert onDelete={() => handleDelete(task.id)}>
            <Button variant="outline" className="text-red-500">
              Delete Task
            </Button>
          </DeleteTaskAlert>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
