'use client';
import React, { useState } from 'react';
import { 
    User, 
    Mail, 
    MapPin, 
    Edit,
    Save,
    X,
    Store
} from 'lucide-react';

interface ProfileFormProps {
    ownerData: {
        fullName: string;
        shopName: string;
        email: string;
        address: string;
    };
    onSave: (data: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ ownerData, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(ownerData);

    const handleSave = () => {
        onSave(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(ownerData);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        {/* Avatar */}
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <User className="w-12 h-12 text-orange-600" />
                            </div>
                        </div>

                        {/* Owner Info */}
                        <h3 className="text-xl font-semibold text-gray-900">
                            {isEditing ? formData.fullName : ownerData.fullName}
                        </h3>
                        <p className="text-gray-600 mb-2">Restaurant Owner</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {isEditing ? formData.shopName : ownerData.shopName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Owner Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <Edit size={20} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{ownerData.fullName}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                            <div className="flex items-center gap-2">
                                <Store size={16} className="text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.shopName}
                                        onChange={(e) => handleInputChange('shopName', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{ownerData.shopName}</p>
                                )}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{ownerData.email}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                {isEditing ? (
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        rows={2}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-900">{ownerData.address}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
