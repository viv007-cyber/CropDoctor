import React from 'react';
import { useApp } from '../contexts/AppContext';
import { ChatBot } from '../components/chat/ChatBot';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Camera, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  Droplets, 
  Thermometer,
  Sun,
  Wind,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { crops, alerts } = useApp();
  
  const healthyCrops = crops.filter(crop => crop.healthStatus === 'excellent' || crop.healthStatus === 'good').length;
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  const weatherData = {
    temperature: 72,
    humidity: 65,
    windSpeed: 8,
    condition: 'Partly Cloudy'
  };

  const quickStats = [
    { label: 'Active Crops', value: crops.length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Healthy Fields', value: healthyCrops, icon: Sun, color: 'text-yellow-600' },
    { label: 'Pending Alerts', value: unreadAlerts, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Days to Harvest', value: 45, icon: Calendar, color: 'text-blue-600' },
  ];

  const recentActivities = [
    { action: 'Disease detected in Corn Field A', time: '2 hours ago', type: 'alert' },
    { action: 'Irrigation scheduled for tomorrow', time: '4 hours ago', type: 'info' },
    { action: 'Wheat Field B ready for harvest', time: '1 day ago', type: 'success' },
    { action: 'Fertilizer application completed', time: '2 days ago', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to your Farm Dashboard</h1>
        <p className="text-green-100">Monitor your crops, detect diseases, and get AI-powered farming insights</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Disease Detection</h3>
                <p className="text-gray-600">Upload crop photos for AI-powered health analysis</p>
              </div>
              <Link to="/disease-detection">
                <Button>Scan Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <ChatBot />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sun className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{weatherData.temperature}°F</p>
                    <p className="text-sm text-gray-600">{weatherData.condition}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{weatherData.humidity}% Humidity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{weatherData.windSpeed} mph Wind</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <span className="text-sm text-gray-500">{unreadAlerts} new</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.priority === 'high' ? 'text-red-500' : 
                    alert.priority === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Crop Overview</h3>
            <Link to="/crop-records">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.slice(0, 3).map((crop) => (
              <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{crop.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    crop.healthStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                    crop.healthStatus === 'good' ? 'bg-green-100 text-green-700' :
                    crop.healthStatus === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {crop.healthStatus}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">{crop.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stage:</span>
                    <span className="text-gray-900">{crop.currentStage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="text-gray-900">{crop.fieldSize} acres</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};