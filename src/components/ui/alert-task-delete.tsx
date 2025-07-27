"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

type AlertDeleteProps = {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
};

export default function AlertDelete({
  message,
  type,
  onClose,
}: AlertDeleteProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <Alert
      variant={type === "success" ? "default" : "destructive"}
      className="relative flex items-center"
    >
      {type === "success" ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <AlertTitle>{type === "success" ? "Success" : "Error"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>

      {/* Przycisk do zamknięcia */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1 right-1 p-1"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
