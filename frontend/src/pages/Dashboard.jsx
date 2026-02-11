import React from 'react';
import { useQuery } from 'react-query';
import { dashboardService } from '../services/api';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Droplet,
  Wrench
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { data: overview, isLoading } = useQuery(
    'dashboard-overview',
    () => dashboardService.getOverview(),
    { refetchInterval: 60000 }
  );

  const { data: complaintAnalytics } = useQuery(
    'complaint-analytics',
    () => dashboardService.getComplaintAnalytics(30)
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Complaints',
      value: overview?.data?.complaints?.total || 0,
      change: '+12%',
      icon: AlertCircle,
      color: 'blue',
      trend: 'up'
    },
    {
      name: 'Pending Resolution',
      value: overview?.data?.complaints?.pending || 0,
      change: '-5%',
      icon: Clock,
      color: 'yellow',
      trend: 'down'
    },
    {
      name: 'Resolved',
      value: overview?.data?.complaints?.resolved || 0,
      change: '+8%',
      icon: CheckCircle,
      color: 'green',
      trend: 'up'
    },
    {
      name: 'Operational Assets',
      value: overview?.data?.assets?.operational || 0,
      change: `${overview?.data?.assets?.operationalPercentage}%`,
      icon: Package,
      color: 'purple',
      trend: 'up'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.trend === 'up' ? (
                  <TrendingUp className="text-green-600 mr-1" size={16} />
                ) : (
                  <TrendingDown className="text-red-600 mr-1" size={16} />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="text-gray-600 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Status Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={complaintAnalytics?.data?.analytics?.byStatus || []}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {(complaintAnalytics?.data?.analytics?.byStatus || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Daily Complaint Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complaintAnalytics?.data?.analytics?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Complaint Type Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Complaint Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(complaintAnalytics?.data?.analytics?.byType || []).slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Water Production Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Droplet className="text-blue-600" />
            Water Production (Last 7 Days)
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Production</span>
              <span className="text-2xl font-bold text-blue-600">
                {(overview?.data?.waterProduction?.totalLast7Days || 0).toLocaleString()} m³
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={overview?.data?.waterProduction?.recentRecords || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="productionDate" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="production.volumeProduced" fill="#3b82f6" name="Volume (m³)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview?.data?.complaints?.resolutionRate || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(overview?.data?.complaints?.avgResponseTime || 0)} hrs
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Wrench className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Under Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview?.data?.assets?.underMaintenance || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
