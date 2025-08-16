import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

const Spinner = React.forwardRef(({ className, ...props }, ref) => (
  <Loader2
    ref={ref}
    className={cn("h-4 w-4 animate-spin", className)}
    {...props}
  />
))
Spinner.displayName = "Spinner"

export { Spinner }
