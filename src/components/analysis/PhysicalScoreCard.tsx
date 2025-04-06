
import React from 'react';
import { Car, CheckCircle, AlertCircle } from 'lucide-react';
import { getScoreColor } from '@/utils/analysisUtils';
import { FullAnalysisResult } from '@/types/analysis';

type PhysicalScoreCardProps = {
  physicalScore: number;
  fullAnalysisResult?: FullAnalysisResult;
  imageId: string;
};

const PhysicalScoreCard: React.FC<PhysicalScoreCardProps> = ({
  physicalScore,
  fullAnalysisResult,
  imageId,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border">
      <div className="flex flex-col items-center">
        <div className="car-gauge relative mb-6">
          <div
            className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
            style={{ height: `${physicalScore}%` }}
          />
          <div className="car-gauge-text text-3xl">
            <span className={getScoreColor(physicalScore)}>
              {physicalScore}
            </span>
          </div>
          <div className="absolute -bottom-4 left-0 right-0 text-center">
            <span className="text-xs font-medium bg-white px-2 py-1 rounded-full shadow">Physical Condition</span>
          </div>
        </div>
        
        <div className="w-full space-y-3 mt-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Car className="w-5 h-5 text-car-blue" /> Physical Assessment
          </h3>
          
          {fullAnalysisResult && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Total Repair Cost: <span className="text-red-600">{fullAnalysisResult.total_repair_cost}</span></p>
            </div>
          )}
          
          <div className="mt-4 w-full space-y-2">
            {Object.entries(fullAnalysisResult?.damages || {}).length > 0 ? (
              <ul className="space-y-3">
                {Object.entries(fullAnalysisResult?.damages || {}).map(([type, damage], index) => {
                  if (!damage) return null;
                  return (
                    <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <AlertCircle className={`w-5 h-5 ${damage.type === 'major' ? 'text-red-500' : 'text-orange-400'} mr-3`} />
                      <div>
                        <span className="font-medium capitalize">{type}: </span>
                        <span>{damage.description}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Repair cost: <span className="text-red-600 font-medium">{damage.repair_cost}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Excellent physical condition</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalScoreCard;
