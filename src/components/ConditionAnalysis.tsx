
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, Car } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export type Defect = {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  position: { x: number; y: number };
  imageId: string;
};

export type AnalysisResult = {
  physicalScore: number;
  legalScore: number;
  marketValue: {
    low: number;
    average: number;
    high: number;
  };
  recommendedPrice: number;
  defects: Defect[];
  legalIssues: string[];
};

type ConditionAnalysisProps = {
  images: Array<{ id: string; preview: string }>;
  analysisResult?: AnalysisResult;
  loading: boolean;
};

const ConditionAnalysis: React.FC<ConditionAnalysisProps> = ({
  images,
  analysisResult,
  loading,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0].id);
    }
  }, [images, selectedImage]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDefectsForImage = (imageId: string) => {
    if (!analysisResult) return [];
    return analysisResult.defects.filter(defect => defect.imageId === imageId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Car className="w-16 h-16 text-car-blue animate-pulse mb-4" />
          <h3 className="text-lg font-medium mb-2">Analyzing vehicle condition...</h3>
          <p className="text-sm text-gray-500 mb-6">This may take a minute or two</p>
          <Progress value={45} className="w-64 h-2" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  const currentImage = images.find(img => img.id === selectedImage);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Vehicle Condition Analysis</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="visual">Visual Analysis</TabsTrigger>
            <TabsTrigger value="scoring">Condition Scores</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 space-y-2">
                <p className="text-sm font-medium">Select Image</p>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`relative border rounded-md overflow-hidden cursor-pointer transition-all hover:opacity-90 ${
                        selectedImage === image.id ? 'ring-2 ring-car-blue' : ''
                      }`}
                      onClick={() => setSelectedImage(image.id)}
                    >
                      <img
                        src={image.preview}
                        alt="Car"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      {getDefectsForImage(image.id).length > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                          {getDefectsForImage(image.id).length}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="rounded-lg overflow-hidden border relative aspect-video">
                  {currentImage && (
                    <img
                      src={currentImage.preview}
                      alt="Selected car"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {selectedImage &&
                    getDefectsForImage(selectedImage).map((defect) => (
                      <div
                        key={defect.id}
                        className="image-annotation"
                        style={{
                          left: `${defect.position.x * 100}%`,
                          top: `${defect.position.y * 100}%`,
                          width: defect.severity === 'high' ? '24px' : defect.severity === 'medium' ? '20px' : '16px',
                          height: defect.severity === 'high' ? '24px' : defect.severity === 'medium' ? '20px' : '16px',
                        }}
                        title={defect.description}
                      />
                    ))}
                </div>

                {selectedImage && getDefectsForImage(selectedImage).length > 0 ? (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Detected Issues:</h4>
                    <ul className="space-y-2">
                      {getDefectsForImage(selectedImage).map((defect) => (
                        <li key={defect.id} className="flex items-start text-sm">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                              defect.severity === 'high'
                                ? 'bg-red-500'
                                : defect.severity === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-orange-300'
                            }`}
                          />
                          <span>
                            <strong>{defect.type}:</strong> {defect.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No issues detected in this image</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scoring">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="car-gauge">
                  <div
                    className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
                    style={{ height: `${analysisResult.physicalScore}%` }}
                  />
                  <div className="car-gauge-text">
                    <span className={getScoreColor(analysisResult.physicalScore)}>
                      {analysisResult.physicalScore}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-medium mt-4">Physical Condition</h3>
                <div className="mt-4 w-full space-y-2">
                  {analysisResult.defects.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {analysisResult.defects.slice(0, 3).map((defect) => (
                        <li key={defect.id} className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span>{defect.description}</span>
                        </li>
                      ))}
                      {analysisResult.defects.length > 3 && (
                        <li className="text-sm text-gray-500">
                          + {analysisResult.defects.length - 3} more issues
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Excellent physical condition</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="car-gauge">
                  <div
                    className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
                    style={{ height: `${analysisResult.legalScore}%` }}
                  />
                  <div className="car-gauge-text">
                    <span className={getScoreColor(analysisResult.legalScore)}>
                      {analysisResult.legalScore}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-medium mt-4">Legal Status</h3>
                <div className="mt-4 w-full space-y-2">
                  {analysisResult.legalIssues.length > 0 ? (
                    <ul className="text-sm space-y-2">
                      {analysisResult.legalIssues.map((issue, index) => (
                        <li key={index} className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">All legal documents in order</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="text-lg font-medium mb-2">Market Value Range</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
                <div className="relative h-8 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-md mb-2">
                  <div
                    className="absolute w-4 h-8 bg-black transform -translate-x-1/2 rounded-full border-2 border-white"
                    style={{
                      left: `${(
                        (analysisResult.recommendedPrice - analysisResult.marketValue.low) /
                        (analysisResult.marketValue.high - analysisResult.marketValue.low)
                      ) * 100}%`,
                      top: '0',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatCurrency(analysisResult.marketValue.low)}</span>
                  <span className="font-medium">{formatCurrency(analysisResult.marketValue.average)}</span>
                  <span className="font-medium">{formatCurrency(analysisResult.marketValue.high)}</span>
                </div>
              </div>

              <div className="bg-car-blue bg-opacity-5 rounded-lg p-6 border border-car-blue">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-car-blue">Recommended Purchase Price</h3>
                  <div className="text-2xl font-bold text-car-blue">
                    {formatCurrency(analysisResult.recommendedPrice)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-car-blue shrink-0 mt-0.5 mr-2" />
                    <p className="text-sm">
                      This price takes into account the vehicle's physical condition, legal status, and current market value.
                    </p>
                  </div>
                  
                  {analysisResult.marketValue.average > analysisResult.recommendedPrice ? (
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-2" />
                      <p className="text-sm">
                        This car is <strong>underpriced by approximately {formatCurrency(analysisResult.marketValue.average - analysisResult.recommendedPrice)}</strong> compared to market average.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5 mr-2" />
                      <p className="text-sm">
                        This car is <strong>overpriced by approximately {formatCurrency(analysisResult.recommendedPrice - analysisResult.marketValue.average)}</strong> compared to market average.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConditionAnalysis;
