import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Auth
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

// Layout
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';
import CreateComplaint from './pages/CreateComplaint';
import MeterReadings from './pages/MeterReadings';
import CreateMeterReading from './pages/CreateMeterReading';
import Assets from './pages/Assets';
import AssetDetails from './pages/AssetDetails';
import Maintenance from './pages/Maintenance';
import WaterProduction from './pages/WaterProduction';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Profile from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Complaints */}
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/new" element={<CreateComplaint />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
            
            {/* Meter Readings */}
            <Route path="meter-readings" element={<MeterReadings />} />
            <Route path="meter-readings/new" element={<CreateMeterReading />} />
            
            {/* Assets */}
            <Route path="assets" element={<Assets />} />
            <Route path="assets/:id" element={<AssetDetails />} />
            
            {/* Maintenance */}
            <Route path="maintenance" element={<Maintenance />} />
            
            {/* Water Production */}
            <Route path="water-production" element={<WaterProduction />} />
            
            {/* Tasks */}
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskDetails />} />
            
            {/* Reports */}
            <Route path="reports" element={<Reports />} />
            
            {/* Users */}
            <Route path="users" element={<Users />} />
            
            {/* Profile */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
