'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/stores/useAuth'
import AdminProfileTab from './AdminProfileTab'
import AdminProfileInfoTab from './AdminProfileInfoTab'
import AdminChangePasswordTab from './AdminChangePasswordTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UnauthorizedAccess from '@/components/ui/UnauthorizedAccess'

const AdminProfilePage = () => {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isAuthenticated) {
    return <UnauthorizedAccess />
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <AdminProfileInfoTab />
      case 'password':
        return <AdminChangePasswordTab />
      default:
        return <AdminProfileInfoTab />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600">Manage your admin account settings</p>
          </div>
        </div>
        
        <AdminProfileTab activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  )
}

export default AdminProfilePage
