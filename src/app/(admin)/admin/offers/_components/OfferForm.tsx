'use client';

import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/category.hook';
import { useAuth } from '@/lib/stores/useAuth';
import { ADMIN_OFFERS_API, API_BASE_URL } from '@/app/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface OfferFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    instance?: any; // Offer instance for editing
    onSuccess?: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({
    open,
    setOpen,
    instance,
    onSuccess
}) => {
    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        buy_quantity: 1,
        get_quantity: 1,
        category_id: '',
        terms_conditions: '',
        is_active: true,
        thumbnail: null as File | null
    });
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hooks
    const { token } = useAuth();
    const { categories, loading: categoriesLoading } = useCategories();

    const isEdit = !!instance;

    // Initialize form data when instance changes
    useEffect(() => {
        if (instance) {
            setFormData({
                title: instance.title || '',
                description: instance.description || '',
                buy_quantity: instance.buy_quantity || 1,
                get_quantity: instance.get_quantity || 1,
                category_id: instance.category_id?.toString() || '',
                terms_conditions: instance.terms_conditions || '',
                is_active: instance.is_active !== undefined ? instance.is_active : true,
                thumbnail: null
            });

            // Set thumbnail preview if exists
            if (instance.thumbnail) {
                setThumbnailPreview(`${API_BASE_URL}${instance.thumbnail}`);
            }

        } else {
            // Reset form for new offer
            setFormData({
                title: '',
                description: '',
                buy_quantity: 1,
                get_quantity: 1,
                category_id: '',
                terms_conditions: '',
                is_active: true,
                thumbnail: null
            });
            setThumbnailPreview(null);
        }
    }, [instance]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('buy_quantity', formData.buy_quantity.toString());
            submitData.append('get_quantity', formData.get_quantity.toString());
            submitData.append('category_id', formData.category_id);
            submitData.append('terms_conditions', formData.terms_conditions);
            submitData.append('is_active', formData.is_active ? '1' : '0');

            if (formData.thumbnail) {
                submitData.append('thumbnail', formData.thumbnail);
            }

            // Determine API endpoint and method
            const apiUrl = isEdit
                ? `${ADMIN_OFFERS_API}/${instance.id}/update`
                : ADMIN_OFFERS_API;
            const method = isEdit ? 'POST' : 'POST';

            // Make API call
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: submitData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success(isEdit ? 'Offer updated successfully!' : 'Offer created successfully!');
                onSuccess?.();
                setOpen(false);
                resetForm();
            } else {
                console.error('Error with offer:', data.message);
                toast.error(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting offer:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            buy_quantity: 1,
            get_quantity: 1,
            category_id: '',
            terms_conditions: '',
            is_active: true,
            thumbnail: null
        });
        setThumbnailPreview(null);
    };

    const handleClose = () => {
        setOpen(false);
        if (!isEdit) {
            resetForm();
        }
    };


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">
                        {isEdit ? 'Edit Offer' : 'Create New Offer'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {isEdit ? 'Update the offer information below.' : 'Fill in the details to create a new promotional offer.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Offer Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Buy 2 Get 1 Free - Pizza Special"
                                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Get one free pizza when you buy two pizzas from our premium collection"
                                rows={2}
                                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Offer Configuration */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Buy Quantity *</label>
                            <input
                                type="number"
                                name="buy_quantity"
                                value={formData.buy_quantity}
                                onChange={handleInputChange}
                                min="1"
                                placeholder="2"
                                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Get Quantity *</label>
                            <input
                                type="number"
                                name="get_quantity"
                                value={formData.get_quantity}
                                onChange={handleInputChange}
                                min="0"
                                placeholder="1"
                                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                            disabled={categoriesLoading}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {categoriesLoading && (
                            <p className="text-xs text-muted-foreground mt-1">Loading...</p>
                        )}
                    </div>


                    {/* Status and Terms */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                            />
                            <label className="text-sm font-medium">Active Offer</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Terms & Conditions</label>
                            <textarea
                                name="terms_conditions"
                                value={formData.terms_conditions}
                                onChange={handleInputChange}
                                placeholder="Valid for premium pizzas only. Cannot be combined with other offers. Valid until end of month."
                                rows={2}
                                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm resize-none"
                            />
                        </div>
                    </div>


                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Offer Image</label>
                        <div className="space-y-3">
                            {/* File Input */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-input rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <Upload className="w-5 h-5 mb-1 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 2MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                </label>
                            </div>

                            {/* Thumbnail Preview */}
                            {thumbnailPreview && (
                                <div className="relative inline-block">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={thumbnailPreview}
                                        alt="Offer preview"
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-2 justify-end pt-3 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors text-sm"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? 'Update Offer' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default OfferForm;