
import React, { useState } from 'react';
import { getDefectsForImage } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';
import { AlertTriangle } from 'lucide-react';

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

  return (
    <div className="rounded-xl overflow-hidden border relative aspect-video shadow-inner bg-gray-100 dark:bg-gray-800">
      {currentImage ? (
        <img
          src={currentImage.preview}
          alt="Selected car"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No image selected</p>
        </div>
      )}
      
      {selectedImage &&
        getDefectsForImage(selectedImage, analysisResult, fullAnalysisResult).map((defect) => {
          // Calculate bounding box coordinates
          const getDimensions = () => {
            if (fullAnalysisResult?.damages?.[defect.type.toLowerCase()]?.coordinates) {
              // Use coordinates from full analysis if available
              const coords = fullAnalysisResult.damages[defect.type.toLowerCase()]?.coordinates[0];
              if (coords) {
                return {
                  left: `${coords.x1}%`,
                  top: `${coords.y1}%`,
                  width: `${coords.x2 - coords.x1}%`,
                  height: `${coords.y2 - coords.y1}%`
                };
              }
            }
            
            // Fallback to point-based calculation
            return {
              left: `${defect.position.x * 100 - 5}%`,
              top: `${defect.position.y * 100 - 5}%`,
              width: defect.severity === 'high' ? '10%' : defect.severity === 'medium' ? '8%' : '6%',
              height: defect.severity === 'high' ? '10%' : defect.severity === 'medium' ? '8%' : '6%'
            };
          };
          
          const dimensions = getDimensions();
          const isHovered = hoveredDefect === defect.id;
          
          return (
            <div
              key={defect.id}
              className={`defect-box ${
                defect.severity === 'high' 
                  ? 'defect-box-high' 
                  : defect.severity === 'medium' 
                    ? 'defect-box-medium' 
                    : 'defect-box-low'
              } ${isHovered ? 'z-20 scale-105' : 'z-10'}`}
              style={{
                left: dimensions.left,
                top: dimensions.top,
                width: dimensions.width,
                height: dimensions.height
              }}
              onMouseEnter={() => setHoveredDefect(defect.id)}
              onMouseLeave={() => setHoveredDefect(null)}
              title={defect.description}
            >
              {isHovered && (
                <div className={`defect-label ${
                  defect.severity === 'high' 
                    ? 'bg-car-red text-white' 
                    : defect.severity === 'medium' 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-orange-400 text-black'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span className="capitalize">{defect.type}</span>
                    {fullAnalysisResult?.damages?.[defect.type.toLowerCase()]?.damage && (
                      <span className="ml-1 font-bold">
                        {fullAnalysisResult.damages[defect.type.toLowerCase()].damage}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      }
    </div>
  );
};

export default ImageViewer;
