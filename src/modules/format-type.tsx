import {
  Bug,
  CopyPlus,
  FileText,
  MoveHorizontal,
  Sparkles,
} from "lucide-react";
import React from "react";

const formatType = (type: string) => {
  const formattedText = type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  if (type === "BUG")
    return (
      <div className="flex items-center gap-1">
        <Bug className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (type === "FEATURE")
    return (
      <div className="flex items-center gap-1">
        <Sparkles className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (type === "ENHANCEMENT")
    return (
      <div className="flex items-center gap-1">
        <CopyPlus className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (type === "DOCUMENTATION")
    return (
      <div className="flex items-center gap-1">
        <FileText className="w-4 h-4" />
        {formattedText}
      </div>
    );
  if (type === "OTHER")
    return (
      <div className="flex items-center gap-1">
        <MoveHorizontal className="w-4 h-4" />
        {formattedText}
      </div>
    );

  return <div>{formattedText}</div>;
};

export default formatType;
