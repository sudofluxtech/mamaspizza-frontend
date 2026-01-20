'use client';
import React from 'react';
import Link from 'next/link';
import { 
    Users, 
    ShoppingBag, 
    Utensils, 
    User,
    DollarSign,
    ArrowRight,
    Calendar
} from 'lucide-react';

const Admin = () => {
    // Mock data for dashboard
    const stats = {
        totalUsers: 1247,
        totalOrders: 89,
        totalRevenue: 12450.99,
        totalFoodItems: 45,
        activeUsers: 892,
        pendingOrders: 12,
        completedOrders: 77,
        featuredItems: 12
    };

    const recentOrders = [
        { id: 'ORD-001', customer: 'John Doe', amount: 45.99, status: 'Delivered', time: '2 hours ago' },
        { id: 'ORD-002', customer: 'Jane Smith', amount: 28.50, status: 'Processing', time: '3 hours ago' },
        { id: 'ORD-003', customer: 'Mike Johnson', amount: 15.99, status: 'Shipped', time: '4 hours ago' },
        { id: 'ORD-004', customer: 'Sarah Wilson', amount: 67.25, status: 'Pending', time: '5 hours ago' },
    ];

    const recentUsers = [
        { id: 1, name: 'Alice Brown', email: 'alice@example.com', joinDate: '2 days ago', status: 'Active' },
        { id: 2, name: 'Bob Green', email: 'bob@example.com', joinDate: '3 days ago', status: 'Active' },
        { id: 3, name: 'Carol Blue', email: 'carol@example.com', joinDate: '4 days ago', status: 'Active' },
        { id: 4, name: 'David Red', email: 'david@example.com', joinDate: '5 days ago', status: 'Active' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your food app today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            <p className="text-xs text-green-600 mt-1">+8% from last week</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Food Items</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalFoodItems}</p>
                            <p className="text-xs text-blue-600 mt-1">{stats.featuredItems} featured</p>
                        </div>
                        <Utensils className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                            >
                                View All
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.customer} • {order.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">${order.amount}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                            >
                                View All
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <p className="text-xs text-gray-400">{user.joinDate}</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        {user.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Users className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="font-medium text-gray-900">Manage Users</p>
                            <p className="text-sm text-gray-500">View and manage users</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                        <ShoppingBag className="w-6 h-6 text-orange-600" />
                        <div>
                            <p className="font-medium text-gray-900">View Orders</p>
                            <p className="text-sm text-gray-500">Track and manage orders</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/foods"
                        className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <Utensils className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-medium text-gray-900">Food Management</p>
                            <p className="text-sm text-gray-500">Manage menu items</p>
                        </div>
                    </Link>
                    
                    <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <User className="w-6 h-6 text-purple-600" />
                        <div>
                            <p className="font-medium text-gray-900">Profile Settings</p>
                            <p className="text-sm text-gray-500">Update your profile</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Completed Orders</span>
                            <span className="font-medium text-gray-900">{stats.completedOrders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Pending Orders</span>
                            <span className="font-medium text-gray-900">{stats.pendingOrders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Active Users</span>
                            <span className="font-medium text-gray-900">{stats.activeUsers}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Summary</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">New orders today: <span className="font-medium text-gray-900">12</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">New users today: <span className="font-medium text-gray-900">8</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Revenue today: <span className="font-medium text-gray-900">$1,245</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
