import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { Droplet, Loader } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try to login with backend
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // If backend is not running, use demo mode
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        toast.error('Backend server not running! Using demo mode.');
        
        // Demo login - works without backend
        if (formData.email === 'admin@waterutility.com' && formData.password === 'admin123') {
          // Manually set authentication state
          useAuthStore.setState({
            user: {
              id: 'demo-user-1',
              firstName: 'Admin',
              lastName: 'User',
              fullName: 'Admin User',
              email: 'admin@waterutility.com',
              role: 'admin',
              employeeId: 'EMP001',
              department: 'Administration'
            },
            token: 'demo-token-12345',
            isAuthenticated: true
          });
          
          toast.success('Demo login successful!');
          navigate('/dashboard');
        } else {
          toast.error('Invalid credentials. Use: admin@waterutility.com / admin123');
        }
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Droplet className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Water Utility MIS
          </h1>
          <p className="text-gray-600">Management Information System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Admin: admin@waterutility.com / admin123</p>
          <p className="text-xs text-gray-500">Supervisor: supervisor@waterutility.com / super123</p>
          <p className="text-xs text-gray-500">Technician: tech@waterutility.com / tech123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;