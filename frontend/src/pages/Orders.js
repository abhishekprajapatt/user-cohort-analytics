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
    status: 'completed',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, usersResponse] = await Promise.all([
        ordersAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setOrders(ordersResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        amount: parseFloat(formData.amount),
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
        status: 'completed',
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
      amount: order.amount.toString(),
      orderDate: order.orderDate?.split('T')[0] || '',
      status: order.status || 'completed',
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
    setFormData({ userId: '', amount: '', orderDate: '', status: 'completed' });
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
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6)}</td>
                  <td>{getUserName(order.userId)}</td>
                  <td>${order.amount.toFixed(2)}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor:
                          order.status === 'completed'
                            ? '#d4edda'
                            : order.status === 'pending'
                            ? '#fff3cd'
                            : order.status === 'cancelled'
                            ? '#f8d7da'
                            : '#d1ecf1',
                        color:
                          order.status === 'completed'
                            ? '#155724'
                            : order.status === 'pending'
                            ? '#856404'
                            : order.status === 'cancelled'
                            ? '#721c24'
                            : '#0c5460',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
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
