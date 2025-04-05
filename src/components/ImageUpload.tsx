
import React, { useState, useCallback } from 'react';
import { Upload, X, ImagePlus, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
};

const ImageUpload: React.FC<{
  onImagesUploaded: (images: UploadedImage[]) => void;
}> = ({ onImagesUploaded }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles: UploadedImage[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        validFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          progress: 0,
        });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `${invalidFiles.join(', ')} ${invalidFiles.length > 1 ? 'are' : 'is'} not an image file.`,
      });
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      // Simulate upload process
      simulateUpload(validFiles);
    }
  }, [toast]);

  const simulateUpload = (newImages: UploadedImage[]) => {
    const updatedImages = [...images];
    
    newImages.forEach((image) => {
      const index = updatedImages.findIndex((img) => img.id === image.id);
      if (index !== -1) {
        updatedImages[index] = { ...updatedImages[index], uploading: true };
      } else {
        updatedImages.push({ ...image, uploading: true });
      }
    });
    
    setImages(updatedImages);
    
    // Simulate progress
    newImages.forEach((image) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          
          setImages((prev) => {
            const updated = prev.map((img) => 
              img.id === image.id ? { ...img, uploading: false, progress: 100 } : img
            );
            onImagesUploaded(updated);
            return updated;
          });
        } else {
          setImages((prev) => 
            prev.map((img) => 
              img.id === image.id ? { ...img, progress } : img
            )
          );
        }
      }, 300);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      onImagesUploaded(filtered);
      return filtered;
    });
  };

  return (
    <div className="space-y-6">
      <div
        className={`dropzone ${isDragging ? 'dropzone-active' : 'border-gray-300 hover:border-gray-400'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium mb-1">Drag & drop your car images here</h3>
          <p className="text-sm text-gray-500 mb-4">or click to browse from your device</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleFileInputChange}
          />
          <Button asChild>
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImagePlus className="w-4 h-4 mr-2" />
              Select Images
            </label>
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={image.preview}
                  alt="Car upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                {image.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-1 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {image.error}
                  </div>
                )}
              </div>
              
              <CardContent className="p-3">
                <p className="text-xs truncate mb-1">{image.file.name}</p>
                {image.uploading && (
                  <div>
                    <Progress value={image.progress} className="h-1 mb-1" />
                    <p className="text-xs text-gray-500">{image.progress}% uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
