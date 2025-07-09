import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

const IndeterminateCheckbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ShadcnCheckbox> & {
    indeterminate?: boolean;
  }
>(({ indeterminate, ...props }, ref) => {
  const internalRef = React.useRef<HTMLButtonElement | null>(null);
  const combinedRef = (node: HTMLButtonElement) => {
    if (ref) {
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
    internalRef.current = node;
  };

  React.useEffect(() => {
    if (internalRef.current) {
      const input = internalRef.current.querySelector("input");
      if (input) input.indeterminate = Boolean(indeterminate);
    }
  }, [indeterminate]);

  return <ShadcnCheckbox ref={combinedRef} {...props} />;
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export { IndeterminateCheckbox };
