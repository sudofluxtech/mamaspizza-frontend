'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, Hash, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { usePostCodes, useCreatePostCode, useUpdatePostCode, useDeletePostCode, PostCode } from '@/hooks/post-codes.hook';

const PostCodesPage: React.FC = () => {
  const { postCodes, loading,  refetch } = usePostCodes();
  const { createPostCode, loading: creating } = useCreatePostCode();
  const { updatePostCode, loading: updating } = useUpdatePostCode();
  const { deletePostCode, loading: deleting } = useDeletePostCode();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'inactive'>('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PostCode | null>(null);

  const [form, setForm] = useState<{ code: string; deliver_charge: string; status: 'active' | 'inactive'; }>({
    code: '',
    deliver_charge: '0',
    status: 'active',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filtered = useMemo(() => {
    return postCodes.filter(pc => {
      const matchesSearch = pc.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || pc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [postCodes, searchQuery, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', deliver_charge: '0', status: 'active' });
    setShowForm(true);
  };

  const openEdit = (pc: PostCode) => {
    setEditing(pc);
    setForm({ code: pc.code, deliver_charge: String(pc.deliver_charge), status: pc.status });
    setShowForm(true);
  };

  const onSubmit = async () => {
    const deliverChargeNum = parseFloat(form.deliver_charge) || 0;
    if (!form.code.trim()) {
      return;
    }

    try {
      if (editing) {
        await updatePostCode(editing.id, {
          code: form.code.trim(),
          deliver_charge: deliverChargeNum,
          status: form.status,
        });
      } else {
        await createPostCode({
          code: form.code.trim(),
          deliver_charge: deliverChargeNum,
          status: form.status,
        });
      }
      setShowForm(false);
      setEditing(null);
      await refetch();
    } catch (e) {
      console.error(e);
      // handled by hooks' error states
    }
  };

  const onDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      await deletePostCode(deleteId);
      await refetch();
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const isBusy = Boolean(loading || creating || updating || deleting);

  const statusBadge = (status: 'active' | 'inactive') =>
    status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Post Codes</h1>
          <p className="text-sm text-gray-600">Manage delivery post codes and charges</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            <span>Add Post Code</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((pc) => (
                  <tr key={pc.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Hash className="w-4 h-4 text-gray-400" />
                        {pc.code}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {Number(pc.deliver_charge ?? 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell text-sm text-gray-700">{new Date(pc.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 hidden lg:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge(pc.status)}`}>
                        {pc.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(pc)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(pc.id)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
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

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Post Code' : 'Add Post Code'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the selected post code.' : 'Create a new post code entry.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 border-gray-200 bg-white`}
                  placeholder="e.g., 1200 or E6-2"
                />
              </div>
            </div>

            {/* Deliver Charge */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Charge</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.deliver_charge}
                  onChange={(e) => setForm((prev) => ({ ...prev, deliver_charge: e.target.value }))}
                  className={`w-full rounded-xl border-2 pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 border-gray-200 bg-white`}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                  className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  {form.status === 'active' ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Inactive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isBusy}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {editing ? (isBusy ? 'Saving...' : 'Save Changes') : (isBusy ? 'Creating...' : 'Create')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete AlertDialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected post code.
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

export default PostCodesPage;


