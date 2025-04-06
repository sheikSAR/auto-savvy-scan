
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import SummaryCards from './SummaryCards';
import VisualAnalysis from './VisualAnalysis';
import ConditionScores from './ConditionScores';
import PricingAnalysis from './PricingAnalysis';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type AnalysisContentProps = {
  images: Array<{ id: string; preview: string }>;
  selectedImage: string | null;
  setSelectedImage: (id: string) => void;
  physicalScore: number;
  legalScore: number;
  marketValueRange: {
    low: number | string;
    average: number | string;
    high: number | string;
  };
  recommendedPrice: number | string;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const AnalysisContent: React.FC<AnalysisContentProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  physicalScore,
  legalScore,
  marketValueRange,
  recommendedPrice,
  analysisResult,
  fullAnalysisResult,
}) => {
  return (
    <>
      <SummaryCards 
        physicalScore={physicalScore}
        legalScore={legalScore}
        marketValueRange={marketValueRange}
        recommendedPrice={recommendedPrice}
      />

      <Card className="glass-card shadow-xl border-t-4 border-t-car-blue overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 pb-4">
          <CardTitle className="text-2xl bg-gradient-to-r from-car-blue to-teal-accent bg-clip-text text-transparent flex items-center gap-2">
            <Car className="h-6 w-6" /> Vehicle Condition Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b dark:border-gray-700">
              <TabsTrigger value="visual" className="font-medium">
                Visual Analysis
              </TabsTrigger>
              <TabsTrigger value="scoring" className="font-medium">
                Condition Scores
              </TabsTrigger>
              <TabsTrigger value="pricing" className="font-medium">
                Pricing Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="p-4 space-y-4">
              <VisualAnalysis 
                images={images}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                analysisResult={analysisResult}
                fullAnalysisResult={fullAnalysisResult}
              />
            </TabsContent>

            <TabsContent value="scoring" className="p-6">
              <ConditionScores 
                physicalScore={physicalScore}
                legalScore={legalScore}
                images={images}
                analysisResult={analysisResult}
                fullAnalysisResult={fullAnalysisResult}
              />
            </TabsContent>

            <TabsContent value="pricing" className="p-6">
              <PricingAnalysis 
                marketValueRange={marketValueRange}
                recommendedPrice={recommendedPrice}
                physicalScore={physicalScore}
                legalScore={legalScore}
                fullAnalysisResult={fullAnalysisResult}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default AnalysisContent;
