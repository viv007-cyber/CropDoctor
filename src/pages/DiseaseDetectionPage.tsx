import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { diseaseDetectionService } from '../services/geminiService';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Upload, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Trash2,
  Download
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const { detections, addDetection } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [cropName, setCropName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert('Please select an image file');
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile || !cropName) {
      alert('Please select an image and enter crop name');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Use Gemini API for real disease detection
      const result = await diseaseDetectionService.analyzeImage(selectedFile, cropName);
      
      const detection = {
        cropName,
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        treatment: result.treatment,
        preventiveMeasures: result.preventiveMeasures,
        imageUrl: URL.createObjectURL(selectedFile),
        detectedAt: new Date().toISOString()
      };
      
      addDetection(detection);
      setAnalysisResult(result);
      setSelectedFile(null);
      setCropName('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">AI Disease Detection</h1>
        <p className="text-blue-100">Upload crop photos for instant health analysis and treatment recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Upload Crop Image</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Crop Name"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="e.g., Corn Field A, Wheat Section 2"
            />

            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${selectedFile ? 'border-green-400 bg-green-50' : ''}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected crop"
                    className="mx-auto max-h-48 rounded-lg object-cover"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 text-gray-400">
                    <Upload className="w-full h-full" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your crop image here
                    </p>
                    <p className="text-sm text-gray-600">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>JPG, PNG, WEBP</span>
                    <span>•</span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={analyzeImage}
              disabled={!selectedFile || !cropName || analyzing}
              loading={analyzing}
              className="w-full"
            >
              {analyzing ? 'Analyzing Image...' : 'Analyze for Diseases'}
            </Button>

            {analyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Gemini AI Analysis in Progress</p>
                    <p className="text-xs text-blue-700">Using advanced computer vision to analyze crop health...</p>
                  </div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Analysis Complete!</p>
                    <p className="text-xs text-green-700 mt-1">
                      {analysisResult.disease} detected with {analysisResult.confidence}% confidence
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Check the detection history below for detailed recommendations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Photography Tips</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">High-quality, focused images</p>
                  <p className="text-sm text-gray-600">Gemini AI works best with clear, detailed crop photos</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Good lighting</p>
                  <p className="text-sm text-gray-600">Take photos in natural daylight when possible</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Close-up shots</p>
                  <p className="text-sm text-gray-600">Include affected areas and surrounding healthy tissue</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Include affected areas</p>
                  <p className="text-sm text-gray-600">Show both healthy and problematic parts for accurate diagnosis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection History */}
      {detections.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Detection History</h2>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detections.map((detection) => (
                <div key={detection.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={detection.imageUrl}
                      alt={detection.cropName}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{detection.cropName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(detection.detectedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{detection.disease}</p>
                          <p className="text-sm text-gray-600">{detection.confidence}% confidence</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          detection.severity === 'low' ? 'bg-green-100 text-green-800' :
                          detection.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {detection.severity} severity
                        </span>
                        
                        {detection.disease === 'Healthy Crop' ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Healthy</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Needs attention</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Treatment</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {detection.treatment.slice(0, 2).map((item, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-600 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Prevention</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {detection.preventiveMeasures.slice(0, 2).map((item, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};