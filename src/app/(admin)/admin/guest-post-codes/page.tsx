'use client';

import React, { useEffect } from 'react';
import { Loader2, Hash, Trash2 } from 'lucide-react';
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
import { useGuestPostCodes, useDeleteGuestPostCode, GuestPostCode } from '@/hooks/post-codes.hook';

const GuestPostCodesPage: React.FC = () => {
  const { guestPostCodes, loading, error, fetchGuestPostCodes } = useGuestPostCodes();
  const { deleteGuestPostCode, loading: deleting } = useDeleteGuestPostCode();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  useEffect(() => {
    fetchGuestPostCodes();
  }, [fetchGuestPostCodes]);

  const onDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteGuestPostCode(deleteId);
      await fetchGuestPostCodes();
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Guest Post Codes</h1>
        <p className="text-sm text-gray-600">List of guest post codes (no form)</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guestPostCodes.map((pc: GuestPostCode) => (
                  <tr key={pc.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {pc.code}
                      </div>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell text-sm text-gray-700">{new Date(pc.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => onDelete(pc.id)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete guest post code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700 text-white'>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuestPostCodesPage;


