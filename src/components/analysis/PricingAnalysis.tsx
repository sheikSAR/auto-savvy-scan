
import React from 'react';
import PricingRange from './PricingRange';
import PricingRecommendation from './PricingRecommendation';
import { FullAnalysisResult } from '@/types/analysis';

type PricingAnalysisProps = {
  marketValueRange: {
    low: number | string;
    average: number | string;
    high: number | string;
  };
  recommendedPrice: number | string;
  physicalScore: number;
  legalScore: number;
  fullAnalysisResult?: FullAnalysisResult;
};

const PricingAnalysis: React.FC<PricingAnalysisProps> = ({
  marketValueRange,
  recommendedPrice,
  physicalScore,
  legalScore,
  fullAnalysisResult,
}) => {
  return (
    <div className="space-y-6">
      <PricingRange 
        marketValueRange={marketValueRange}
        recommendedPrice={recommendedPrice}
      />
      
      <PricingRecommendation 
        recommendedPrice={recommendedPrice}
        marketValueRange={marketValueRange}
        physicalScore={physicalScore}
        legalScore={legalScore}
        fullAnalysisResult={fullAnalysisResult}
      />
    </div>
  );
};

export default PricingAnalysis;
