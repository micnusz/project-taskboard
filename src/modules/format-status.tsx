import { Check, Clock, FileQuestion, X } from "lucide-react";
import React from "react";

const formatStatus = (status: string) => {
  if (status === "TODO")
    return (
      <div className="flex items-center gap-1">
        <FileQuestion className="w-4 h-4" />
        {status}
      </div>
    );
  if (status === "IN_PROGRESS")
    return (
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {status}
      </div>
    );
  if (status === "DONE")
    return (
      <div className="flex items-center gap-1">
        <Check className="w-4 h-4" />
        {status}
      </div>
    );
  if (status === "CANCELED")
    return (
      <div className="flex items-center gap-1">
        <X className="w-4 h-4" />
        {status}
      </div>
    );
  return status;
};

export default formatStatus;
