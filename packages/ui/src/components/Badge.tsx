import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-800 hover:bg-primary-200",
        secondary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
        success: "bg-success-100 text-success-800 hover:bg-success-200",
        warning: "bg-warning-100 text-warning-800 hover:bg-warning-200",
        danger: "bg-danger-100 text-danger-800 hover:bg-danger-200",
        outline: "text-primary-700 border border-primary-200",
        safety: "bg-success-100 text-success-800",
        mixed: "bg-warning-100 text-warning-800",
        risky: "bg-danger-100 text-danger-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

// Specialized badge components
const SafetyBadge = ({ score, className }: { score: number; className?: string }) => {
  let variant: "safety" | "mixed" | "risky" = "safety"
  let text = "Safe"
  
  if (score < 60) {
    variant = "risky"
    text = "Risky"
  } else if (score < 80) {
    variant = "mixed"
    text = "Mixed"
  }
  
  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  )
}

const AgeBadge = ({ age, className }: { age: number; className?: string }) => {
  const getAgeBand = (age: number) => {
    if (age <= 10) return "8-10"
    if (age <= 13) return "11-13"
    if (age <= 16) return "14-16"
    return "17+"
  }
  
  return (
    <Badge variant="outline" className={className}>
      Age {getAgeBand(age)}
    </Badge>
  )
}

const ConfidenceBadge = ({ confidence, className }: { confidence: number; className?: string }) => {
  let variant: "success" | "warning" | "danger" = "success"
  let text = "High Confidence"
  
  if (confidence < 0.5) {
    variant = "danger"
    text = "Low Confidence"
  } else if (confidence < 0.8) {
    variant = "warning"
    text = "Medium Confidence"
  }
  
  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  )
}

export { Badge, SafetyBadge, AgeBadge, ConfidenceBadge, badgeVariants } 