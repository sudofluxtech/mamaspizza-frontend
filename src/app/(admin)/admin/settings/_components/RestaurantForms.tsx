'use client';
import React, { useState } from 'react';
import {
    FileText,
    Shield,
    FileCheck,
    RotateCcw,
    Store,
    MapPin,
    Info
} from 'lucide-react';
import { useUpdateRestaurant } from '@/hooks/restaurant.hook';
import { Restaurant } from '@/hooks/restaurant.hook';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

type RestaurantFormsProps = {
    instance: Restaurant;
    onChanged?: () => void;
}

const RestaurantForms: React.FC<RestaurantFormsProps> = ({ instance, onChanged }) => {
    const { updateRestaurant, loading: updateLoading } = useUpdateRestaurant();
    
    const [formData, setFormData] = useState({
        privacy_policy: instance.privacy_policy || '',
        terms: instance.terms || '',
        refund_process: instance.refund_process || '',
        license: instance.license || '',
        shop_name: instance.shop_name || '',
        shop_address: instance.shop_address || '',
        shop_details: instance.shop_details || ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateRestaurant(instance.id, formData);
            if (onChanged) onChanged();
        } catch (error) {
            console.error('Failed to update restaurant:', error);
        }
    };

    if (!instance) {
        return (
            <div className="max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurant Settings</h3>
                    <p className="text-gray-600 text-sm">Loading restaurant settings...</p>
                </div>
            </div>
        );
    }

  return (
        <div className="max-w-4xl space-y-6">
            {/* Shop Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Shop Information</h3>
                
                <div className="space-y-6">
                    {/* Shop Name */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Name</h4>
                            <p className="text-gray-600 text-sm mb-3">The name of your restaurant that customers will see.</p>
                            <input
                                type="text"
                                value={formData.shop_name}
                                onChange={(e) => handleInputChange('shop_name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter shop name"
                            />
                        </div>
                    </div>

                    {/* Shop Address */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Address</h4>
                            <p className="text-gray-600 text-sm mb-3">The physical address of your restaurant.</p>
                            <RichTextEditor
                                value={formData.shop_address}
                                onChange={(value) => handleInputChange('shop_address', value)}
                                placeholder="Enter shop address"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Shop Details */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Info className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Shop Details</h4>
                            <p className="text-gray-600 text-sm mb-3">Description and details about your restaurant.</p>
                            <RichTextEditor
                                value={formData.shop_details}
                                onChange={(value) => handleInputChange('shop_details', value)}
                                placeholder="Enter shop details"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Legal Information</h3>
                
                <div className="space-y-6">
                    {/* Privacy Policy */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Privacy Policy</h4>
                            <p className="text-gray-600 text-sm mb-3">Your restaurant&apos;s privacy policy for customer data protection.</p>
                            <RichTextEditor
                                value={formData.privacy_policy}
                                onChange={(value) => handleInputChange('privacy_policy', value)}
                                placeholder="Enter privacy policy"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Terms and Conditions</h4>
                            <p className="text-gray-600 text-sm mb-3">Terms and conditions for using your restaurant&apos;s services.</p>
                            <RichTextEditor
                                value={formData.terms}
                                onChange={(value) => handleInputChange('terms', value)}
                                placeholder="Enter terms and conditions"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Refund Process */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Refund Process</h4>
                            <p className="text-gray-600 text-sm mb-3">Information about your refund and return process.</p>
                            <RichTextEditor
                                value={formData.refund_process}
                                onChange={(value) => handleInputChange('refund_process', value)}
                                placeholder="Enter refund process details"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* License Information */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <FileCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">License Information</h4>
                            <p className="text-gray-600 text-sm mb-3">Your restaurant&apos;s license and certification details.</p>
                            <RichTextEditor
                                value={formData.license}
                                onChange={(value) => handleInputChange('license', value)}
                                placeholder="Enter license information"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
    </div>
    );
};

export default RestaurantForms;