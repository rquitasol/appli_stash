import React from 'react';

type User = {
  email: string;
  name: string;
  token: string;
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Base URL for the Next.js API
const API_BASE_URL = 'http://localhost:3000'; // Change to your actual Next.js app URL

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const openDashboard = () => {
    window.open(`${API_BASE_URL}/dashboard`, '_blank');
  };
  
  return (
    <div className="dashboard-container">
      <h2>AppliStash</h2>
      <div className="dashboard-header">
        <h3>Welcome, {user.name}!</h3>
        <p className="email-display">Logged in as: {user.email}</p>
      </div>
      
      <div className="dashboard-message">
        For the full AppliStash experience, please use the web dashboard.
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button" onClick={openDashboard}>Open Dashboard</button>
            <button className="action-button">Add Application</button>
            <button className="action-button">View Stats</button>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p className="empty-state">No recent activity to display</p>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <button className="logout-button" onClick={onLogout}>Sign Out</button>
        <button className="settings-button">Settings</button>
      </div>
    </div>
  );
};

export default Dashboard;
