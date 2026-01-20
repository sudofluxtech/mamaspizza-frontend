'use client'

import React from 'react'
import { Edit3, Save, X } from 'lucide-react'

interface ProfileActionsProps {
  isEditing: boolean
  loading: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
      
      {!isEditing ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileActions
