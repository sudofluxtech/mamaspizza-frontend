'use client'

import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6'
      case 'md':
        return 'h-12 w-12'
      case 'lg':
        return 'h-16 w-16'
      default:
        return 'h-12 w-12'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-orange-500 mx-auto mb-4 ${getSizeClasses()}`}></div>
        <div className="text-gray-600">{message}</div>
      </div>
    </div>
  )
}

export default LoadingSpinner
