import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export default function Spinner({ ...props }) {
  return (
    <div className={cn("w-full h-full mt-3")} {...props}>
      <Loader2 className="animate-spin" />
    </div>
  );
}
