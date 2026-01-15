import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-11 w-full rounded-md border-2 border-gray-300 bg-[#FEFEFE] px-4 py-2 text-base text-[#293749] tbp-transition focus-visible:outline-none focus-visible:border-[#05A346] focus-visible:ring-1 focus-visible:ring-[#05A346] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'

