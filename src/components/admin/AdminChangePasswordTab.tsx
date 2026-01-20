'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Save, X } from 'lucide-react'
import { useAuth } from '@/lib/stores/useAuth'
import { useNotification } from '@/components/ui/NotificationProvider'
import { CHANGE_PASSWORD_API } from '@/app/api'

const AdminChangePasswordTab: React.FC = () => {
  const { token } = useAuth()
  const { showNotification } = useNotification()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'New passwords do not match',
      })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Password must be at least 6 characters long',
      })
      return
    }

    try {
      setSubmitting(true)
      
      if (!token) throw new Error('Not authenticated')

      const res = await fetch(CHANGE_PASSWORD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          previous_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_new_password: passwordData.confirmPassword,
        }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Request failed with status ${res.status}`)
      }

      showNotification({
        type: 'success',
        title: 'Success',
        message: 'Password updated successfully',
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (e: any) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: e?.message || 'Failed to update password',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Update your password to keep your account secure. Make sure to use a strong password.
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm"
            >
              <Save size={16} />
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminChangePasswordTab
