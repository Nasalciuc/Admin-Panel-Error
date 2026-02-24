import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * BBC (BuyBusinessClass) Logo — Plane icon with gold accent mark.
 * Used in sidebar header and favicon.
 */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='bbc-admin-logo'
      viewBox='0 0 32 32'
      xmlns='http://www.w3.org/2000/svg'
      height='32'
      width='32'
      fill='none'
      className={cn('size-6', className)}
      {...props}
    >
      <title>BBC Admin</title>
      {/* Navy circle background */}
      <circle cx='16' cy='16' r='16' fill='#0B1829' />
      {/* Gold plane silhouette */}
      <path
        d='M24.5 10.5L14 15l-5-2-2 1 4 3-1 5 2 1 3-4 5 2 1-2-3-4L24.5 10.5z'
        fill='#C9A54E'
        strokeLinejoin='round'
      />
      {/* Gold accent dot */}
      <circle cx='24.5' cy='10.5' r='1.2' fill='#C9A54E' />
    </svg>
  )
}
