import React, { createContext, useContext, useState } from 'react';
import { Crop, DiseaseDetection, ChatMessage, Alert } from '../types';

interface AppContextType {
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  detections: DiseaseDetection[];
  addDetection: (detection: Omit<DiseaseDetection, 'id'>) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id'>) => void;
  alerts: Alert[];
  markAlertAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Corn Field A',
    type: 'Corn',
    plantingDate: '2024-04-15',
    expectedHarvest: '2024-09-15',
    fieldLocation: 'North Field',
    fieldSize: 50,
    currentStage: 'Flowering',
    healthStatus: 'good',
    lastUpdate: '2024-12-20',
    images: ['https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400'],
    notes: 'Growth progressing well, adequate moisture levels'
  },
  {
    id: '2',
    name: 'Wheat Field B',
    type: 'Wheat',
    plantingDate: '2024-03-20',
    expectedHarvest: '2024-08-10',
    fieldLocation: 'South Field',
    fieldSize: 75,
    currentStage: 'Grain Filling',
    healthStatus: 'excellent',
    lastUpdate: '2024-12-18',
    images: ['https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=400'],
    notes: 'Exceptional growth this season'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'weather',
    title: 'Rain Expected',
    message: 'Heavy rain forecasted for tomorrow. Consider postponing irrigation.',
    priority: 'medium',
    timestamp: '2024-12-20T08:00:00Z',
    read: false
  },
  {
    id: '2',
    type: 'harvest',
    title: 'Harvest Ready',
    message: 'Wheat Field B is ready for harvest within the next week.',
    priority: 'high',
    timestamp: '2024-12-19T14:30:00Z',
    read: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useState<Crop[]>(mockCrops);
  const [detections, setDetections] = useState<DiseaseDetection[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const addCrop = (crop: Omit<Crop, 'id'>) => {
    const newCrop: Crop = {
      ...crop,
      id: Date.now().toString(),
    };
    setCrops(prev => [...prev, newCrop]);
  };

  const updateCrop = (id: string, cropUpdate: Partial<Crop>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === id ? { ...crop, ...cropUpdate } : crop
    ));
  };

  const deleteCrop = (id: string) => {
    setCrops(prev => prev.filter(crop => crop.id !== id));
  };

  const addDetection = (detection: Omit<DiseaseDetection, 'id'>) => {
    const newDetection: DiseaseDetection = {
      ...detection,
      id: Date.now().toString(),
    };
    setDetections(prev => [...prev, newDetection]);
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  return (
    <AppContext.Provider value={{
      crops,
      addCrop,
      updateCrop,
      deleteCrop,
      detections,
      addDetection,
      chatMessages,
      addChatMessage,
      alerts,
      markAlertAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};