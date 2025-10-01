import React, { useState, useEffect } from 'react';
import { LoginForm } from '@applistash/shared';
import Dashboard from './Dashboard';
import './Popup.css';
import { User } from '../content/overlay';
import { API_BASE_URL } from '../config/api';

// API Base URL
console.log('Popup: Using API base URL:', API_BASE_URL);
const Popup: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fetch user data from the Next.js API
  const fetchUserData = async () => {
    setLoadingDashboard(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // Update user state with fetched data
      const user: User = {
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        token: userData.token || '', // Store token if available
      };

      // Store the user data in Chrome storage
      chrome.storage.local.set({ user }, () => {
        setUser(user);
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If we can't fetch user data, clear any stored user
      chrome.storage.local.remove(['user']);
      setUser(null);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in when component mounts
    chrome.storage.local.get(['user'], (result) => {
      if (result.user) {
        setUser(result.user as User);
        // Verify the user is still authenticated by fetching fresh data
        fetchUserData();
      }
    });
  }, []);

  // Handle the login form submission
  const handleLoginSubmit = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      // Call the Next.js API to authenticate
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return { success: false, error: data.error || 'Login failed' };
      }

      // Extract token from the Authorization header if present
      let token = '';
      // Check if the token is in the response headers
      const authHeader = response.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      } else if (data.token) {
        // Alternatively, check if token is in the response body
        token = data.token;
      }

      // After successful login, store user data and redirect to dashboard website
      const user: User = {
        email: data.user.email,
        name: data.user.name || email.split('@')[0],
        token: token,
      };

      console.log('Token received:', token ? 'Yes (length: ' + token.length + ')' : 'No');

      // Store the user data in Chrome storage
      chrome.storage.local.set({ user }, () => {
        // Open the dashboard in a new tab
        window.open(`${API_BASE_URL}/dashboard`, '_blank');
        // Also update local state so the popup shows the user is logged in
        setUser(user);
        setLoading(false);
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const handleLogout = async () => {
    try {
      // Call the signout API to invalidate the session
      await fetch(`${API_BASE_URL}/api/signout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove user from Chrome storage regardless of API success
      chrome.storage.local.remove(['user'], () => {
        setUser(null);
      });
    }
  };

  if (loadingDashboard) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h2>AppliStash</h2>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="app-container">
        <Dashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="login-container">
        <h2>AppliStash</h2>
        <LoginForm
          onSubmit={handleLoginSubmit}
          apiEndpoint={null} // Using our custom submit handler above instead
          isExtension={false} // Set to false to allow redirection
          redirectUrl={`${API_BASE_URL}/dashboard`}
        />
        {error && <div className="error">{error}</div>}
        <div className="register-link">
          Not signed in?{' '}
          <a href="#" onClick={() => window.open(`${API_BASE_URL}/register`, '_blank')}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Popup;
