'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Bell,
    Check,
    X,
    Clock,
    AlertCircle,
    CheckCircle,
    Info
} from 'lucide-react';

// Mock notification data
const mockNotifications = [
    {
        id: 1,
        type: 'order',
        title: 'New Order Received',
        message: 'Order #1234 has been placed by John Doe',
        time: '2 minutes ago',
        isRead: false,
        icon: CheckCircle,
        iconColor: 'text-green-500'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Pizza ingredients are running low',
        time: '15 minutes ago',
        isRead: false,
        icon: AlertCircle,
        iconColor: 'text-orange-500'
    },
    {
        id: 3,
        type: 'info',
        title: 'System Update',
        message: 'New features have been added to your dashboard',
        time: '1 hour ago',
        isRead: true,
        icon: Info,
        iconColor: 'text-blue-500'
    },
    {
        id: 4,
        type: 'order',
        title: 'Order Completed',
        message: 'Order #1233 has been delivered successfully',
        time: '2 hours ago',
        isRead: true,
        icon: CheckCircle,
        iconColor: 'text-green-500'
    },
    {
        id: 5,
        type: 'warning',
        title: 'Payment Issue',
        message: 'Payment failed for order #1232',
        time: '3 hours ago',
        isRead: true,
        icon: AlertCircle,
        iconColor: 'text-red-500'
    }
];

const NotificationDropdown: React.FC = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const markAsRead = (id: number) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const getNotificationIcon = (notification: typeof mockNotifications[0]) => {
        const IconComponent = notification.icon;
        return <IconComponent size={16} className={notification.iconColor} />;
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                    <Check size={12} />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={32} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${
                                            !notification.isRead ? 'bg-orange-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getNotificationIcon(notification)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${
                                                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Clock size={12} className="text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="flex-shrink-0 p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-100">
                            <Link
                                href="/admin/notifications"
                                className="block w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium py-2 hover:bg-orange-50 rounded-lg transition-colors"
                                onClick={() => setShowNotifications(false)}
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
