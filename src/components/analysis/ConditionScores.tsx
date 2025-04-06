
import React from 'react';
import PhysicalScoreCard from './PhysicalScoreCard';
import LegalScoreCard from './LegalScoreCard';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type ConditionScoresProps = {
  physicalScore: number;
  legalScore: number;
  images: Array<{ id: string; preview: string }>;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const ConditionScores: React.FC<ConditionScoresProps> = ({
  physicalScore,
  legalScore,
  images,
  analysisResult,
  fullAnalysisResult,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PhysicalScoreCard 
        physicalScore={physicalScore} 
        fullAnalysisResult={fullAnalysisResult}
        imageId={images[0]?.id || ''}
      />
      <LegalScoreCard 
        legalScore={legalScore}
        analysisResult={analysisResult}
        fullAnalysisResult={fullAnalysisResult}
      />
    </div>
  );
};

export default ConditionScores;
