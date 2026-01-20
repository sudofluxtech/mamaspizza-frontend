'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/stores/useAuth'
import ProfileTab from './ProfileTab'
import ProfileInfoTab from './ProfileInfoTab'
import DeliveryAddressTab from './DeliveryAddressTab'
import ChangePasswordTab from './ChangePasswordTab'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import UnauthorizedAccess from '@/components/ui/UnauthorizedAccess'

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  // Reset to profile tab if admin user has address tab selected
  useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'address') {
      setActiveTab('profile')
    }
  }, [user?.role, activeTab])

  if (!isAuthenticated) {
    return <UnauthorizedAccess />
  }

  if (!user) {
    return <LoadingSpinner message="Loading user data..." />
  }

  const renderTabContent = () => {
    // If user is admin and address tab is selected, default to profile
    if (user.role === 'admin' && activeTab === 'address') {
      return <ProfileInfoTab />
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileInfoTab />
      case 'address':
        return <DeliveryAddressTab />
      case 'password':
        return <ChangePasswordTab />
      default:
        return <ProfileInfoTab />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-[250px]">
        <ProfileTab activeTab={activeTab} onTabChange={setActiveTab} userRole={user.role} />
        {renderTabContent()}
      </div>
    </div>
  )
}

export default ProfilePage
