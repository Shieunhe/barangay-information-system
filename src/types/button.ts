import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "link";

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
