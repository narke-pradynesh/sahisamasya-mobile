import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../Layout.jsx'
import HomePage from '../pages/Home.jsx'
import ReportIssuePage from '../pages/ReportIssue.jsx'
import AdminDashboardPage from '../pages/AdminDashboard.jsx'
import { seedDemoData } from './utils/seedDemoData.js'
import { User } from './entities/User.js'

function App() {
  // Seed demo data on app start to ensure fast loading
  React.useEffect(() => {
    try {
      // Only seed demo data if not authenticated
      if (!User.isAuthenticated()) {
        seedDemoData();
      }
    } catch (error) {
      console.error('Error in App useEffect:', error);
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/report-issue" element={<ReportIssuePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
