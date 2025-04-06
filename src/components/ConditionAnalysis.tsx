
import React, { useState, useEffect } from 'react';
import { 
  getPhysicalScore, 
  getLegalScore, 
  getMarketValueRange, 
  getRecommendedPrice 
} from '@/utils/analysisUtils';
import LoadingState from './analysis/LoadingState';
import AnalysisContent from './analysis/AnalysisContent';
import { ConditionAnalysisProps } from '@/types/analysis';

const ConditionAnalysis: React.FC<ConditionAnalysisProps> = ({
  images,
  analysisResult,
  fullAnalysisResult,
  loading,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0].id);
    }
  }, [images, selectedImage]);

  // Get the values needed for display
  const physicalScore = getPhysicalScore(analysisResult, fullAnalysisResult);
  const legalScore = getLegalScore(analysisResult, fullAnalysisResult);
  const marketValueRange = getMarketValueRange(analysisResult, fullAnalysisResult);
  const recommendedPrice = getRecommendedPrice(analysisResult, fullAnalysisResult);

  return (
    <div className="space-y-8">
      {loading ? (
        <LoadingState />
      ) : analysisResult ? (
        <AnalysisContent 
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          physicalScore={physicalScore}
          legalScore={legalScore}
          marketValueRange={marketValueRange}
          recommendedPrice={recommendedPrice}
          analysisResult={analysisResult}
          fullAnalysisResult={fullAnalysisResult}
        />
      ) : (
        null
      )}
    </div>
  );
};

export default ConditionAnalysis;
