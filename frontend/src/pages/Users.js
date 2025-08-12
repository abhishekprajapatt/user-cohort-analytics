import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationDate: '',
    segment: 'new',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      console.log('Users API response:', response);

      // Handle the response structure - it could be nested or direct
      const usersData = response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.update(editingUser._id, formData);
        toast.success('User updated successfully');
      } else {
        await usersAPI.create(formData);
        toast.success('User created successfully');
      }

      setShowForm(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        registrationDate: '',
        segment: 'new',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      registrationDate: user.registrationDate?.split('T')[0] || '',
      segment: user.segment || 'new',
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', registrationDate: '', segment: 'new' });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
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
        <h1>Users Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.registrationDate}
                onChange={(e) =>
                  setFormData({ ...formData, registrationDate: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Segment</label>
              <select
                className="form-control"
                value={formData.segment}
                onChange={(e) =>
                  setFormData({ ...formData, segment: e.target.value })
                }
              >
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="returning">Returning</option>
                <option value="churned">Churned</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                {editingUser ? 'Update' : 'Create'}
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
        <h3>Users List ({users.length})</h3>
        {users.length === 0 ? (
          <p>No users found. Create your first user!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Segment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        backgroundColor:
                          user.segment === 'active'
                            ? '#d4edda'
                            : user.segment === 'returning'
                            ? '#d1ecf1'
                            : user.segment === 'churned'
                            ? '#f8d7da'
                            : '#fff3cd',
                        color:
                          user.segment === 'active'
                            ? '#155724'
                            : user.segment === 'returning'
                            ? '#0c5460'
                            : user.segment === 'churned'
                            ? '#721c24'
                            : '#856404',
                      }}
                    >
                      {user.segment}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(user)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDelete(user._id)}
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

export default Users;
