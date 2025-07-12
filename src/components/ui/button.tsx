
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold rounded-xl border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-visible",
  {
    variants: {
      variant: {
        default: "btn-primary shadow-lg hover:shadow-xl hover:scale-105",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline: "btn-secondary shadow-md hover:shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg",
        ghost: "bg-transparent border-0 hover:bg-accent hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline bg-transparent border-0 rounded-none",
        premium: "btn-primary shadow-xl hover:shadow-2xl hover:scale-105",
        wellness: "btn-primary shadow-lg hover:shadow-xl hover:scale-105",
        solid: "btn-primary shadow-lg hover:shadow-xl hover:scale-105",
        soft: "bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 hover:shadow-md backdrop-blur-sm",
      },
      size: {
        default: "min-h-[48px] px-6 py-4 text-base",
        sm: "min-h-[40px] px-4 py-2 text-sm",
        lg: "min-h-[56px] px-8 py-5 text-lg",
        icon: "min-h-[48px] w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
