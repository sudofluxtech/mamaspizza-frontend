'use client'

import React from 'react'
import { User, MapPin, Lock } from 'lucide-react'

interface ProfileTabProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole?: string
}

const ProfileTab: React.FC<ProfileTabProps> = ({ activeTab, onTabChange, userRole }) => {
  const allTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Delivery Address', icon: MapPin },
    { id: 'password', label: 'Change Password', icon: Lock },
  ]

  // Filter out delivery address tab for admin users
  const tabs = userRole === 'admin' 
    ? allTabs.filter(tab => tab.id !== 'address')
    : allTabs

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
      <div className="flex flex-col sm:flex-row gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProfileTab
