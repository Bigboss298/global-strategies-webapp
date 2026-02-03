import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-2xl',
    xl: 'max-w-2xl sm:max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full rounded-xl sm:rounded-2xl bg-[#FEFEFE] shadow-2xl tbp-transition',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6">
            {title && <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#293749]">{title}</h2>}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}
        <div className="p-4 sm:p-6 max-h-[calc(100vh-120px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

