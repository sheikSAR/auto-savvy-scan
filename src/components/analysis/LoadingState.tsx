
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Car className="w-16 h-16 text-car-blue animate-pulse mb-4" />
        <h3 className="text-xl font-bold mb-2">Analyzing vehicle condition...</h3>
        <p className="text-sm text-gray-500 mb-6">This may take a minute or two</p>
        <Progress value={45} className="w-64 h-3" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
