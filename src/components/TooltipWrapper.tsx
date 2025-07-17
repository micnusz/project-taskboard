"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

type TooltipWrapperProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function TooltipWrapper({
  title,
  description,
  children,
}: TooltipWrapperProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-xs  bg-card">
        {title && <p className=" text-sm">{title}</p>}
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
