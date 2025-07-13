import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, FileText } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-green-50 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-600 hover:text-green-600'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/disease-detection"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-600 hover:text-green-600'
              }`
            }
          >
            <Camera className="h-4 w-4" />
            <span>Disease Detection</span>
          </NavLink>

          <NavLink
            to="/crop-records"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-600 hover:text-green-600'
              }`
            }
          >
            <FileText className="h-4 w-4" />
            <span>Crop Records</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};