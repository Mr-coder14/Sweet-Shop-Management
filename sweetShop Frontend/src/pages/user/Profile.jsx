import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '..//../components/Navbar';
import './Profile.css';

const Profile = () => {
  const { auth, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, [auth]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token || !auth?.user?.email) {
        setError('No authentication found');
        setLoading(false);
        return;
      }

      // Get all users and find the current user by email
      const response = await fetch('http://localhost:8081/api/auth/get', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const users = await response.json();
      const currentUser = users.find(u => u.email === auth.user.email);

      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.username || '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError('User not found');
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMessage('');

    // Validate password match if password is being changed
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setUpdateMessage('Error: Passwords do not match!');
        return;
      }
      if (formData.password.length < 6) {
        setUpdateMessage('Error: Password must be at least 6 characters long!');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      
      // Build update data - preserve all existing fields
      const updateData = {
        id: user.id,
        email: user.email, // Email cannot be changed
        role: user.role,
        enabled: user.enabled,
        _class: user._class
      };

      // Only update username if it has changed
      if (formData.name && formData.name.trim() !== '' && formData.name !== user.username) {
        updateData.username = formData.name.trim();
      } else if (user.username) {
        updateData.username = user.username; // Keep existing username
      }

      // Only include password if it's been changed
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const response = await fetch('http://localhost:8081/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setUpdateMessage('Profile updated successfully!');
      setIsEditing(false);
      setFormData({
        name: updatedUser.username || '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err) {
      setUpdateMessage(`Error: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.username || '',
      password: '',
      confirmPassword: ''
    });
    setUpdateMessage('');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-container">
          <div className="error-message">
            <p>User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <h1>{user.username || 'User'}</h1>
            <p className="profile-role">{user.role}</p>
          </div>

          {updateMessage && (
            <div className={`message ${updateMessage.includes('Error') ? 'error' : 'success'}`}>
              {updateMessage}
            </div>
          )}

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-group">
                <label>Username</label>
                <p>{user.username || 'Not set'}</p>
              </div>

              <div className="detail-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>

              <div className="detail-group">
                <label>Account Status</label>
                <p className={user.enabled ? 'status-active' : 'status-inactive'}>
                  {user.enabled ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="detail-group">
                <label>Last Updated</label>
                <p>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>

              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Cannot be changed)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleUpdateProfile}>
                  Save Changes
                </button>
                <button className="btn-cancel" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;