import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
      {icon && <div className="mb-3 sm:mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">{description}</p>}
      {action && (
        <div className="mt-4 sm:mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  )
}

