"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants: Record<string, string> = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2",
      ghost: "bg-transparent text-gray-700 dark:text-gray-200 px-3 py-2",
    };

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
