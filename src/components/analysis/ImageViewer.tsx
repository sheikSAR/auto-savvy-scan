
import React from 'react';
import { getDefectsForImage } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

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
  return (
    <div className="rounded-lg overflow-hidden border relative aspect-video shadow-inner bg-gray-100">
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
        getDefectsForImage(selectedImage, analysisResult, fullAnalysisResult).map((defect) => (
          <div
            key={defect.id}
            className="image-annotation"
            style={{
              left: `${defect.position.x * 100}%`,
              top: `${defect.position.y * 100}%`,
              width: defect.severity === 'high' ? '28px' : defect.severity === 'medium' ? '22px' : '18px',
              height: defect.severity === 'high' ? '28px' : defect.severity === 'medium' ? '22px' : '18px',
            }}
            title={defect.description}
          />
        ))}
    </div>
  );
};

export default ImageViewer;
