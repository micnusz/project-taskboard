"use client";
import { useToastStore } from "@/lib/toast-store";
import { useEffect } from "react";

type ToastContainerProps = {
  className?: string;
};

export default function ToastContainer({ className }: ToastContainerProps) {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 space-y-2 pt-2 ${
        className ?? ""
      }`}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={` bg-card text-foreground px-4 py-2 rounded shadow ${
            toast.className ?? ""
          } `}
        >
          <strong>{toast.title}</strong>
          {toast.description && <div>{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
