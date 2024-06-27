import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'src/lib/utils'

const buttonVariants = cva(
  'flex flex-row items-center justify-center gap-x-6 rounded-[4px] border px-6 py-3 [&>div]:text-2xl transition-colors duration-200 [&>div]:leading-6 [&>p]:text-base',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-skyBlue text-primary-white disabled:bg-tertiary-skyBlue-20',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-primary-skyBlue bg-transparent text-primary-skyBlue disabled:border-tertiary-skyBlue-20 disabled:text-tertiary-skyBlue-20',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        dashed:
          'flex flex-row justify-center items-center border-dashed border-[2px] border-bg-tertiary-grey-stone bg-background-seasalt text-tertiary-grey-dim',
        elements:
          'w-44 text-left bg-tertiary-skyBlue-10 text-primary-skyBlue pl-6 pr-2 border-primary-skyBlue text-md',
      },
      size: {
        default: '',
        sm: 'h-9 rounded-md px-3',
        lg: 'px-10',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
