import { ChevronsDown, ChevronsRight, ChevronsUp } from "lucide-react";
import React from "react";

const formatPriority = (priority: string) => {
  const formattedText = priority
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (priority === "LOW")
    return (
      <div className="flex items-center gap-1">
        <ChevronsDown className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (priority === "MEDIUM")
    return (
      <div className="flex items-center gap-1">
        <ChevronsRight className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (priority === "HIGH")
    return (
      <div className="flex items-center gap-1">
        <ChevronsUp className="w-4 h-4" />
        {formattedText}
      </div>
    );

  // Dla innych statusów po prostu zwróć sformatowany tekst
  return <div>{formattedText}</div>;
};

export default formatPriority;
