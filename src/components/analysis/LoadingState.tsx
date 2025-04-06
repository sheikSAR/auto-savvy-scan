
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoadingState: React.FC = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + Math.floor(Math.random() * 10);
      });
    }, 600);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center py-10 relative overflow-hidden">
        {/* 3D Car Animation Effect */}
        <div className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-16 h-16 text-car-blue animate-rotate-car" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900 opacity-30"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-car-blue border-t-transparent animate-spin"
            style={{ animationDuration: '2s' }}
          ></div>
        </div>

        {/* Scanning Effect */}
        <div className="scan-container mb-4 w-full">
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-car-blue to-teal-accent bg-clip-text text-transparent">
            Analyzing vehicle condition...
          </h3>
          <div className="scan-line animate-scan-line"></div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Our AI is scanning your vehicle for defects and condition
        </p>
        
        <Progress value={progress} className="w-64 h-3 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-car-blue to-teal-accent rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </Progress>
        
        <p className="text-xs text-gray-400 mt-2">{progress}% complete</p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
