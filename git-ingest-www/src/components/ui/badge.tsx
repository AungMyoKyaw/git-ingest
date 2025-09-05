import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 font-semibold shrink-0 gap-2 transition-all duration-200 overflow-hidden break-words shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary to-blue-500 text-white hover:from-primary/80 hover:to-blue-500/80",
        secondary:
          "border-transparent bg-gray-800 text-white hover:bg-gray-900",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/20 dark:focus-visible:ring-red-700/40 dark:bg-red-700/60",
        outline:
          "border border-primary text-primary bg-white hover:bg-primary/10"
      },
      size: {
        xs: "text-xs px-2 py-0.5",
        sm: "text-sm px-3 py-1",
        md: "text-base px-4 py-1.5",
        lg: "text-lg px-5 py-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm"
    }
  }
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg";
    "aria-label"?: string;
    role?: string;
  };

function Badge({
  className,
  variant,
  size = "sm",
  asChild = false,
  icon,
  children,
  "aria-label": ariaLabel,
  role = "status",
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      role={role}
      tabIndex={0}
      {...props}
    >
      {icon && (
        <span className="mr-1 flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
