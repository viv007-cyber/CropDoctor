export interface User {
  id: string;
  name: string;
  email: string;
  farmName: string;
  location: string;
  farmSize: number;
  avatar?: string;
}

export interface Crop {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  expectedHarvest: string;
  fieldLocation: string;
  fieldSize: number;
  currentStage: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastUpdate: string;
  images: string[];
  notes: string;
}

export interface DiseaseDetection {
  id: string;
  cropName: string;
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  preventiveMeasures: string[];
  imageUrl: string;
  detectedAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  suggestions?: string[];
}

export interface Alert {
  id: string;
  type: 'weather' | 'disease' | 'harvest' | 'maintenance' | 'market';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
}