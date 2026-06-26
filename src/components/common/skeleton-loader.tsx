import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  className?: string
  count?: number
}

export function SkeletonLoader({ className, count = 1 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-lg bg-muted/50 animate-pulse',
            className || 'h-12 w-full'
          )}
        />
      ))}
    </>
  )
}
