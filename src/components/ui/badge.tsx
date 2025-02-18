import React from "react"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div className={className} {...props} />
  )
}

export { Badge }
