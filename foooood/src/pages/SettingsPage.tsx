import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProfileForm from '../components/Settings/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, Bell, Lock, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-600">
              Update your profile and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 text-primary-600 rounded-full h-12 w-12 flex items-center justify-center">
                      <span className="font-bold text-lg">
                        {user?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                <nav className="p-2">
                  <a href="#profile" className="flex items-center space-x-3 p-3 rounded-lg bg-primary-50 text-primary-600">
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <CreditCard size={20} />
                    <span>Payment Methods</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Bell size={20} />
                    <span>Notifications</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Lock size={20} />
                    <span>Security</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Update your personal details and address
                  </p>
                </div>
                
                <div className="p-6">
                  <ProfileForm />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md mt-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Order History</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    View your previous orders
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <a
                      href="/menu"
                      className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Browse Menu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;