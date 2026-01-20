'use client'

import React from 'react'
import Link from 'next/link'

interface UnauthorizedAccessProps {
  message?: string
  loginLink?: string
  loginText?: string
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  message = 'Please login to view your profile',
  loginLink = '/login',
  loginText = 'Go to Login'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-600 mb-4">{message}</div>
        <Link 
          href={loginLink} 
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          {loginText}
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedAccess
