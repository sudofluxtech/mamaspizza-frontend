'use client';
import React, { useState } from 'react';
import { 
    Trash2, 
    Loader2,
} from 'lucide-react';
import { useSizes, useCreateSize, useDeleteSize } from '@/hooks/sizes.hook';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SizesPage: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSizeId, setDeletingSizeId] = useState<string | null>(null);
    
    // Form states
    const [newSize, setNewSize] = useState('');

    // Hooks
    const { sizes, loading, error, refetch } = useSizes();
    const { createSize, loading: createLoading } = useCreateSize();
    const { deleteSize, loading: deleteLoading } = useDeleteSize();

    // Show all sizes without filtering
    const filteredSizes = sizes;


    // Handler functions
    const handleCreateSize = async () => {
        const newSizeNum = Number(newSize);
        if (!newSizeNum || newSizeNum <= 0) return;
        
        const result = await createSize({ 
            size: newSizeNum,
            status: 1 // Always 1 (active) for sizes
        });
        if (result) {
            setNewSize('');
            refetch();
        }
    };


    const handleDeleteSize = async () => {
        if (!deletingSizeId) return;
        
        const result = await deleteSize(deletingSizeId);
        if (result) {
            setDeletingSizeId(null);
            setShowDeleteModal(false);
            refetch();
        }
    };


    const openDeleteModal = (sizeId: string) => {
        setDeletingSizeId(sizeId);
        setShowDeleteModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Sizes</h1>
                    <p className="text-gray-600">Manage your food sizes and portions</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Error: {error}</p>
                </div>
            )}

            {/* Add Size Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Size Number
                        </label>
                        <input
                            type="number"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Enter size number (e.g., 12, 14, 16)..."
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                            min="1"
                            step="1"
                        />
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={handleCreateSize}
                            disabled={createLoading || !newSize || Number(newSize) <= 0}
                            className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                            {createLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Add Size
                        </button>
                    </div>
                </div>
            </div>


            {/* Sizes Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="ml-2 text-sm text-gray-600">Loading sizes...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size Number
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated Date
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSizes.map((size) => (
                                    <tr key={size.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {size.size || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">
                                                {formatDate(size.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-xs text-gray-500">
                                                {formatDate(size.updated_at)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                <button 
                                                    onClick={() => openDeleteModal(size.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {filteredSizes.length === 0 && !loading && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="w-6 h-6 text-gray-400">📏</div>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">No sizes found</h3>
                    <p className="text-sm text-gray-500 mb-3">Get started by adding your first size</p>
                    <button 
                        onClick={() => {
                            // Focus on the form input
                            const input = document.querySelector('input[placeholder*="Enter size name"]') as HTMLInputElement;
                            if (input) input.focus();
                        }}
                        className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded hover:bg-orange-600 transition-colors"
                    >
                        Add Your First Size
                    </button>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the size
                            and remove it from your menu.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setShowDeleteModal(false);
                            setDeletingSizeId(null);
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSize}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SizesPage;
