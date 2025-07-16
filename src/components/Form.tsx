"use client";

import { createTask } from "@/actions/actions";
import { useActionState, useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { TaskActionState } from "@/lib/types";
import { useToastStore } from "@/lib/toast-store";
import { Input } from "./ui/input";

const initialState: TaskActionState = {
  message: "",
  success: false,
  errors: {},
};

export default function Form({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState<
    TaskActionState,
    FormData
  >(createTask, initialState);

  const [status, setStatus] = useState("TODO");
  const [type, setType] = useState("OTHER");
  const [priority, setPriority] = useState("LOW");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-count"] });
    } else if (!state.success && state.message) {
      console.log("error");
    }
  }, [state.success, state.message, state.errors, queryClient, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1 pt-2">
        <Label className="label">Title:</Label>
        <Input name="title" required placeholder="Title..." />
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {/* STATUS */}
        <div className="flex flex-col gap-y-1 ">
          <Label className="label">Status:</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Hidden input */}
          <input required type="hidden" name="status" value={status} />
        </div>
        {/* TYPE */}
        <div className="flex flex-col gap-y-1 ">
          <Label className="label">Type:</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="BUG">Bug</SelectItem>
                <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                <SelectItem value="ENHANCEMENT">Enhancement</SelectItem>
                <SelectItem value="FEATURE">Feature</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Hidden input */}
          <input required type="hidden" name="type" value={type} />
        </div>
        {/* PRIORITY */}
        <div className="flex flex-col gap-y-1 ">
          <Label className="label">Priority:</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priority</SelectLabel>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Hidden input */}
          <input required type="hidden" name="priority" value={priority} />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label className="label">Description:</Label>
        <Textarea name="description" required placeholder="Description..." />
      </div>

      <Button disabled={pending} variant="outline" className="max-w-1/3">
        {pending ? "Pending..." : "Create"}
      </Button>
      <p>{state.message}</p>
    </form>
  );
}
