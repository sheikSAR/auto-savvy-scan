
import React from 'react';
import { Gauge, Shield, DollarSign } from 'lucide-react';
import { getScoreColor, formatCurrency } from '@/utils/analysisUtils';

type SummaryCardsProps = {
  physicalScore: number;
  legalScore: number;
  marketValueRange: {
    low: number | string;
    average: number | string;
    high: number | string;
  };
  recommendedPrice: number | string;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({
  physicalScore,
  legalScore,
  marketValueRange,
  recommendedPrice,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center mb-2">
            <Gauge className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Physical Condition</h3>
          </div>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="car-gauge">
            <div 
              className="car-gauge-indicator bg-blue-500" 
              style={{ 
                height: `${physicalScore}%`,
              }}
            ></div>
            <div className="car-gauge-text">
              <span className="text-3xl">{physicalScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
        <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Legal Status</h3>
          </div>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="car-gauge">
            <div 
              className="car-gauge-indicator bg-green-500" 
              style={{ 
                height: `${legalScore}%`,
              }}
            ></div>
            <div className="car-gauge-text">
              <span className="text-3xl">{legalScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Market Value</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Recommended Price</p>
              <p className="text-3xl font-semibold text-purple-600">
                {typeof recommendedPrice === 'number' 
                  ? formatCurrency(recommendedPrice) 
                  : recommendedPrice}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center border-t pt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Low</p>
                <p className="text-sm font-medium">
                  {typeof marketValueRange.low === 'number' 
                    ? formatCurrency(marketValueRange.low) 
                    : marketValueRange.low}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Average</p>
                <p className="text-sm font-medium">
                  {typeof marketValueRange.average === 'number' 
                    ? formatCurrency(marketValueRange.average) 
                    : marketValueRange.average}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">High</p>
                <p className="text-sm font-medium">
                  {typeof marketValueRange.high === 'number' 
                    ? formatCurrency(marketValueRange.high) 
                    : marketValueRange.high}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
