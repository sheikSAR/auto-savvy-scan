
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, X, ImagePlus, AlertCircle, Car, FileWarning, Clipboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { uploadImageForCarDetails } from '@/services/api';

export type UploadedImage = {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
};

type ImageUploadProps = {
  onImagesUploaded: (images: UploadedImage[]) => void;
  onCarDetailsDetected?: (carDetails: any) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesUploaded, 
  onCarDetailsDetected 
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();
  const carDetailsCallbackRef = useRef(onCarDetailsDetected);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  
  // Update ref when prop changes
  useEffect(() => {
    carDetailsCallbackRef.current = onCarDetailsDetected;
  }, [onCarDetailsDetected]);

  // Setup clipboard paste event listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault();
        processFiles(e.clipboardData.files);
      }
    };
    
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

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

  // Fake vehicle detection for demo purposes
  // In a real app, this would use machine learning to identify vehicles
  const isVehicleImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // For demo: Randomly reject some images to show the functionality
      // This would be replaced with actual vehicle detection logic
      const isMockVehicle = Math.random() > 0.2; // 80% chance of being a vehicle
      
      // Simulate API call delay
      setTimeout(() => {
        resolve(isMockVehicle);
      }, 500);
    });
  };

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const validFiles: UploadedImage[] = [];
    const invalidFileTypes: string[] = [];
    const invalidVehicles: string[] = [];

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (file.type.startsWith('image/')) {
        // Check if it's a vehicle image
        const isVehicle = await isVehicleImage(file);
        
        if (isVehicle) {
          const newImage = {
            id: Math.random().toString(36).substring(2, 9),
            file,
            preview: URL.createObjectURL(file),
            uploading: true,
            progress: 0,
          };
          validFiles.push(newImage);
        } else {
          invalidVehicles.push(file.name);
          // Trigger rejection animation
          setIsRejecting(true);
          setTimeout(() => setIsRejecting(false), 820);
        }
      } else {
        invalidFileTypes.push(file.name);
      }
    }

    // Show error messages
    if (invalidFileTypes.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `${invalidFileTypes.join(', ')} ${invalidFileTypes.length > 1 ? 'are' : 'is'} not an image file.`,
      });
    }
    
    if (invalidVehicles.length > 0) {
      toast({
        variant: "destructive",
        title: "Not a vehicle image",
        description: `Only vehicle images are allowed. ${invalidVehicles.join(', ')} ${invalidVehicles.length > 1 ? 'do' : 'does'} not appear to contain a vehicle.`,
        icon: <FileWarning className="h-5 w-5" />
      });
    }

    if (validFiles.length > 0) {
      const updatedImages = [...images, ...validFiles];
      setImages(updatedImages);
      
      // If this is the first image, prepare to detect car details after upload finishes
      if (images.length === 0) {
        simulateUpload(validFiles, (uploadedImage) => {
          // Only process the API call if the callback is still valid 
          if (carDetailsCallbackRef.current) {
            // Call the backend API to detect car details
            detectCarDetails(uploadedImage.file);
          }
        });
      } else {
        simulateUpload(validFiles);
      }
    }
  }, [images, toast]);

  // Separate function to detect car details to avoid React state updates during render
  const detectCarDetails = async (file: File) => {
    try {
      const response = await uploadImageForCarDetails(file);
      if (response.status === 'success' && response.data) {
        // Use the ref callback to avoid state updates during rendering
        if (carDetailsCallbackRef.current) {
          carDetailsCallbackRef.current(response.data);
          toast({
            title: "Car details detected",
            description: "We've automatically filled some car details based on the image.",
          });
        }
      }
    } catch (error) {
      console.error('Error detecting car details:', error);
    }
  };

  const simulateUpload = (newImages: UploadedImage[], onComplete?: (image: UploadedImage) => void) => {
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
          
          if (onComplete) {
            onComplete(image);
          }
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
        ref={dropzoneRef}
        className={`
          dropzone 
          ${isDragging ? 'border-car-blue dark:border-car-blue border-2 bg-car-blue/5' : 'border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
          ${isRejecting ? 'animate-shake' : ''}
          transition-all duration-200 rounded-xl p-8`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`mb-4 rounded-full p-4 ${isDragging ? 'bg-car-blue/10 text-car-blue animate-pulse' : 'bg-gray-100 dark:bg-gray-800'} transition-colors duration-300`}>
            {isDragging ? (
              <Upload className="w-12 h-12 text-car-blue" />
            ) : (
              <Car className="w-12 h-12 text-car-blue" />
            )}
          </div>
          
          <h3 className="text-lg font-medium mb-1">
            {isDragging 
              ? "Drop your vehicle images here" 
              : "Drag & Drop or Paste your vehicle image here"}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse from your device
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-2">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleFileInputChange}
            />
            
            <Button asChild className="bg-car-blue hover:bg-car-blue/90">
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImagePlus className="w-4 h-4 mr-2" />
                Select Images
              </label>
            </Button>
            
            <Button variant="outline" className="flex items-center">
              <Clipboard className="w-4 h-4 mr-2" />
              Paste from clipboard
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Supports: JPG, PNG, WebP • Max size: 10MB
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                <img
                  src={image.preview}
                  alt="Car upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/90 transition-colors"
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
