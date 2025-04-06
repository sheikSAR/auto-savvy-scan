import React, { useEffect, useState } from "react";
import { Gauge, AlertCircle, CheckCircle } from "lucide-react";
import { getScoreColor } from "@/utils/analysisUtils";
import { FullAnalysisResult } from "@/types/analysis";

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
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the score from 0 to actual value
    const duration = 1500; // ms
    const interval = 10; // ms
    const step = physicalScore / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= physicalScore) {
        clearInterval(timer);
        setAnimatedScore(physicalScore);
      } else {
        setAnimatedScore(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [physicalScore]);

  const getScoreIcon = () => {
    if (physicalScore >= 80)
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (physicalScore >= 50)
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    return <AlertCircle className="w-6 h-6 text-red-500" />;
  };

  const getScoreBarColor = () => {
    if (physicalScore >= 80)
      return "bg-gradient-to-r from-green-500 to-green-400";
    if (physicalScore >= 50)
      return "bg-gradient-to-r from-yellow-500 to-yellow-400";
    return "bg-gradient-to-r from-red-500 to-red-400";
  };

  const getBgScoreBarColor = () => {
    if (physicalScore >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (physicalScore >= 50) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border">
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <Gauge className="w-6 h-6 text-car-blue mr-3" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Physical Condition
          </h3>
        </div>

        {/* Score Bar Display */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">
              {Math.round(animatedScore)}%
            </span>
            {getScoreIcon()}
          </div>

          <div className={`h-4 rounded-full ${getBgScoreBarColor()}`}>
            <div
              className={`h-full rounded-full ${getScoreBarColor()} transition-all duration-1000 ease-out`}
              style={{ width: `${animatedScore}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Severe</span>
            <span>Moderate</span>
            <span>Minor</span>
          </div>
        </div>

        {/* Condition Assessment */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-sm">Condition Assessment</h4>

          {fullAnalysisResult && fullAnalysisResult.damages && (
            <div className="space-y-3">
              {Object.entries(fullAnalysisResult.damages).map(
                ([damageType, details]) =>
                  details && (
                    <div key={damageType} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">
                          {damageType}:
                        </span>
                        <span
                          className={
                            details.type === "major"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }
                        >
                          {details.type}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {details.description}
                      </p>
                    </div>
                  )
              )}
            </div>
          )}

          {(!fullAnalysisResult ||
            !fullAnalysisResult.damages ||
            Object.keys(fullAnalysisResult.damages).length === 0) && (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>No significant damage detected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhysicalScoreCard;
