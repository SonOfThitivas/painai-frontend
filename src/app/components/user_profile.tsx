// Component/user_profile.tsx
"use client"

import React, { useState, useEffect } from 'react';

// Interfaces
interface User {
  ID: string;
  Email: string;
  PasswordHash: string;
  DisplayName: string;
  AvatarURL: string;
  AvatarData: string; // Base64 encoded image data
  Bio: string;
  CreatedAt: string;
  UpdatedAt: string;
  Sex: string;
  Age: number;
}

interface AuthResponse {
  user: {
    email: string;
    name: string;
  };
}

// CSS styles as a template literal
const styles = `
.user-profile {
  max-width: 440px;
  margin: 2rem auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: white;
  position: relative;
  overflow: hidden;
}

.user-profile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px 20px 0 0;
}

.profile-header {
  text-align: center;
  padding: 2rem 2rem 1.5rem;
  position: relative;
  z-index: 2;
}

.profile-image-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  transition: all 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.5);
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-bio {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.profile-details {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 0 1.5rem 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  margin: 0 -0.5rem;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.detail-value {
  font-weight: 500;
  color: white;
  text-align: right;
}

.sex-badge {
  background: rgba(139, 92, 246, 0.3);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

.age-badge {
  background: rgba(16, 185, 129, 0.3);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.profile-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.retry-button,
.edit-button,
.save-button,
.cancel-button {
  width: 100%;
  padding: 1rem 2rem;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.edit-button {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.save-button {
  background: linear-gradient(45deg, #10b981, #059669);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.cancel-button {
  background: linear-gradient(45deg, #6b7280, #4b5563);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.retry-button {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.edit-button::before,
.save-button::before,
.cancel-button::before,
.retry-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.edit-button:hover::before,
.save-button:hover::before,
.cancel-button:hover::before,
.retry-button:hover::before {
  left: 100%;
}

.edit-button:hover,
.save-button:hover,
.cancel-button:hover,
.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.edit-button:active,
.save-button:active,
.cancel-button:active,
.retry-button:active {
  transform: translateY(0);
}

/* Image Upload Button */
.image-upload-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
}

.image-upload-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.05);
}

.image-upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form Styles */
.edit-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin: 0 1.5rem 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  flex: 1;
}

/* Loading State */
.user-profile.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.user-profile.loading p {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* Error State */
.user-profile.error {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20px;
}

.user-profile.error h2 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.user-profile.error p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.profile-image {
  animation: float 6s ease-in-out infinite;
}

/* Stats Section */
.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Success Message */
.success-message {
  background: rgba(16, 185, 129, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 1.5rem;
  text-align: center;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .user-profile {
    margin: 1rem;
    border-radius: 16px;
  }
  
  .profile-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .profile-details {
    margin: 0 1rem 1rem;
    padding: 1rem;
  }
  
  .profile-stats {
    padding: 0 1rem;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .profile-actions {
    padding: 0 1rem 1rem;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-value {
    text-align: left;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .image-upload-button {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
}
`;

