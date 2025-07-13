import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Bell
} from 'lucide-react';

export const CropRecordsPage: React.FC = () => {
  const { crops, addCrop, updateCrop, deleteCrop, alerts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plantingDate: '',
    expectedHarvest: '',
    fieldLocation: '',
    fieldSize: '',
    currentStage: '',
    healthStatus: 'good' as const,
    notes: ''
  });

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cropData = {
      ...formData,
      fieldSize: parseInt(formData.fieldSize),
      lastUpdate: new Date().toISOString(),
      images: []
    };

    addCrop(cropData);
    setShowAddForm(false);
    setFormData({
      name: '',
      type: '',
      plantingDate: '',
      expectedHarvest: '',
      fieldLocation: '',
      fieldSize: '',
      currentStage: '',
      healthStatus: 'good',
      notes: ''
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-green-100 text-green-700';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRAGRecommendations = (crop: any) => {
    const recommendations = [];
    
    if (crop.healthStatus === 'fair' || crop.healthStatus === 'poor') {
      recommendations.push('Consider soil testing and nutrient analysis');
      recommendations.push('Increase monitoring frequency');
    }
    
    if (crop.currentStage === 'Flowering') {
      recommendations.push('Ensure adequate water supply during flowering');
      recommendations.push('Monitor for pest activity');
    }
    
    const plantingDate = new Date(crop.plantingDate);
    const daysSincePlanting = Math.floor((Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSincePlanting > 90) {
      recommendations.push('Begin harvest preparation');
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Crop Records Management</h1>
        <p className="text-emerald-100">Track, monitor, and manage your crop lifecycle with AI-powered insights</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 max-w-md space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      {/* Add Crop Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Add New Crop</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Crop Name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Corn Field A"
              />
              
              <Input
                label="Crop Type"
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="e.g., Corn, Wheat, Soybeans"
              />
              
              <Input
                label="Planting Date"
                type="date"
                required
                value={formData.plantingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, plantingDate: e.target.value }))}
              />
              
              <Input
                label="Expected Harvest"
                type="date"
                required
                value={formData.expectedHarvest}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedHarvest: e.target.value }))}
              />
              
              <Input
                label="Field Location"
                required
                value={formData.fieldLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, fieldLocation: e.target.value }))}
                placeholder="e.g., North Field, Section A"
              />
              
              <Input
                label="Field Size (acres)"
                type="number"
                required
                value={formData.fieldSize}
                onChange={(e) => setFormData(prev => ({ ...prev, fieldSize: e.target.value }))}
                placeholder="50"
              />
              
              <Input
                label="Current Stage"
                required
                value={formData.currentStage}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStage: e.target.value }))}
                placeholder="e.g., Seedling, Flowering, Maturation"
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Health Status</label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value as any }))}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Additional notes about this crop..."
                />
              </div>
              
              <div className="md:col-span-2 flex space-x-3">
                <Button type="submit">Add Crop</Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Crop List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} hover>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                    <p className="text-sm text-gray-600">{crop.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getHealthStatusColor(crop.healthStatus)}`}>
                    {crop.healthStatus}
                  </span>
                </div>

                {/* Image */}
                {crop.images.length > 0 && (
                  <img
                    src={crop.images[0]}
                    alt={crop.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{crop.fieldLocation} • {crop.fieldSize} acres</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Planted: {new Date(crop.plantingDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Stage: {crop.currentStage}</span>
                  </div>
                </div>

                {/* RAG Recommendations */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-1">
                    {getRAGRecommendations(crop).slice(0, 2).map((rec, index) => (
                      <p key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-1">•</span>
                        {rec}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => setSelectedCrop(selectedCrop === crop.id ? null : crop.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {selectedCrop === crop.id ? 'Hide' : 'View'}
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => deleteCrop(crop.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Expanded Details */}
                {selectedCrop === crop.id && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Expected Harvest</h5>
                      <p className="text-sm text-gray-600">{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Last Update</h5>
                      <p className="text-sm text-gray-600">{new Date(crop.lastUpdate).toLocaleDateString()}</p>
                    </div>
                    
                    {crop.notes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Notes</h5>
                        <p className="text-sm text-gray-600">{crop.notes}</p>
                      </div>
                    )}

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Complete AI Analysis</h5>
                      <div className="space-y-1">
                        {getRAGRecommendations(crop).map((rec, index) => (
                          <p key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="text-blue-600 mr-1">•</span>
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">Active Alerts & Notifications</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`
                  flex items-start space-x-3 p-4 rounded-lg border-l-4
                  ${alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                    alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'}
                `}>
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.priority === 'high' ? 'text-red-600' :
                    alert.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};