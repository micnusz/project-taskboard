"use client";

import { createPost } from "@/actions/actions";
import { useActionState, useEffect, useState } from "react";
import { Input } from "./ui/input";
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

const initialState = { message: "", success: false };

export default function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task"] }); // dla search
    }
  }, [state.success, queryClient]);

  return (
    <form action={formAction} className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-y-1">
        <Label>Task</Label>
        <Input name="title" required placeholder="Task" />
      </div>

      <div className="flex flex-row gap-2">
        {/* STATUS */}
        <div className="flex flex-col gap-y-1">
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
          {/* Hidden input */}
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
          {/* Hidden input */}
          <input type="hidden" name="type" value={type} />
        </div>

        {/* PRIORITY */}
        <div className="flex flex-col gap-y-1">
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
          {/* Hidden input */}
          <input type="hidden" name="priority" value={priority} />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Description</Label>
        <Textarea name="description" required placeholder="Description" />
      </div>

      <Button disabled={pending} variant="outline">
        Create
      </Button>
      <p>{state.message}</p>
    </form>
  );
}
