import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Sprout, Mail, Lock, User, MapPin, Ruler } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { user, login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    farmName: '',
    location: '',
    farmSize: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password');
        }
      } else {
        if (!formData.name || !formData.farmName || !formData.location || !formData.farmSize) {
          setError('Please fill in all fields');
          setIsSubmitting(false);
          return;
        }
        
        success = await register({
          ...formData,
          farmSize: parseInt(formData.farmSize)
        });
        
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-green-600 rounded-full">
              <Sprout className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">AgriSmart</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your farm dashboard' : 'Create your farm account'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    icon={<User className="h-4 w-4 text-gray-400" />}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Farm Name"
                    name="farmName"
                    type="text"
                    required
                    value={formData.farmName}
                    onChange={handleChange}
                    icon={<Sprout className="h-4 w-4 text-gray-400" />}
                    placeholder="Enter your farm name"
                  />
                  <Input
                    label="Location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    icon={<MapPin className="h-4 w-4 text-gray-400" />}
                    placeholder="City, State/Country"
                  />
                  <Input
                    label="Farm Size (acres)"
                    name="farmSize"
                    type="number"
                    required
                    value={formData.farmSize}
                    onChange={handleChange}
                    icon={<Ruler className="h-4 w-4 text-gray-400" />}
                    placeholder="Enter farm size in acres"
                  />
                </>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4 text-gray-400" />}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="h-4 w-4 text-gray-400" />}
                placeholder="Enter your password"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {isLogin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-600">
                    Demo credentials: john@farm.com / password
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting || loading}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-green-600 hover:text-green-500 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};