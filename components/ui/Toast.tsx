import * as React from "react";

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
  className?: string;
}

export type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
  children: React.ReactNode;
}>;
