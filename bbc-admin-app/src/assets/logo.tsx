import { cn } from '@/lib/utils'

/**
 * BBC Logo — Displays favicon.png from public/images
 */
export function Logo({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/images/favicon.png"
      alt="BBC Logo"
      className={cn('size-6', className)}
      style={{ filter: 'none' }}
      {...props}
    />
  )
}
