import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100 align-top">
                <td className="p-3 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                <td className="p-3">
                  {order.shippingAddress?.fullName}
                  <br />
                  <span className="text-gray-400 text-xs">{order.shippingAddress?.phone}</span>
                </td>
                <td className="p-3">
                  {order.orderItems.map((item) => (
                    <div key={item.name}>{item.name} × {item.quantity}</div>
                  ))}
                </td>
                <td className="p-3">Rs. {order.totalPrice}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && (
          <p className="p-6 text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
