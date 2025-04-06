
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { getLegalIssues } from '@/utils/analysisUtils';
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
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    // Animate the score from 0 to actual value
    const duration = 1500; // ms
    const interval = 10; // ms
    const step = legalScore / (duration / interval);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= legalScore) {
        clearInterval(timer);
        setAnimatedScore(legalScore);
      } else {
        setAnimatedScore(current);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [legalScore]);

  const getScoreIcon = () => {
    if (legalScore >= 80) return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (legalScore >= 50) return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    return <AlertCircle className="w-6 h-6 text-red-500" />;
  };

  const getScoreBarColor = () => {
    if (legalScore >= 80) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (legalScore >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  const getBgScoreBarColor = () => {
    if (legalScore >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (legalScore >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border">
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-green-500 mr-3" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Legal Status</h3>
        </div>
        
        {/* Score Bar Display */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">{Math.round(animatedScore)}%</span>
            {getScoreIcon()}
          </div>
          
          <div className={`h-4 rounded-full ${getBgScoreBarColor()}`}>
            <div 
              className={`h-full rounded-full ${getScoreBarColor()} transition-all duration-1000 ease-out`} 
              style={{ width: `${animatedScore}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>At Risk</span>
            <span>Average</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-sm">Legal Assessment</h4>
          
          {fullAnalysisResult && (
            <div className="space-y-3">
              {fullAnalysisResult.legal_status.insurance && (
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded text-sm">
                  <span className="font-medium">Insurance:</span>
                  <span className={fullAnalysisResult.legal_status.insurance.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                    {fullAnalysisResult.legal_status.insurance.status}
                  </span>
                </div>
              )}
              
              {fullAnalysisResult.legal_status.registration && (
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded text-sm">
                  <span className="font-medium">Registration:</span>
                  <span className={fullAnalysisResult.legal_status.registration.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                    {fullAnalysisResult.legal_status.registration.status}
                  </span>
                </div>
              )}
              
              {fullAnalysisResult.legal_status.challans && fullAnalysisResult.legal_status.challans.length > 0 && (
                <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded text-sm">
                  <p className="font-medium mb-1">Pending Challans:</p>
                  <ul className="space-y-1">
                    {fullAnalysisResult.legal_status.challans.map((challan, idx) => (
                      <li key={idx} className="flex justify-between text-xs">
                        <span>{challan.date}</span>
                        <span className={challan.status === 'paid' ? 'text-green-500' : 'text-red-500'}>
                          {challan.fine_amount} • {challan.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {getLegalIssues(analysisResult, fullAnalysisResult).length > 0 ? (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-500 mb-1">Legal Issues:</p>
              <ul className="space-y-2">
                {getLegalIssues(analysisResult, fullAnalysisResult).map((issue, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded mt-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>All legal documents in order</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalScoreCard;
