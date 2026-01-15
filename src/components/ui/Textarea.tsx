import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded-md border-2 border-gray-300 bg-[#FEFEFE] px-4 py-3 text-base text-[#293749] tbp-transition placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#05A346] focus-visible:ring-1 focus-visible:ring-[#05A346] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 resize-y',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

