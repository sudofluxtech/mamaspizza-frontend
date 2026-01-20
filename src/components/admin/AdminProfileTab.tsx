'use client'

import React from 'react'
import { User, Lock } from 'lucide-react'

interface AdminProfileTabProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const AdminProfileTab: React.FC<AdminProfileTabProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ]

  return (
    <div className="bg-gray-50 rounded-lg p-1 mb-6">
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AdminProfileTab
