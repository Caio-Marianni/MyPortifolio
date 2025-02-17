import * as React from "react"

import { cn } from "@/lib/utils"


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div className={className} {...props} />
  )
}

export { Badge }
