import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Bell, User, LogOut, Sprout } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts } = useApp();
  
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  return (
    <header className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AgriSmart</h1>
              <p className="text-sm text-gray-600">Smart Farm Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="p-1 bg-gray-200 rounded-full">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.farmName}</p>
                </div>
              </div>

              <button 
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};