
import React from 'react';
import { DollarSign, Info, AlertCircle } from 'lucide-react';
import { getScoreColor, formatCurrency } from '@/utils/analysisUtils';
import { FullAnalysisResult } from '@/types/analysis';

type PricingRecommendationProps = {
  recommendedPrice: number | string;
  marketValueRange: {
    low: number | string;
    average: number | string;
    high: number | string;
  };
  physicalScore: number;
  legalScore: number;
  fullAnalysisResult?: FullAnalysisResult;
};

const PricingRecommendation: React.FC<PricingRecommendationProps> = ({
  recommendedPrice,
  marketValueRange,
  physicalScore,
  legalScore,
  fullAnalysisResult,
}) => {
  const isPriceComparable = (): { isOverpriced: boolean; difference: number | string } => {
    if (typeof marketValueRange.average === 'number' && typeof recommendedPrice === 'number') {
      const isOverpriced = marketValueRange.average > recommendedPrice;
      const difference = Math.abs(marketValueRange.average - recommendedPrice);
      return { isOverpriced, difference };
    }
    
    return { isOverpriced: false, difference: 0 };
  };
  
  const { isOverpriced, difference } = isPriceComparable();
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-car-blue shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-car-blue flex items-center gap-2">
          <DollarSign className="w-6 h-6" /> Recommended Purchase Price
        </h3>
        <div className="text-3xl font-bold text-car-blue">
          {formatCurrency(recommendedPrice)}
        </div>
      </div>

      <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-car-blue shrink-0 mt-0.5 mr-3" />
          <p className="text-gray-700">
            This price takes into account the vehicle's physical condition, legal status, and current market value.
          </p>
        </div>
        
        {fullAnalysisResult && (
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
            <div>
              <p className="text-gray-700">
                <strong>Value Assessment:</strong> This price accounts for all detected damages and legal issues.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total repair cost: <span className="text-red-600 font-medium">{fullAnalysisResult.total_repair_cost}</span>
              </p>
            </div>
          </div>
        )}
        
        {typeof marketValueRange.average === 'number' && typeof recommendedPrice === 'number' && (
          isOverpriced ? (
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
              <p className="text-gray-700">
                This car is <strong>underpriced by approximately {formatCurrency(difference)}</strong> compared to market average.
              </p>
            </div>
          ) : (
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5 mr-3" />
              <p className="text-gray-700">
                This car is <strong>overpriced by approximately {formatCurrency(difference)}</strong> compared to market average.
              </p>
            </div>
          )
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Physical Score</p>
          <p className={`font-bold text-lg ${getScoreColor(physicalScore)}`}>{physicalScore}/100</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Legal Score</p>
          <p className={`font-bold text-lg ${getScoreColor(legalScore)}`}>{legalScore}/100</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Market Position</p>
          <p className="font-bold text-lg text-car-blue">Fair Price</p>
        </div>
      </div>
    </div>
  );
};

export default PricingRecommendation;
