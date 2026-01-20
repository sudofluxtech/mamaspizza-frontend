"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  ChefHat, 
  XCircle, 
  RotateCcw,
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Receipt,
  Star,
  AlertCircle
} from 'lucide-react';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={12} />;
      case "out_for_delivery":
        return <Truck size={12} />;
      case "ready":
        return <Package size={12} />;
      case "preparing":
        return <ChefHat size={12} />;
      case "confirmed":
        return <CheckCircle size={12} />;
      case "pending":
        return <Clock size={12} />;
      case "cancelled":
        return <XCircle size={12} />;
      case "refunded":
        return <RotateCcw size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            Order Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete information about order #{order.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Status Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                  <p className="text-sm text-gray-600">#{order.order_number}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{order.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.customer_phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : order.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.delivery_address && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{order.delivery_address.address_line_1}</p>
                  {order.delivery_address.address_line_2 && (
                    <p className="text-gray-700">{order.delivery_address.address_line_2}</p>
                  )}
                  <p className="text-gray-700">
                    {order.delivery_address.city}, {order.delivery_address.post_code}
                  </p>
                  {order.delivery_address.details && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Special Note</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">{order.delivery_address.details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Items ({order.order_items.length})</h3>
              </div>
              <div className="space-y-4">
                {order.order_items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Star className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.item_name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${parseFloat(item.item_price).toFixed(2)} each</p>
                      <p className="text-sm text-gray-500">Total: ${parseFloat(item.total_price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax ({order.tax_rate}%)</span>
                  <span className="font-medium text-gray-900">${parseFloat(order.tax_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-900">${parseFloat(order.delivery_fee).toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-${parseFloat(order.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Special Instructions</h3>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
                <p className="text-gray-700">{order.special_instructions}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
