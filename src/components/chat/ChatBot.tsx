import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { agricultureChatService } from '../../services/geminiService';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sprout,
  Lightbulb,
  Droplets,
  Calculator
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  loading?: boolean;
}

export const ChatBot: React.FC = () => {
  const { user } = useAuth();
  const { crops } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello ${user?.name || 'Farmer'}! 👋 I'm your AI agricultural advisor. I can help you with:

🌱 **Fertilizer recommendations** - Get specific NPK ratios and application rates
💧 **Irrigation guidance** - Optimize water usage for your crops  
🌾 **Crop selection** - Choose the best varieties for your location
🐛 **Pest management** - Identify and treat common agricultural pests
📅 **Planting schedules** - Get timing recommendations for your region
💰 **Cost optimization** - Reduce expenses while maximizing yield

What farming challenge can I help you solve today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    {
      icon: Calculator,
      text: "Calculate fertilizer for 50 acres of corn",
      question: "I need fertilizer recommendations for 50 acres of corn. What NPK ratio should I use and how much per acre?"
    },
    {
      icon: Droplets,
      text: "Irrigation schedule for wheat",
      question: "What's the optimal irrigation schedule for wheat during the growing season?"
    },
    {
      icon: Sprout,
      text: "Best crops for my region",
      question: `I'm located in ${user?.location || 'my area'} with ${user?.farmSize || 100} acres. What crops would be most profitable this season?`
    },
    {
      icon: Lightbulb,
      text: "Soil health improvement tips",
      question: "How can I improve my soil health naturally and cost-effectively?"
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare context for the AI
      const context = {
        farmLocation: user?.location,
        farmSize: user?.farmSize,
        crops: crops.map(crop => crop.type),
        season: getCurrentSeason()
      };

      const response = await agricultureChatService.getChatResponse(message, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can check with your local agricultural extension office for immediate assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI Farm Advisor</h3>
            <p className="text-green-100 text-sm">Get expert agricultural guidance</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'bot' && (
                    <Bot className="h-4 w-4 mt-1 text-green-600 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-green-600" />
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Analyzing your question...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(item.question)}
                    className="flex items-center space-x-2 p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <Icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about fertilizers, irrigation, crop selection..."
                disabled={isLoading}
                className="resize-none"
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific about your crop type, field size, and location for better recommendations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};