import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        flex items-center p-4 rounded-lg shadow-lg mb-3 min-w-80 max-w-md
        ${
          toast.type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }
      `}
    >
      <div className="flex items-center">
        {toast.type === "success" ? (
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mr-3" />
        )}
        <p
          className={`text-sm font-medium ${
            toast.type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`ml-auto ${
          toast.type === "success"
            ? "text-green-400 hover:text-green-600"
            : "text-red-400 hover:text-red-600"
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[60]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
}
