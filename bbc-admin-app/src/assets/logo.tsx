import { cn } from '@/lib/utils'

/**
 * BBC Logo — Uses dark favicon for both light and dark modes
 */
export function Logo({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/images/favicon%20dark.png"
      alt="BBC Logo"
      className={cn('size-6', className)}
      {...props}
    />
  )
}
