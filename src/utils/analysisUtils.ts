
import { Defect, Damage, AnalysisResult, FullAnalysisResult } from '@/types/analysis';

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

export const formatCurrency = (value: number | string) => {
  if (typeof value === 'string') {
    return value;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const getDefectsForImage = (
  imageId: string,
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
): Defect[] => {
  if (fullAnalysisResult) {
    const allDamages: Defect[] = [];
    
    if (fullAnalysisResult.damages) {
      Object.entries(fullAnalysisResult.damages).forEach(([damageType, damage]) => {
        if (damage) {
          damage.coordinates.forEach((coord, index) => {
            const centerX = (coord.x1 + coord.x2) / 2 / 100;
            const centerY = (coord.y1 + coord.y2) / 2 / 100;
            
            allDamages.push({
              id: `${damageType}-${index}`,
              type: damageType,
              severity: damage.type === 'major' ? 'high' : 'low',
              description: damage.description,
              position: { x: centerX, y: centerY },
              imageId
            });
          });
        }
      });
    }
    
    return allDamages.filter(defect => defect.imageId === imageId);
  }
  
  if (!analysisResult) return [];
  return analysisResult.defects.filter(defect => defect.imageId === imageId);
};

export const getPhysicalScore = (
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
): number => {
  if (fullAnalysisResult) {
    return fullAnalysisResult.physical_condition;
  }
  return analysisResult?.physicalScore || 0;
};

export const getLegalScore = (
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
): number => {
  if (fullAnalysisResult) {
    return fullAnalysisResult.legal_status.percentage;
  }
  return analysisResult?.legalScore || 0;
};

export const getLegalIssues = (
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
): string[] => {
  if (fullAnalysisResult) {
    const issues: string[] = [];
    
    if (fullAnalysisResult.legal_status.insurance.status === 'invalid') {
      issues.push(`Insurance expired on ${fullAnalysisResult.legal_status.insurance.expiry_date}`);
    }
    
    if (fullAnalysisResult.legal_status.registration.status === 'invalid') {
      issues.push(`Registration expired on ${fullAnalysisResult.legal_status.registration.expiry_date}`);
    }
    
    fullAnalysisResult.legal_status.challans
      .filter(challan => challan.status === 'unpaid')
      .forEach(challan => {
        issues.push(`Unpaid challan: ${challan.fine_amount} from ${challan.date}`);
      });
    
    return issues;
  }
  
  return analysisResult?.legalIssues || [];
};

export const getMarketValueRange = (
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
) => {
  if (fullAnalysisResult) {
    return {
      low: fullAnalysisResult.market_value_range.low_price,
      average: fullAnalysisResult.market_value_range.average_price,
      high: fullAnalysisResult.market_value_range.high_price
    };
  }
  
  return {
    low: analysisResult?.marketValue.low || 0,
    average: analysisResult?.marketValue.average || 0,
    high: analysisResult?.marketValue.high || 0
  };
};

export const getRecommendedPrice = (
  analysisResult?: AnalysisResult,
  fullAnalysisResult?: FullAnalysisResult
) => {
  if (fullAnalysisResult) {
    return fullAnalysisResult.market_value_range.recommended_price;
  }
  
  return analysisResult?.recommendedPrice || 0;
};
