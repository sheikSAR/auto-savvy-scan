
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getDefectsForImage } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type DefectsListProps = {
  selectedImage: string | null;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const DefectsList: React.FC<DefectsListProps> = ({
  selectedImage,
  analysisResult,
  fullAnalysisResult,
}) => {
  if (!selectedImage) return null;
  
  const defects = getDefectsForImage(selectedImage, analysisResult, fullAnalysisResult);
  
  if (defects.length === 0) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-lg border border-dashed border-green-200">
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No issues detected in this image</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg border space-y-3">
      <h4 className="font-bold mb-3 text-gray-800">Detected Issues:</h4>
      <ul className="space-y-3">
        {defects.map((defect) => (
          <li key={defect.id} className="flex items-start p-3 bg-gray-50 rounded-lg text-sm">
            <span
              className={`inline-block w-3 h-3 rounded-full mt-1 mr-3 ${
                defect.severity === 'high'
                  ? 'bg-red-500'
                  : defect.severity === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-orange-300'
              }`}
            />
            <div>
              <div className="font-semibold text-gray-700 capitalize">{defect.type}</div>
              <p className="text-gray-600">{defect.description}</p>
              
              {fullAnalysisResult?.damages?.[defect.type.toLowerCase()] && (
                <div className="mt-1 text-xs text-gray-500">
                  Estimated repair cost: 
                  <span className="font-medium text-red-600 ml-1">
                    {fullAnalysisResult.damages[defect.type.toLowerCase()]?.repair_cost}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DefectsList;
