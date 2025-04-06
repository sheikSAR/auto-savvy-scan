
import React, { useState } from 'react';
import { getDefectsForImage } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info } from 'lucide-react';

type ImageViewerProps = {
  currentImage: { id: string; preview: string } | null;
  selectedImage: string | null;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const ImageViewer: React.FC<ImageViewerProps> = ({
  currentImage,
  selectedImage,
  analysisResult,
  fullAnalysisResult,
}) => {
  const [hoveredDefect, setHoveredDefect] = useState<string | null>(null);

  if (!currentImage) return null;

  const defects = selectedImage 
    ? getDefectsForImage(selectedImage, analysisResult, fullAnalysisResult) 
    : [];

  const getDefectBoxClasses = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'defect-box-high';
      case 'medium':
        return 'defect-box-medium';
      default:
        return 'defect-box-low';
    }
  };

  const getDefectLabelClasses = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-orange-400 text-white';
    }
  };

  const getConfidenceDisplay = (severity: string) => {
    switch (severity) {
      case 'high':
        return '90-100%';
      case 'medium':
        return '70-89%';
      default:
        return '40-69%';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={currentImage.preview}
            alt="Vehicle" 
            className="w-full h-full object-cover"
          />
          
          {/* Defect highlighting */}
          {defects.map((defect) => {
            const isHovered = hoveredDefect === defect.id;
            const severity = defect.severity || 'low';
            
            // Calculate position for the bounding box
            const style = {
              left: `${defect.position.x * 100 - 10}%`,
              top: `${defect.position.y * 100 - 10}%`,
              width: '20%',
              height: '20%',
              zIndex: isHovered ? 30 : 20,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            };
            
            return (
              <div
                key={defect.id}
                className={`defect-box ${getDefectBoxClasses(severity)}`}
                style={style}
                onMouseEnter={() => setHoveredDefect(defect.id)}
                onMouseLeave={() => setHoveredDefect(null)}
              >
                {isHovered && (
                  <>
                    <div className={`defect-label ${getDefectLabelClasses(severity)}`}>
                      {defect.type}
                    </div>
                    
                    <div className="absolute -bottom-16 left-0 bg-black/80 text-white text-xs p-2 rounded shadow-lg z-30 w-48">
                      <p className="font-semibold mb-1">{defect.type}</p>
                      <p className="text-xs mb-1">{defect.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300">Confidence:</span>
                        <span className="text-xs font-medium">{getConfidenceDisplay(severity)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Status overlay */}
        {defects.length > 0 ? (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="flex items-center gap-1 py-1 px-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{defects.length} {defects.length === 1 ? 'defect' : 'defects'} detected</span>
            </Badge>
          </div>
        ) : (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-green-500 flex items-center gap-1 py-1 px-2">
              <Info className="w-3.5 h-3.5" />
              <span>No defects detected</span>
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Vehicle Image Analysis</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {defects.length > 0
            ? "Detected issues are highlighted with colored boxes. Hover over each box to see details."
            : "No visible defects detected in this image. The vehicle appears to be in good condition."}
        </p>
      </div>
    </div>
  );
};

export default ImageViewer;
