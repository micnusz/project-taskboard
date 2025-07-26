"use client";

import { ListTodo, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type TaskCountProps = {
  tasksCount: number | undefined;
  loadingState: boolean;
};

const TaskCount = ({ loadingState, tasksCount }: TaskCountProps) => {
  return (
    <Button variant="ghost" className="ml-auto cursor-default" disabled>
      <ListTodo className="w-4 h-4" />
      {loadingState ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        `Count: ${tasksCount}`
      )}
    </Button>
  );
};

export default TaskCount;