// Component that injects CSS styles
const StyleInjector: React.FC = () => {
  useEffect(() => {
    if (!document.getElementById('user-profile-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'user-profile-styles';
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }, []);

  return null;
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    sex: '',
    age: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      console.log("Uploading image for email:", user.Email);
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Use FormData with both image file and email
      const formData = new FormData();
      formData.append('image', file); // File field
      formData.append('email', user.Email); // Email field

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key} =`, value);
      }

      const response = await fetch('http://localhost:8000/api/v1/user/UpdateAvartarData', {
        method: 'PUT',
        credentials: 'include',
        body: formData, // Don't set Content-Type header, let browser set it with boundary
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Upload response:", responseData);
      
      // Update local state with the new avatar data
      if (responseData.avatar_data || responseData.AvatarData) {
        const newAvatarData = responseData.avatar_data || responseData.AvatarData;
        setUser(prev => prev ? { ...prev, AvatarData: newAvatarData } : prev);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (responseData.user) {
        // If response has full user object
        setUser(responseData.user);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // If API doesn't return the data, refetch the user profile
        await fetchUserProfile();
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch email from auth API
      const authResponse = await fetch('http://localhost:8000/api/v1/auth/auth/callback', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.ok) {
        throw new Error(`Auth API error: ${authResponse.status}`);
      }

      const authData: AuthResponse = await authResponse.json();
      const userEmail = authData.user?.email;

      if (!userEmail) {
        throw new Error('No email found in auth response');
      }

      // Step 2: Fetch user details using the email
      const userResponse = await fetch(`http://localhost:8000/api/v1/user/email/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(`User API error: ${userResponse.status}`);
      }

      const userData: User = await userResponse.json();
      setUser(userData);
      
      // Initialize form data
      setFormData({
        displayName: userData.DisplayName || '',
        bio: userData.Bio || '',
        sex: userData.Sex || '',
        age: userData.Age?.toString() || ''
      });

    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (user) {
      setFormData({
        displayName: user.DisplayName || '',
        bio: user.Bio || '',
        sex: user.Sex || '',
        age: user.Age?.toString() || ''
      });
    }
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        email: user.Email,
        display_name: formData.displayName || null,
        bio: formData.bio || null,
        sex: formData.sex || null,
        age: formData.age ? parseInt(formData.age) : null
      };
      
      console.log("Sending update data:", updateData);

      const response = await fetch('http://localhost:8000/api/v1/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Full API response:", responseData);
      
      // Check what structure we're getting back
      if (responseData.user) {
        // If response has nested user object
        setUser(responseData.user);
      } else if (responseData.ID || responseData.id) {
        // If response is the user object directly
        setUser(responseData);
      } else {
        console.warn("Unexpected response structure:", responseData);
        // If API doesn't return user data, refetch it
        await fetchUserProfile();
      }
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getImageSrc = (avatarData: string): string => {
    if (avatarData && avatarData.trim() !== '') {
      // Check if it already has data URL prefix
      if (avatarData.startsWith('data:image/')) {
        return avatarData;
      }
      // Assume it's base64 data and add the prefix
      return `data:image/jpeg;base64,${avatarData}`;
    }
    return '/BALDING.png';
  };

  const formatSex = (sex: string): string => {
    if (!sex) return 'Not specified';
    return sex.charAt(0).toUpperCase() + sex.slice(1);
  };

  const formatBio = (bio: string): string => {
    if (!bio || bio === 'Text your bio here.') {
      return 'No bio yet. Share something about yourself!';
    }
    return bio;
  };

  if (loading) {
    return (
      <>
        <StyleInjector />
        <div className="user-profile loading">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </>
    );
  }

  if (error && !user) {
    return (
      <>
        <StyleInjector />
        <div className="user-profile error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchUserProfile} className="retry-button">
            Try Again
          </button>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <StyleInjector />
        <div className="user-profile error">
          <h2>No Profile Found</h2>
          <p>Unable to load user profile data.</p>
          <button onClick={fetchUserProfile} className="retry-button">
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <StyleInjector />
      <div className="user-profile">
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={getImageSrc(user.AvatarData)}
              alt={`${user.DisplayName}'s profile`}
              className="profile-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/BALDING.png';
              }}
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              className="image-upload-button"
              onClick={handleImageClick}
              disabled={uploading}
            >
              {uploading ? '📤 Uploading...' : '📷 Change'}
            </button>
          </div>
          <h1 className="profile-name">{user.DisplayName}</h1>
          <p className="profile-bio">{formatBio(user.Bio)}</p>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="user-profile error" style={{ margin: '1rem 1.5rem', padding: '1rem' }}>
            <p>{error}</p>
          </div>
        )}

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your display name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Tell us something about yourself..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div className="form-actions">
              <button 
                onClick={handleSave} 
                className="save-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                onClick={handleCancel} 
                className="cancel-button"
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{user.Age}</span>
                <span className="stat-label">Age</span>
              </div>
              <div className="stat-item">
                <span className="stat-value sex-badge">{formatSex(user.Sex)}</span>
                <span className="stat-label">Gender</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Display Name</span>
                <span className="detail-value">{user.DisplayName}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Gender</span>
                <span className="detail-value sex-badge">{formatSex(user.Sex)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Age</span>
                <span className="detail-value age-badge">{user.Age} years old</span>
              </div>
            </div>
          </>
        )}

        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button">
              ✏️ Edit Profile
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default UserProfile;