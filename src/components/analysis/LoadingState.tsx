
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Gauge, RotateCcw, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoadingState: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [scanY, setScanY] = useState(0);
  const [analysisParts, setAnalysisParts] = useState({
    detection: false,
    physical: false,
    legal: false,
    pricing: false
  });
  
  useEffect(() => {
    // Progress bar logic
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(progressTimer);
          return prevProgress;
        }
        return prevProgress + Math.floor(Math.random() * 8) + 1;
      });
    }, 600);
    
    // Scan line animation
    const scanTimer = setInterval(() => {
      setScanY(prev => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 30);
    
    // Set analysis parts progress
    setTimeout(() => setAnalysisParts(prev => ({ ...prev, detection: true })), 1500);
    setTimeout(() => setAnalysisParts(prev => ({ ...prev, physical: true })), 3500);
    setTimeout(() => setAnalysisParts(prev => ({ ...prev, legal: true })), 5000);
    setTimeout(() => setAnalysisParts(prev => ({ ...prev, pricing: true })), 6500);
    
    return () => {
      clearInterval(progressTimer);
      clearInterval(scanTimer);
    };
  }, []);

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center py-10 relative overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-car-blue/5 to-transparent opacity-50 z-0"></div>
        
        {/* 3D Car Animation Effect */}
        <div className="w-48 h-48 mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-16 h-16 text-car-blue animate-rotate-car" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900 opacity-30"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-car-blue border-t-transparent animate-spin"
            style={{ animationDuration: '2s' }}
          ></div>
          
          {/* Scan line effect */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-car-blue to-transparent"
            style={{ 
              top: `${scanY}%`,
              boxShadow: '0 0 10px 2px #3498db',
              opacity: 0.8
            }}
          ></div>
        </div>

        {/* Scanning Effect */}
        <div className="mb-4 w-full relative z-10">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-car-blue to-teal-accent bg-clip-text text-transparent">
            Analyzing vehicle condition...
          </h3>
          
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4 max-w-md mx-auto">
            <div className="flex items-center">
              <div className={`w-5 h-5 mr-2 rounded-full flex items-center justify-center ${analysisParts.detection ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                {analysisParts.detection && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={analysisParts.detection ? 'text-green-500 font-medium' : ''}>Vehicle detection</span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-5 h-5 mr-2 rounded-full flex items-center justify-center ${analysisParts.physical ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                {analysisParts.physical && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={analysisParts.physical ? 'text-green-500 font-medium' : ''}>
                <Gauge className="inline w-3.5 h-3.5 mr-1" /> Physical condition assessment
              </span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-5 h-5 mr-2 rounded-full flex items-center justify-center ${analysisParts.legal ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                {analysisParts.legal && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={analysisParts.legal ? 'text-green-500 font-medium' : ''}>
                <Shield className="inline w-3.5 h-3.5 mr-1" /> Legal status verification
              </span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-5 h-5 mr-2 rounded-full flex items-center justify-center ${analysisParts.pricing ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                {analysisParts.pricing && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={analysisParts.pricing ? 'text-green-500 font-medium' : ''}>Market value calculation</span>
            </div>
          </div>
        </div>
        
        <Progress value={progress} className="w-64 h-3 bg-gray-200 dark:bg-gray-700 mb-2">
          <div 
            className="h-full bg-gradient-to-r from-car-blue to-teal-accent rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </Progress>
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
          <span>{progress}% complete</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
