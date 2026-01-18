import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:from-primary/90 hover:to-primary-glow/90 shadow-[0_0_20px_hsl(var(--primary)/0.25)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-105 active:scale-95",
        destructive: "bg-gradient-to-r from-destructive to-[hsl(360_70%_55%)] text-destructive-foreground hover:from-destructive/90 hover:to-[hsl(360_70%_50%)] hover:shadow-[0_0_20px_hsl(var(--destructive)/0.3)] hover:scale-105 active:scale-95",
        outline: "border-2 border-accent/50 bg-transparent text-foreground hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_15px_hsl(var(--accent)/0.2)] hover:scale-105 active:scale-95",
        secondary: "bg-gradient-to-r from-secondary to-[hsl(280_65%_55%)] text-secondary-foreground hover:from-secondary/90 hover:to-[hsl(280_65%_50%)] hover:shadow-lg hover:scale-105 active:scale-95",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:scale-105 active:scale-95",
        link: "text-accent underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-accent to-accent-glow text-accent-foreground border-0 shadow-[0_0_30px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:scale-105 active:scale-95 font-semibold transition-all duration-300",
        premium: "relative overflow-hidden bg-gradient-to-r from-accent via-primary to-accent-glow text-accent-foreground shadow-[0_8px_32px_hsl(var(--accent)/0.3)] hover:shadow-[0_12px_48px_hsl(var(--accent)/0.5)] hover:scale-105 active:scale-95 font-bold before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
