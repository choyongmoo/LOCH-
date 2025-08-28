import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // 라이트 모드에서도 충분히 대비가 되도록 색상 강화
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700/70",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
