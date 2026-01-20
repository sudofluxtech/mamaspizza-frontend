"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Package, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { getOrderDetailsByorderNumber } from '@/app/api';

const OrderTrackingContent = () => {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order_no');

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderNumber) {
                setError('Order number is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const url = getOrderDetailsByorderNumber(orderNumber);

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Order not found');
                    }
                    throw new Error('Failed to fetch order details');
                }

                const result = await response.json();
                setOrder(result.data || result);
            } catch (err: any) {
                console.error('Error fetching order details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Clock className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Order Details</h2>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No Order Found</h2>
                    <p className="text-gray-600">The order doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' };
            case 'confirmed':
                return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Confirmed' };
            case 'preparing':
                return { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Preparing' };
            case 'ready':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Ready' };
            case 'out_for_delivery':
                return { color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Out for Delivery' };
            case 'delivered':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' };
            case 'cancelled':
                return { color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: status };
        }
    };

    const getPaymentStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return { color: 'text-green-600', bg: 'bg-green-50', label: 'Paid' };
            case 'pending':
                return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' };
            case 'failed':
                return { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' };
            case 'refunded':
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Refunded' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-50', label: status };
        }
    };

    const orderStatus = getStatusInfo(order.status);
    const paymentStatus = getPaymentStatusInfo(order.payment_status);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-orange-500 py-40">
                <div className="max-w-2xl mt-20 mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Order #{order.order_number || orderNumber}</h1>
                    <p className="text-orange-100">Track your order status</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Status Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Order Status</p>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${orderStatus.bg} ${orderStatus.color}`}>
                                {orderStatus.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.bg} ${paymentStatus.color}`}>
                                {paymentStatus.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div className="space-y-3">
                        {order.order_items?.map((item: any, index: number) => (
                            <div key={item.id || index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                                <div>
                                    <h3 className="font-medium text-gray-900">{item.item_name || item.name}</h3>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${item.total_price || item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${order.subtotal || order.subtotal_amount}</span>
                        </div>
                        {parseFloat(order.delivery_fee || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-medium">${order.delivery_fee}</span>
                            </div>
                        )}
                        {parseFloat(order.tax_amount || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">${order.tax_amount}</span>
                            </div>
                        )}
                        {parseFloat(order.discount_amount || 0) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Discount</span>
                                <span className="font-medium text-green-600">-${order.discount_amount}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="flex justify-between">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-orange-600">${order.total_amount || order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium text-gray-900">{order.customer_name || order.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{order.customer_email || order.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium text-gray-900">{order.customer_phone || order.phone}</p>
                            </div>
                        </div>
                        {order.delivery_address && (
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-600">Delivery Address</p>
                                    <p className="font-medium text-gray-900">{order.delivery_address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Special Instructions */}
                {order.special_instructions && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h2>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-gray-800">{order.special_instructions}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderTrackingPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Clock className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Order Details</h2>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        }>
            <OrderTrackingContent />
        </Suspense>
    );
};

export default OrderTrackingPage;