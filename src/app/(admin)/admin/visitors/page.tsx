"use client";

import React, { useEffect, useState } from 'react';
import { useGuests, Guest, PageVisit } from '@/hooks/guests.hook';
import { useGuestAnalytics } from '@/hooks/guests-analytics.hook';
import { useAuth } from '@/lib/stores/useAuth';
import { 
  Users, 
  Eye, 
  Clock, 
  Monitor, 
  Smartphone, 
  Globe, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Visitors = () => {
  const { isAuthenticated } = useAuth();
  const { guests, loading, error, fetchGuests } = useGuests();
  const { analytics, loading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useGuestAnalytics();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated, fetchGuests]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getTotalSessionDuration = (pageVisits: PageVisit[] | null | undefined) => {
    if (!pageVisits || !Array.isArray(pageVisits)) {
      return 0;
    }
    return pageVisits.reduce((total, visit) => total + visit.total_duration, 0);
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to view visitor data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
              <p className="text-orange-600 mt-4 font-medium">Loading visitors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Visitors</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchGuests}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Visitors</h1>
              <p className="text-sm sm:text-base text-gray-600">Track and manage guest sessions</p>
            </div>
          </div>
          <button
            onClick={fetchGuests}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm sm:text-base">Refresh</span>
          </button>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Visitor Analytics</h2>
              <button
                onClick={refetchAnalytics}
                className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Visited Page</p>
                    <p className="font-semibold text-gray-900">{analytics.most_visited_page}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Visited Section</p>
                    <p className="font-semibold text-gray-900">{analytics.most_visited_section}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile Visits</p>
                    <p className="font-semibold text-gray-900">{analytics.mobile_visited}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Monitor className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Desktop Visits</p>
                    <p className="font-semibold text-gray-900">{analytics.desktop_visited}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Loading State */}
        {analyticsLoading && (
          <div className="bg-gray-50 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="text-blue-600 mt-3 font-medium">Loading analytics...</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Error State */}
        {analyticsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Analytics Error</h3>
                <p className="text-red-600">{analyticsError}</p>
              </div>
              <button
                onClick={refetchAnalytics}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
     

        {/* Visitors List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Guest Sessions</h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{guests.length}</p>
          </div>
          
          {guests.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Visitors Found</h3>
              <p className="text-sm sm:text-base text-gray-600">No guest sessions have been recorded yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Browser
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {guest.guest_id}
                            </div>
                            <div className="text-sm text-gray-500">
                              Session #{guest.session}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(guest.device_type)}
                            <span className="text-sm text-gray-900">
                              {guest.device_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.browser}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.ref}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDuration(getTotalSessionDuration(guest.page_visits))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setSelectedGuest(guest)}
                                className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </DialogTrigger>
                          <DialogContent className="min-w-full md:min-w-2xl lg:min-w-6xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Guest Session Details</DialogTitle>
                              <DialogDescription>
                                Detailed information for guest session {selectedGuest?.guest_id}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedGuest && (
                              <div className="space-y-6">
                                {/* Guest Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3">Guest Information</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm text-gray-600">Guest ID:</span>
                                      <p className="font-medium">{selectedGuest.guest_id}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Session:</span>
                                      <p className="font-medium">#{selectedGuest.session}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Reference:</span>
                                      <p className="font-medium">{selectedGuest.ref}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Browser:</span>
                                      <p className="font-medium">{selectedGuest.browser}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Device:</span>
                                      <p className="font-medium">{selectedGuest.device_type}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Created:</span>
                                      <p className="font-medium">{formatDate(selectedGuest.created_at)}</p>
                                    </div>
                               
                                  </div>
                                </div>

                                {/* Page Visits */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">
                                    Page Visits ({selectedGuest.page_visits?.length || 0})
                                  </h4>
                                  <p className="text-lg font-bold text-orange-800">
                                            {formatDuration(getTotalSessionDuration(selectedGuest.page_visits))}
                                          </p>
                                  {selectedGuest.page_visits && selectedGuest.page_visits.length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <table className="w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Page Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Section
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Entry Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Exit Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Duration
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {selectedGuest.page_visits.map((visit, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                              <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                  {visit.page_name}
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                  {visit.section_name}
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                  <Clock className="w-3 h-3" />
                                                  {formatDate(visit.in_time)}
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                  <Clock className="w-3 h-3" />
                                                  {formatDate(visit.out_time)}
                                                </div>
                                              </td>
                                              <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                  {formatDuration(visit.total_duration)}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                      <p>No page visits recorded</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                  {guests.map((guest) => (
                    <div key={guest.id} className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {guest.guest_id}
                          </div>
                          <div className="text-xs text-gray-500">
                            Session #{guest.session}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(guest.device_type)}
                          <span className="text-xs text-gray-600">
                            {guest.device_type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Browser</div>
                          <div className="text-sm text-gray-900">{guest.browser}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Reference</div>
                          <div className="text-sm text-gray-900">{guest.ref}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">Duration</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDuration(getTotalSessionDuration(guest.page_visits))}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setSelectedGuest(guest)}
                              className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Guest Session Details</DialogTitle>
                              <DialogDescription>
                                Detailed information for guest session {selectedGuest?.guest_id}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedGuest && (
                              <div className="space-y-6">
                                {/* Guest Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3">Guest Information</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <span className="text-sm text-gray-600">Guest ID:</span>
                                      <p className="font-medium text-sm">{selectedGuest.guest_id}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Session:</span>
                                      <p className="font-medium text-sm">#{selectedGuest.session}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Reference:</span>
                                      <p className="font-medium text-sm">{selectedGuest.ref}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Browser:</span>
                                      <p className="font-medium text-sm">{selectedGuest.browser}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Device:</span>
                                      <p className="font-medium text-sm">{selectedGuest.device_type}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Created:</span>
                                      <p className="font-medium text-sm">{formatDate(selectedGuest.created_at)}</p>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                      <div className="flex items-center gap-2 p-3 bg-orange-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        <div>
                                          <span className="text-sm text-gray-600">Total Duration:</span>
                                          <p className="text-lg font-bold text-orange-800">
                                            {formatDuration(getTotalSessionDuration(selectedGuest.page_visits))}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Page Visits */}
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">
                                    Page Visits ({selectedGuest.page_visits?.length || 0})
                                  </h4>
                                  {selectedGuest.page_visits && selectedGuest.page_visits.length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <table className="w-full border border-gray-200 rounded-lg text-sm">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Page
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Section
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                              Duration
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {selectedGuest.page_visits.map((visit, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                              <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                  {visit.page_name}
                                                </div>
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                  {visit.section_name}
                                                </div>
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                  {formatDuration(visit.total_duration)}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                                      <p className="text-sm">No page visits recorded</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visitors;