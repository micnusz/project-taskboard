import { updatePost } from "@/actions/actions";
import { useQueryClient } from "@tanstack/react-query";
import React, { useActionState, useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { TaskActionState } from "@/lib/types";
import { useToastStore } from "@/lib/toast-store";

type UpdatePostProps = {
  onSuccess?: () => void;
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    type: string;
  };
};
const initialState: TaskActionState = {
  message: "",
  success: false,
  errors: {},
};

const UpdatePost = ({ task, onSuccess }: UpdatePostProps) => {
  const [state, formAction, pending] = useActionState<
    TaskActionState,
    FormData
  >(updatePost, initialState);

  const [status, setStatus] = useState(task.status);
  const [type, setType] = useState(task.type);
  const [priority, setPriority] = useState(task.priority);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const addToast = useToastStore((state) => state.addToast);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-count"] });
      addToast({
        className: "bg-chart-1",
        title: `${state.message}`,
        description: `At ${new Date().toLocaleString()}`,
      });
      onSuccess?.();
    } else if (!state.success && state.message) {
      const fieldErrors = state.errors
        ? Object.entries(state.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ")
        : "";

      addToast({
        className: "bg-destructive",
        title: `Error: ${state.message}`,
        description: fieldErrors || `At ${new Date().toLocaleString()}`,
      });
    }
  }, [state.success, state.message, state.errors, queryClient]);

  return (
    <form action={formAction} className="flex flex-col gap-y-3">
      <input type="hidden" name="id" value={task.id} />
      <div className="flex flex-col gap-y-1">
        <Label>Task</Label>
        <Input
          name="title"
          required
          placeholder="Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        {/* STATUS */}
        <div className="flex flex-col gap-y-1 ">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="TODO">TODO</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                <SelectItem value="DONE">DONE</SelectItem>
                <SelectItem value="CANCELED">CANCELED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </div>
        {/* TYPE */}
        <div className="flex flex-col gap-y-1">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="BUG">BUG</SelectItem>
                <SelectItem value="DOCUMENTATION">DOCUMENTATION</SelectItem>
                <SelectItem value="ENHANCEMENT">ENHANCEMENT</SelectItem>
                <SelectItem value="FEATURE">FEATURE</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="type" value={type} />
        </div>
        {/* PRIORITY */}
        <div className="flex flex-col gap-y-1 ">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="LOW">LOW</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <input type="hidden" name="priority" value={priority} />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Description</Label>
        <Textarea
          name="description"
          required
          placeholder="Description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button disabled={pending} variant="outline">
        Update
      </Button>
      <p>{state.message}</p>
    </form>
  );
};

export default UpdatePost;
