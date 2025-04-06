
import React from 'react';
import ImageSelector from './ImageSelector';
import VehicleInfo from './VehicleInfo';
import ImageViewer from './ImageViewer';
import DefectsList from './DefectsList';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type VisualAnalysisProps = {
  images: Array<{ id: string; preview: string }>;
  selectedImage: string | null;
  setSelectedImage: (id: string) => void;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const VisualAnalysis: React.FC<VisualAnalysisProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  analysisResult,
  fullAnalysisResult,
}) => {
  // Find the current selected image
  const getCurrentImage = () => {
    if (!selectedImage) return null;
    return images.find(img => img.id === selectedImage);
  };

  const currentImage = getCurrentImage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <ImageSelector 
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          analysisResult={analysisResult}
          fullAnalysisResult={fullAnalysisResult}
        />
        
        <VehicleInfo fullAnalysisResult={fullAnalysisResult} />
      </div>

      <div className="col-span-2 space-y-4">
        <ImageViewer 
          currentImage={currentImage}
          selectedImage={selectedImage}
          analysisResult={analysisResult}
          fullAnalysisResult={fullAnalysisResult}
        />
        
        <DefectsList 
          selectedImage={selectedImage}
          analysisResult={analysisResult}
          fullAnalysisResult={fullAnalysisResult}
        />
      </div>
    </div>
  );
};

export default VisualAnalysis;
