'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Settings } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-gray-400 mb-4">
            4<span className="text-orange-500">0</span>4
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Settings Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-10 h-10 text-gray-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            This admin page doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Admin Dashboard
          </Link>
          
          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Check the admin navigation menu or{' '}
            <Link href="/admin" className="text-orange-600 hover:text-orange-700 underline">
              return to dashboard
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
