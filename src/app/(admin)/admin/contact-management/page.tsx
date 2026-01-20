'use client';
import React, { useState } from 'react';
import { 
    // Search, 
    Eye, 
    Trash2, 
    Phone,
    // MessageCircle,
    User,
    // Calendar,
    Loader2,
    // Clock
} from 'lucide-react';
import { useContacts, useDeleteContact } from '@/hooks/contact.hook';
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

const ContactManagementPage: React.FC = () => {
    // const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [perPage, setPerPage] = useState(10);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingContactId, setDeletingContactId] = useState<number | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewingContact, setViewingContact] = useState<any>(null);

    // Use the contacts hook with parameters
    const { contacts, loading, error, pagination , refetch} = useContacts();
    console.log(contacts);
    const { deleteContact, loading: deleting } = useDeleteContact();

    // Since we're using API filtering, no need for client-side filtering
    const filteredContacts = contacts;

    const askDelete = (id: number) => {
        setDeletingContactId(id);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingContactId) return;
        await deleteContact(deletingContactId);
        setDeleteOpen(false);
        setDeletingContactId(null);
        refetch();
    };

    const openView = (contact: any) => {
        setViewingContact(contact);
        setViewOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const contactDate = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return formatDate(dateString);
    };

    return (
        <>
        <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Contact Management</h1>
                    <p className="text-xs text-gray-600">Manage customer inquiries and messages</p>
                </div>
            </div>


            {/* Filters and Search */}
            {/* <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or message..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

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
            </div> */}

            {/* Contacts Table */}
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="ml-2 text-gray-600 text-sm">Loading contacts...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <p className="text-red-600 mb-2 text-sm">Error loading contacts</p>
                            <p className="text-gray-500 text-xs">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
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
                                    Contact
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-2 py-6 text-center text-gray-500 text-xs">
                                            No contacts found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                            <td className="px-2 py-1.5">
                                        <div className="flex items-center">
                                                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <User className="w-3 h-3 text-orange-600" />
                                            </div>
                                                    <div className="ml-2">
                                                        <div className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{contact.name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{contact.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="text-xs text-gray-900 truncate max-w-[200px]" title={contact.message}>
                                                    {contact.message}
                                                </div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="text-xs text-gray-900 flex items-center gap-1">
                                                    <Phone size={10} className="text-gray-400" />
                                                    <span className="truncate max-w-[100px]">{contact.phone}</span>
                                        </div>
                                    </td>
                                            <td className="px-2 py-1.5 text-xs text-gray-500">
                                                <div className="text-xs">{getTimeAgo(contact.created_at)}</div>
                                                <div className="text-xs text-gray-400">{formatDate(contact.created_at)}</div>
                                    </td>
                                            <td className="px-2 py-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    <button 
                                                        className="text-blue-600 hover:text-blue-900 p-0.5"
                                                        onClick={() => openView(contact)}
                                                    >
                                                        <Eye size={12} />
                                            </button>
                                                    <button 
                                                        className="text-red-600 hover:text-red-900 p-0.5" 
                                                        onClick={() => askDelete(contact.id)} 
                                                        disabled={deleting}
                                                    >
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

        {/* View Contact Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Contact Details</DialogTitle>
                    <DialogDescription>View full contact information and message.</DialogDescription>
                </DialogHeader>
                {viewingContact && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                                <div className="text-sm text-gray-900">{viewingContact.name}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                <div className="text-sm text-gray-900">{viewingContact.email}</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                            <div className="text-sm text-gray-900">{viewingContact.phone}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                                {viewingContact.message}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Created</label>
                                <div className="text-sm text-gray-500">{formatDate(viewingContact.created_at)}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Updated</label>
                                <div className="text-sm text-gray-500">{formatDate(viewingContact.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2">
                    <button onClick={() => setViewOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Close</button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete contact?</AlertDialogTitle>
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

export default ContactManagementPage;
