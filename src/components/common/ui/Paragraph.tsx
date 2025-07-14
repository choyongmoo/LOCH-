import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const paragraphVariants = cva("", {
  variants: {
    size: {
      default: "text-base",
      lg: "text-lg",
      sm: "text-sm",
    },
    muted: {
      true: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, muted, children, ...props }, ref) => {
    return (
      <p
        className={cn(paragraphVariants({ size, muted, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Paragraph.displayName = "Paragraph";

export { Paragraph };
