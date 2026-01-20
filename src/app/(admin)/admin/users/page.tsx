'use client';
import React, { useState } from 'react';
import { 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    User,
    Mail,
    Calendar,
    Loader2
} from 'lucide-react';
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/users.hook';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const UsersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    // Note: Status filter removed as API doesn't provide status field
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; email: string; role: string }>({ name: '', email: '', role: 'user' });

    // Use the users hook with parameters
    const { users, loading, error, pagination, refetch } = useUsers({
        role: filterRole === 'All' ? undefined : filterRole,
        search: searchQuery || undefined,
        per_page: perPage,
        page: currentPage,
    });
    const { updateUser, loading: updating } = useUpdateUser();
    const { deleteUser, loading: deleting } = useDeleteUser();

    // Since the API doesn't provide status field, we'll show all users
    const filteredUsers = users;
    const openEdit = (u: any) => {
        setEditingUserId(String(u.id));
        setEditForm({ name: u.name || '', email: u.email || '', role: u.role || 'user' });
        setEditOpen(true);
    };

    const submitEdit = async () => {
        if (!editingUserId) return;
        await updateUser(editingUserId, {
            name: editForm.name,
            email: editForm.email,
            role: editForm.role,
        });
        setEditOpen(false);
        setEditingUserId(null);
        await refetch({
            role: filterRole === 'All' ? undefined : filterRole,
            search: searchQuery || undefined,
            per_page: perPage,
            page: currentPage,
        });
    };

    const askDelete = (id: number) => {
        setDeletingUserId(String(id));
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingUserId) return;
        await deleteUser(deletingUserId);
        setDeleteOpen(false);
        setDeletingUserId(null);
        await refetch({
            role: filterRole === 'All' ? undefined : filterRole,
            search: searchQuery || undefined,
            per_page: perPage,
            page: currentPage,
        });
    };


    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            case 'staff':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
        <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Users</h1>
                    <p className="text-xs text-gray-600">Manage users and permissions</p>
                </div>
                <button className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600 transition-colors">
                    <Plus size={14} />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-2">
                <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : pagination?.total_items || 0}
                            </p>
                        </div>
                        <User className="w-4 h-4 text-orange-500" />
                    </div>
                </div>
                
                <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Address</p>
                            <p className="text-lg font-bold text-green-600">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : users.filter(u => u.delivery_address).length}
                            </p>
                        </div>
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Admins</p>
                            <p className="text-lg font-bold text-purple-600">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Staff</p>
                            <p className="text-lg font-bold text-blue-600">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : users.filter(u => u.role === 'staff').length}
                            </p>
                        </div>
                        <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex gap-2">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="w-20">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="All">All</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>

                    {/* Per Page Selector */}
                    <div className="w-16">
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-600 text-sm">Loading users...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-red-600 mb-2 text-sm">Error loading users</p>
                            <p className="text-gray-500 text-xs">{error}</p>
                            <button 
                                onClick={() => refetch()}
                                className="mt-3 px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Address
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-6 text-center text-gray-500 text-xs">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1.5">
                                        <div className="flex items-center">
                                                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <User className="w-3 h-3 text-orange-600" />
                                            </div>
                                                    <div className="ml-2">
                                                        <div className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{user.name}</div>
                                                        <div className="text-xs text-gray-500">#{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="text-xs text-gray-900 flex items-center gap-1">
                                                    <Mail size={10} className="text-gray-400" />
                                                    <span className="truncate max-w-[140px]">{user.email}</span>
                                        </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                {user.delivery_address ? (
                                                    <div className="text-xs text-gray-900">
                                                        <div className="font-medium truncate max-w-[100px]">{user.delivery_address.city}</div>
                                                        <div className="text-gray-500 truncate max-w-[100px]">{user.delivery_address.details}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No address</span>
                                                )}
                                    </td>
                                            <td className="px-2 py-1.5 text-xs text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    <button className="text-blue-600 hover:text-blue-900 p-0.5">
                                                        <Eye size={12} />
                                            </button>
                                                    <button className="text-orange-600 hover:text-orange-900 p-0.5" onClick={() => openEdit(user)}>
                                                        <Edit size={12} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 p-0.5" onClick={() => askDelete(user.id)} disabled={deleting}>
                                                        <Trash2 size={12} />
                                                    </button>
                                        </div>
                                    </td>
                                </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && (
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pagination.from}</span> to{' '}
                        <span className="font-medium">{pagination.to}</span> of{' '}
                        <span className="font-medium">{pagination.total_items}</span> results
                </div>
                <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={!pagination.has_prev_page}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Previous
                    </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        pageNum === pagination.current_page
                                            ? 'bg-orange-500 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                    </button>
                            );
                        })}
                        
                        <button 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={!pagination.has_next_page}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Next
                    </button>
                </div>
            </div>
            )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Update user details and role.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={editForm.role}
                            onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                    <button onClick={() => setEditOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={submitEdit} disabled={updating} className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">
                        {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete user?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700 text-white'>Delete</AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
};

export default UsersPage;
