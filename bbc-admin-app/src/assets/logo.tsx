import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * BBC Logo — Placeholder for custom branding
 * Replace this with your own logo SVG or component
 */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='bbc-logo-placeholder'
      viewBox='0 0 32 32'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('size-6', className)}
      {...props}
    >
      <title>BBC Logo</title>
      {/* Placeholder: simple square */}
      <rect width='32' height='32' rx='4' fill='currentColor' />
    </svg>
  )
}
