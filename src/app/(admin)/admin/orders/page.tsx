"use client";
import React, { useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  User,
  Loader2,
  ChefHat,
  RotateCcw,
} from "lucide-react";
import {
  useAdminOrders,
  useUpdateOrderStatus,
  useCancelOrder,
} from "@/hooks/admin-orders.hook";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import OrderDetailsDialog from "./_components/OrderDetailsDialog";
import { useDebounce } from "@/hooks/useDebounce";

const OrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusOpen, setStatusOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState("pending");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Debounce search query with 1 second delay
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const isSearching = searchQuery !== debouncedSearchQuery;

  // Use the admin orders hook with parameters
  const { orders, loading, error, pagination, summary, refetch } =
    useAdminOrders({
      status: filterStatus === "All" ? undefined : filterStatus,
      payment_status:
        filterPaymentStatus === "All" ? undefined : filterPaymentStatus,
      search: debouncedSearchQuery || undefined,
      per_page: perPage,
      page: currentPage,
    });
  const { updateOrderStatus, loading: updatingStatus } = useUpdateOrderStatus();
  const { cancelOrder, loading: cancelling } = useCancelOrder();

  // Since we're using API filtering, no need for client-side filtering
  const filteredOrders = orders;

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Order status progression helper
  const getStatusProgression = (currentStatus: string) => {
    const statuses = [
      {
        value: "pending",
        label: "Pending",
        color: "bg-gray-100 text-gray-800",
      },
      {
        value: "confirmed",
        label: "Confirmed",
        color: "bg-yellow-100 text-yellow-800",
      },
      {
        value: "preparing",
        label: "Preparing",
        color: "bg-orange-100 text-orange-800",
      },
      {
        value: "ready",
        label: "Ready",
        color: "bg-purple-100 text-purple-800",
      },
      {
        value: "out_for_delivery",
        label: "Out for Delivery",
        color: "bg-blue-100 text-blue-800",
      },
      {
        value: "delivered",
        label: "Delivered",
        color: "bg-green-100 text-green-800",
      },
    ];

    const currentIndex = statuses.findIndex(
      (s) => s.value === currentStatus.toLowerCase()
    );
    return statuses.map((status, index) => ({
      ...status,
      isActive: index === currentIndex,
      isCompleted: index < currentIndex,
      isUpcoming: index > currentIndex,
    }));
  };

//   const totalRevenue = summary ? parseFloat(summary.total_revenue) : 0;
  const totalOrders = summary?.total_orders || pagination?.total_items || 0;
  const pendingOrders =
    summary?.pending_orders ||
    orders.filter((order) => order.status === "pending").length;
  const paidOrders =
    summary?.paid_orders ||
    orders.filter((order) => order.payment_status === "paid").length;

  const openEditStatus = (order: any) => {
    setEditingOrderId(String(order.id));
    setStatusValue(order.status || "pending");
    setStatusOpen(true);
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const submitStatusUpdate = async () => {
    if (!editingOrderId) return;
    await updateOrderStatus(editingOrderId, statusValue);
    setStatusOpen(false);
    setEditingOrderId(null);
    await refetch({
      status: filterStatus === "All" ? undefined : filterStatus,
      payment_status:
        filterPaymentStatus === "All" ? undefined : filterPaymentStatus,
      search: debouncedSearchQuery || undefined,
      per_page: perPage,
      page: currentPage,
    });
  };

  const askCancel = (id: number) => {
    setDeletingOrderId(String(id));
    setDeleteOpen(true);
  };

  const confirmCancel = async () => {
    if (!deletingOrderId) return;
    await cancelOrder(deletingOrderId);
    setDeleteOpen(false);
    setDeletingOrderId(null);
    await refetch({
      status: filterStatus === "All" ? undefined : filterStatus,
      payment_status:
        filterPaymentStatus === "All" ? undefined : filterPaymentStatus,
      search: debouncedSearchQuery || undefined,
      per_page: perPage,
      page: currentPage,
    });
  };

  return (
    <>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Orders</h1>
            <p className="text-xs text-gray-600">
              Track and manage customer orders
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/admin/orders/create-guest-order"
              className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
            >
              <Package size={12} />
              Create Guest Order
            </Link>
            {/* <button className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 transition-colors">
              <Package size={12} />
              Export
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    totalOrders
                  )}
                </p>
              </div>
              <Package className="w-4 h-4 text-blue-500" />
            </div>
          </div>



          <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg font-bold text-yellow-600">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    pendingOrders
                  )}
                </p>
              </div>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Paid</p>
                <p className="text-lg font-bold text-orange-600">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    paidOrders
                  )}
                </p>
              </div>
              <CheckCircle className="w-4 h-4 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
          <div className="flex gap-2">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                {isSearching ? (
                  <Loader2
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-orange-500 animate-spin"
                    size={12}
                  />
                ) : (
                  <Search
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={12}
                  />
                )}
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-24">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="w-20">
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
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

        {/* Orders Table */}
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-600 text-sm">
                Loading orders...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-red-600 mb-2 text-sm">
                  Error loading orders
                </p>
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
                      Order
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
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
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-2 py-6 text-center text-gray-500 text-xs"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-2 py-1.5">
                          <div className="text-xs font-medium text-gray-900 truncate ">
                            {order.order_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.payment_method}
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-orange-600" />
                            </div>
                            <div className="ml-2">
                              <div className="text-xs font-medium text-gray-900 truncate max-w-[100px]">
                                {order.customer_name}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[100px]">
                                {order.customer_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1.5 text-xs text-gray-900">
                          {order.order_items?.length || 0} items
                        </td>
                        <td className="px-2 py-1.5 text-xs font-medium text-gray-900">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="px-2 py-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">
                          <span
                            className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded ${getPaymentStatusColor(
                              order.payment_status
                            )}`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-0.5">
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-0.5"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye size={12} />
                            </button>
                            <button
                              className="text-orange-600 hover:text-orange-900 p-0.5"
                              onClick={() => openEditStatus(order)}
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-0.5"
                              onClick={() => askCancel(order.id)}
                              disabled={cancelling}
                            >
                              <XCircle size={12} />
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
              Showing <span className="font-medium">{pagination.from}</span> to{" "}
              <span className="font-medium">{pagination.to}</span> of{" "}
              <span className="font-medium">{pagination.total_items}</span>{" "}
              results
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
              {Array.from(
                { length: Math.min(5, pagination.total_pages) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        pageNum === pagination.current_page
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

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

      {/* Update Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the current status of the order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>

            {/* Status Progression Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs">
                {getStatusProgression(statusValue).map((status) => (
                  <div
                    key={status.value}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                        status.isCompleted
                          ? "bg-green-500 text-white"
                          : status.isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {status.isCompleted ? (
                        <CheckCircle size={12} />
                      ) : status.isActive ? (
                        <Clock size={12} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span
                      className={`text-xs text-center max-w-[60px] ${
                        status.isActive
                          ? "font-semibold text-orange-600"
                          : "text-gray-500"
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setStatusOpen(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={submitStatusUpdate}
              disabled={updatingStatus || statusValue === "delivered"}
              className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {updatingStatus ? "Saving..." : statusValue === "delivered" ? "Cannot modify delivered orders" : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={orderDetailsOpen}
        onOpenChange={setOrderDetailsOpen}
        order={selectedOrder}
      />

      {/* Cancel Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdersPage;
