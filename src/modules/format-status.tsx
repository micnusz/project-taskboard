import { CircleCheck, CircleDashed, CircleX, Clock } from "lucide-react";
import React from "react";

const formatStatus = (status: string) => {
  const formattedText = status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (status === "TODO")
    return (
      <div className="flex items-center gap-1">
        <CircleDashed className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (status === "IN_PROGRESS")
    return (
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (status === "DONE")
    return (
      <div className="flex items-center gap-1">
        <CircleCheck className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (status === "CANCELED")
    return (
      <div className="flex items-center gap-1">
        <CircleX className="w-4 h-4" />
        {formattedText}
      </div>
    );

  // Dla innych statusów po prostu zwróć sformatowany tekst
  return <div>{formattedText}</div>;
};

export default formatStatus;
