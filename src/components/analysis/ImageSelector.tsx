
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getDefectsForImage } from '@/utils/analysisUtils';
import { AnalysisResult, FullAnalysisResult } from '@/types/analysis';

type ImageSelectorProps = {
  images: Array<{ id: string; preview: string }>;
  selectedImage: string | null;
  setSelectedImage: (id: string) => void;
  analysisResult?: AnalysisResult;
  fullAnalysisResult?: FullAnalysisResult;
};

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  selectedImage,
  setSelectedImage,
  analysisResult,
  fullAnalysisResult,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <p className="text-base font-bold mb-3">Select Image</p>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {images.map((image) => {
          const defectCount = getDefectsForImage(image.id, analysisResult, fullAnalysisResult).length;
          
          return (
            <div
              key={image.id}
              className={`relative border rounded-md overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                selectedImage === image.id ? 'ring-2 ring-car-blue scale-105' : ''
              }`}
              onClick={() => setSelectedImage(image.id)}
            >
              <img
                src={image.preview}
                alt="Car"
                className="w-full aspect-[4/3] object-cover"
              />
              {defectCount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {defectCount}
                </div>
              )}
              {defectCount === 0 && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageSelector;
