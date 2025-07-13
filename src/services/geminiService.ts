import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Agricultural chatbot service
export class AgricultureChatService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async getChatResponse(message: string, context?: {
    farmLocation?: string;
    farmSize?: number;
    crops?: string[];
    season?: string;
  }): Promise<string> {
    try {
      const systemPrompt = `You are an expert agricultural advisor and farming consultant with decades of experience. Your role is to provide practical, actionable advice to farmers on:

- Fertilizer recommendations and application rates
- Irrigation and water management
- Crop selection and rotation strategies
- Pest and disease management
- Soil health and nutrition
- Planting and harvesting timing
- Weather-related farming decisions
- Sustainable farming practices
- Market insights and crop planning

Context about the farmer:
${context?.farmLocation ? `- Farm Location: ${context.farmLocation}` : ''}
${context?.farmSize ? `- Farm Size: ${context.farmSize} acres` : ''}
${context?.crops ? `- Current Crops: ${context.crops.join(', ')}` : ''}
${context?.season ? `- Current Season: ${context.season}` : ''}

Guidelines:
- Provide specific, actionable advice
- Include quantities, timing, and methods when relevant
- Consider local climate and soil conditions
- Prioritize sustainable and cost-effective solutions
- Ask clarifying questions when needed
- Use simple, clear language that farmers can understand
- Include safety precautions when handling chemicals or equipment

Farmer's Question: ${message}

Please provide a comprehensive, helpful response:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw new Error('Failed to get response from agricultural advisor');
    }
  }

  async getFertilizerRecommendation(cropType: string, soilType: string, fieldSize: number): Promise<string> {
    const prompt = `As an agricultural expert, provide specific fertilizer recommendations for:
    
Crop: ${cropType}
Soil Type: ${soilType}
Field Size: ${fieldSize} acres

Please include:
1. NPK ratio recommendations
2. Application rates per acre
3. Timing of applications
4. Organic vs synthetic options
5. Cost estimates
6. Application methods
7. Safety considerations

Provide practical, actionable advice that a farmer can implement immediately.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting fertilizer recommendation:', error);
      throw new Error('Failed to get fertilizer recommendation');
    }
  }
}

// Disease detection service using Gemini Vision
export class DiseaseDetectionService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeImage(imageFile: File, cropName: string): Promise<{
    disease: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    treatment: string[];
    preventiveMeasures: string[];
    description: string;
  }> {
    try {
      // Convert file to base64
      const imageData = await this.fileToGenerativePart(imageFile);

      const prompt = `You are an expert plant pathologist and agricultural specialist. Analyze this image of a ${cropName} plant and provide a comprehensive health assessment.

Please analyze the image and provide:

1. DISEASE IDENTIFICATION:
   - Primary disease or health issue (if any)
   - Confidence level (0-100%)
   - Severity level (low/medium/high)

2. DETAILED DESCRIPTION:
   - Visible symptoms and signs
   - Affected plant parts
   - Stage of disease progression

3. TREATMENT RECOMMENDATIONS:
   - Immediate action steps
   - Specific fungicides/treatments
   - Application methods and timing
   - Dosage recommendations

4. PREVENTIVE MEASURES:
   - Future prevention strategies
   - Cultural practices
   - Resistant varieties
   - Environmental management

5. PROGNOSIS:
   - Expected recovery time
   - Potential yield impact
   - Spread risk assessment

If the plant appears healthy, indicate this clearly and provide maintenance recommendations.

Format your response as a detailed analysis that a farmer can understand and act upon immediately.`;

      const result = await this.model.generateContent([prompt, imageData]);
      const response = await result.response;
      const analysisText = response.text();

      // Parse the response to extract structured data
      return this.parseAnalysisResponse(analysisText);
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze crop image');
    }
  }

  private async fileToGenerativePart(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private parseAnalysisResponse(analysisText: string): {
    disease: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    treatment: string[];
    preventiveMeasures: string[];
    description: string;
  } {
    // Extract key information from the analysis text
    const lines = analysisText.split('\n').filter(line => line.trim());
    
    // Default values
    let disease = 'Analysis Complete';
    let confidence = 85;
    let severity: 'low' | 'medium' | 'high' = 'medium';
    let treatment: string[] = [];
    let preventiveMeasures: string[] = [];
    let description = analysisText;

    // Parse disease name
    const diseaseMatch = analysisText.match(/(?:disease|condition|issue):\s*([^\n]+)/i);
    if (diseaseMatch) {
      disease = diseaseMatch[1].trim();
    } else if (analysisText.toLowerCase().includes('healthy')) {
      disease = 'Healthy Crop';
      confidence = 95;
      severity = 'low';
    }

    // Parse confidence
    const confidenceMatch = analysisText.match(/confidence[:\s]*(\d+)%?/i);
    if (confidenceMatch) {
      confidence = parseInt(confidenceMatch[1]);
    }

    // Parse severity
    if (analysisText.toLowerCase().includes('high severity') || analysisText.toLowerCase().includes('severe')) {
      severity = 'high';
    } else if (analysisText.toLowerCase().includes('low severity') || analysisText.toLowerCase().includes('mild')) {
      severity = 'low';
    }

    // Extract treatment recommendations
    const treatmentSection = analysisText.match(/treatment[^:]*:?\s*(.*?)(?=preventive|prevention|prognosis|$)/is);
    if (treatmentSection) {
      treatment = treatmentSection[1]
        .split(/[-•\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 10)
        .slice(0, 4);
    }

    // Extract preventive measures
    const preventiveSection = analysisText.match(/preventive[^:]*:?\s*(.*?)(?=prognosis|$)/is);
    if (preventiveSection) {
      preventiveMeasures = preventiveSection[1]
        .split(/[-•\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 10)
        .slice(0, 4);
    }

    // Fallback treatments and preventive measures
    if (treatment.length === 0) {
      treatment = [
        'Monitor plant health regularly',
        'Ensure proper irrigation and drainage',
        'Apply appropriate fertilizers as needed',
        'Consult local agricultural extension office'
      ];
    }

    if (preventiveMeasures.length === 0) {
      preventiveMeasures = [
        'Maintain proper plant spacing',
        'Ensure good air circulation',
        'Practice crop rotation',
        'Use disease-resistant varieties'
      ];
    }

    return {
      disease,
      confidence,
      severity,
      treatment,
      preventiveMeasures,
      description
    };
  }
}

// Export service instances
export const agricultureChatService = new AgricultureChatService();
export const diseaseDetectionService = new DiseaseDetectionService();