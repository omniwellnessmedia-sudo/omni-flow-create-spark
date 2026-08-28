
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Component - WCAG 2.2 Compliant
 * 
 * Touch Targets: All sizes meet WCAG 2.5.5 minimum of 44x44px
 * Focus States: Uses focus-visible for keyboard users
 * Contrast: All variants meet WCAG 1.4.3 AA requirements
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] font-medium rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-visible select-none touch-manipulation",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "bg-destructive text-white border-transparent hover:bg-destructive/90 shadow-sm",
        outline: "btn-secondary",
        secondary: "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 shadow-sm",
        ghost: "bg-transparent border-0 hover:bg-accent hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline bg-transparent border-0 rounded-none",
        premium: "btn-primary",
        wellness: "btn-primary",
        solid: "btn-primary",
        soft: "btn-secondary",
      },
      size: {
        // WCAG 2.5.5: All touch targets minimum 44x44px
        default: "min-h-[48px] min-w-[48px] px-6 py-3 text-[15px]",
        sm: "min-h-[44px] min-w-[44px] px-4 py-2 text-sm",
        lg: "min-h-[56px] min-w-[56px] px-8 py-4 text-base",
        icon: "min-h-[48px] min-w-[48px] w-12",
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
