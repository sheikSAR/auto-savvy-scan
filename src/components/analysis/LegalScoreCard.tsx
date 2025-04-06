
import React from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { getScoreColor, getLegalIssues } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type LegalScoreCardProps = {
  legalScore: number;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const LegalScoreCard: React.FC<LegalScoreCardProps> = ({
  legalScore,
  analysisResult,
  fullAnalysisResult,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border">
      <div className="flex flex-col items-center">
        <div className="car-gauge relative mb-6">
          <div
            className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
            style={{ height: `${legalScore}%` }}
          />
          <div className="car-gauge-text text-3xl">
            <span className={getScoreColor(legalScore)}>
              {legalScore}
            </span>
          </div>
          <div className="absolute -bottom-4 left-0 right-0 text-center">
            <span className="text-xs font-medium bg-white px-2 py-1 rounded-full shadow">Legal Status</span>
          </div>
        </div>
        
        <div className="w-full space-y-3 mt-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-car-blue" /> Legal Assessment
          </h3>
          
          <div className="mt-2 space-y-3">
            {fullAnalysisResult && (
              <>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Insurance</span>
                  <span className={fullAnalysisResult.legal_status.insurance.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                    {fullAnalysisResult.legal_status.insurance.status}
                  </span>
                </div>
                
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Registration</span>
                  <span className={fullAnalysisResult.legal_status.registration.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                    {fullAnalysisResult.legal_status.registration.status}
                  </span>
                </div>
                
                {fullAnalysisResult.legal_status.challans.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Pending Challans</p>
                    <ul className="space-y-2 text-sm">
                      {fullAnalysisResult.legal_status.challans.map((challan, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{challan.date}</span>
                          <span className={challan.status === 'paid' ? 'text-green-500' : 'text-red-500'}>
                            {challan.fine_amount} - {challan.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            
            {getLegalIssues(analysisResult, fullAnalysisResult).length > 0 ? (
              <ul className="space-y-2 mt-4">
                {getLegalIssues(analysisResult, fullAnalysisResult).map((issue, index) => (
                  <li key={index} className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">All legal documents in order</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalScoreCard;
