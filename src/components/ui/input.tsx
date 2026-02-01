"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", label, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-600 mb-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm ${className}`}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export default Input;
