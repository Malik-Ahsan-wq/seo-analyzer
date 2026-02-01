import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { title?: string };

export function Card({ className = "", title, children, ...props }: CardProps) {
  return (
    <div className={`p-4 bg-white dark:bg-zinc-900 border rounded-md ${className}`} {...props}>
      {title && <div className="text-sm text-gray-500 mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

export default Card;
