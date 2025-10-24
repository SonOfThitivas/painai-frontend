// Component/user_profile.tsx
"use client"

import React, { useState, useEffect } from 'react';

// Interfaces
interface User {
  data: {
    ID: number;
    Username: string;
    Name: string;
    Sex: string;
    Age: number;
    HashPass: string;
    Email: string;
    ImagePath: string;
  }
}

interface AuthResponse {
  user: {
    email: string;
    name: string;
  }
}

// CSS styles as a template literal
const styles = `
.user-profile {
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08);
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
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px 24px 0 0;
}

.profile-header {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 2;
}

.profile-image-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.profile-image {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  transition: all 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-username {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.profile-details {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
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

.refresh-button,
.retry-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.refresh-button::before,
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

.refresh-button:hover::before,
.retry-button:hover::before {
  left: 100%;
}

.refresh-button:hover,
.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.refresh-button:active,
.retry-button:active {
  transform: translateY(0);
}

.user-profile.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
}

.spinner {
  width: 60px;
  height: 60px;
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

.user-profile.error {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 24px;
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

.retry-button {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.retry-button:hover {
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Stats section */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
}

/* Badge for sex */
.sex-badge {
  background: rgba(139, 92, 246, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

/* Email with copy functionality */
.email-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.copy-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

@media (max-width: 480px) {
  .user-profile {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .profile-image {
    width: 120px;
    height: 120px;
  }
  
  .profile-name {
    font-size: 1.75rem;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-value {
    text-align: left;
  }
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.profile-image {
  animation: float 6s ease-in-out infinite;
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
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const authResponse = await fetch('http://localhost:8000/v1/api/auth/auth/callback', {
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
      const userEmail = authData.user.email;

      if (!userEmail) {
        throw new Error('No email found in auth response');
      }

      const userResponse = await fetch(`http://localhost:8000/v1/api/user/email/${encodeURIComponent(userEmail)}`, {
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
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (imagePath: string): string => {
    return imagePath && imagePath.trim() !== '' ? imagePath : '/BALDING.png';
  };

  const formatSex = (sex: string): string => {
    return sex.charAt(0).toUpperCase() + sex.slice(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

  if (error) {
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
              src={getImageSrc(user.data.ImagePath)}
              alt={`${user.data.Name}'s profile`}
              className="profile-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/BALDING.png';
              }}
            />
          </div>
          <h1 className="profile-name">{user.data.Name}</h1>
          <p className="profile-username">@{user.data.Username}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{user.data.Age}</span>
            <span className="stat-label">Age</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{user.data.ID}</span>
            <span className="stat-label">ID</span>
          </div>
          <div className="stat-item">
            <span className="stat-value sex-badge">{formatSex(user.data.Sex)}</span>
            <span className="stat-label">Gender</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Email Address</span>
            <div className="email-container">
              <span className="detail-value">{user.data.Email}</span>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(user.data.Email)}
                title="Copy email"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Username</span>
            <span className="detail-value">@{user.data.Username}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.data.Name}</span>
          </div>
        </div>

        <button onClick={fetchUserProfile} className="refresh-button">
          🔄 Refresh Profile
        </button>
      </div>
    </>
  );
};

export default UserProfile;