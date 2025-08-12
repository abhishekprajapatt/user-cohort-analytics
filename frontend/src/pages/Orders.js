import React, { useState, useEffect } from 'react';
import { ordersAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    orderDate: '',
    status: 'Delivered',
    paymentMethod: 'Credit Card',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, usersResponse] = await Promise.all([
        ordersAPI.getAll().catch(() => ({ data: [] })),
        usersAPI.getAll().catch(() => ({ data: [] })),
      ]);

      console.log('Orders API response:', ordersResponse);
      console.log('Users API response:', usersResponse);

      // Handle nested response structure
      const ordersData =
        ordersResponse.data?.orders || ordersResponse.data || [];
      const usersData = usersResponse.data?.users || usersResponse.data || [];

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setOrders([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        userId: formData.userId,
        totalAmount: parseFloat(formData.amount),
        subtotal: parseFloat(formData.amount),
        orderDate: formData.orderDate
          ? new Date(formData.orderDate)
          : new Date(),
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        items: [
          {
            productId: `PROD${Date.now()}`,
            productName: 'Sample Product',
            category: 'General',
            quantity: 1,
            unitPrice: parseFloat(formData.amount),
            totalPrice: parseFloat(formData.amount),
          },
        ],
        discount: 0,
        tax: 0,
        shippingCost: 0,
      };

      if (editingOrder) {
        await ordersAPI.update(editingOrder._id, orderData);
        toast.success('Order updated successfully');
      } else {
        await ordersAPI.create(orderData);
        toast.success('Order created successfully');
      }

      setShowForm(false);
      setEditingOrder(null);
      setFormData({
        userId: '',
        amount: '',
        orderDate: '',
        status: 'Delivered',
        paymentMethod: 'Credit Card',
      });
      fetchData();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      userId: order.userId,
      amount: (order.totalAmount || order.amount || 0).toString(),
      orderDate: order.orderDate?.split('T')[0] || '',
      status: order.status || 'Delivered',
      paymentMethod: order.paymentMethod || 'Credit Card',
    });
    setShowForm(true);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(orderId);
        toast.success('Order deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingOrder(null);
    setFormData({
      userId: '',
      amount: '',
      orderDate: '',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
    });
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Orders Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          Add Order
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingOrder ? 'Edit Order' : 'Add New Order'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">User</label>
              <select
                className="form-control"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Order Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                required
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                {editingOrder ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Orders List ({orders.length})</h3>
        {orders.length === 0 ? (
          <p>No orders found. Create your first order!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId || order._id.slice(-6)}</td>
                  <td>{getUserName(order.userId)}</td>
                  <td>
                    ${(order.totalAmount || order.amount || 0).toFixed(2)}
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor:
                          order.status === 'Delivered'
                            ? '#d4edda'
                            : order.status === 'Pending' ||
                              order.status === 'Processing'
                            ? '#fff3cd'
                            : order.status === 'Cancelled' ||
                              order.status === 'Returned'
                            ? '#f8d7da'
                            : '#d1ecf1',
                        color:
                          order.status === 'Delivered'
                            ? '#155724'
                            : order.status === 'Pending' ||
                              order.status === 'Processing'
                            ? '#856404'
                            : order.status === 'Cancelled' ||
                              order.status === 'Returned'
                            ? '#721c24'
                            : '#0c5460',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.paymentMethod || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(order)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(order._id)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
