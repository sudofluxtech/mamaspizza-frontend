'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Pizza } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold text-orange-500 mb-4">
            4<span className="text-red-500">0</span>4
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Pizza Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Pizza className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Looks like this page went missing like our last slice of pizza! 🍕
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Go Home
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
        <div className="mt-12 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            <strong>Need help?</strong> Check out our{' '}
            <Link href="/menu" className="underline hover:text-orange-800">
              delicious menu
            </Link>{' '}
            or{' '}
            <Link href="/contact" className="underline hover:text-orange-800">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
