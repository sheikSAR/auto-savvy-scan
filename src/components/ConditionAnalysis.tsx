
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, Car, Shield, DollarSign } from 'lucide-react';
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

export type Damage = {
  damage: number;
  description: string;
  type: 'minor' | 'major';
  repair_cost: string;
  coordinates: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
};

type LegalStatus = {
  insurance: {
    status: string;
    expiry_date: string;
    insurance_company: string;
    policy_number: string;
  };
  registration: {
    status: string;
    expiry_date: string;
    registration_number: string;
  };
  challans: Array<{
    challan_number: string;
    fine_amount: string;
    status: string;
    date: string;
  }>;
  percentage: number;
};

export type FullAnalysisResult = {
  damages: {
    dent?: Damage;
    scratch?: Damage;
    headlight?: Damage;
    [key: string]: Damage | undefined;
  };
  plate_number: string | null;
  legal_status: LegalStatus;
  vehicle: {
    make: string;
    model: string;
    color: string;
    price: string;
  };
  market_value_range: {
    low_price: string;
    average_price: string;
    high_price: string;
    recommended_price: string;
  };
  physical_condition: number;
  total_repair_cost: string;
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
  fullAnalysisResult?: FullAnalysisResult;
  loading: boolean;
};

const ConditionAnalysis: React.FC<ConditionAnalysisProps> = ({
  images,
  analysisResult,
  fullAnalysisResult,
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

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') {
      return value;
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDefectsForImage = (imageId: string): Defect[] => {
    if (fullAnalysisResult) {
      const allDamages: Defect[] = [];
      
      // Convert the backend damage format to the frontend defect format
      if (fullAnalysisResult.damages) {
        Object.entries(fullAnalysisResult.damages).forEach(([damageType, damage]) => {
          if (damage) {
            damage.coordinates.forEach((coord, index) => {
              // Calculate center point for the defect marker
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

  const getPhysicalScore = (): number => {
    if (fullAnalysisResult) {
      return fullAnalysisResult.physical_condition;
    }
    return analysisResult?.physicalScore || 0;
  };

  const getLegalScore = (): number => {
    if (fullAnalysisResult) {
      return fullAnalysisResult.legal_status.percentage;
    }
    return analysisResult?.legalScore || 0;
  };

  const getLegalIssues = (): string[] => {
    if (fullAnalysisResult) {
      const issues: string[] = [];
      
      // Add insurance issues
      if (fullAnalysisResult.legal_status.insurance.status === 'invalid') {
        issues.push(`Insurance expired on ${fullAnalysisResult.legal_status.insurance.expiry_date}`);
      }
      
      // Add registration issues
      if (fullAnalysisResult.legal_status.registration.status === 'invalid') {
        issues.push(`Registration expired on ${fullAnalysisResult.legal_status.registration.expiry_date}`);
      }
      
      // Add unpaid challans
      fullAnalysisResult.legal_status.challans
        .filter(challan => challan.status === 'unpaid')
        .forEach(challan => {
          issues.push(`Unpaid challan: ${challan.fine_amount} from ${challan.date}`);
        });
      
      return issues;
    }
    
    return analysisResult?.legalIssues || [];
  };

  const getMarketValueRange = () => {
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

  const getRecommendedPrice = () => {
    if (fullAnalysisResult) {
      return fullAnalysisResult.market_value_range.recommended_price;
    }
    
    return analysisResult?.recommendedPrice || 0;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Car className="w-16 h-16 text-car-blue animate-pulse mb-4" />
          <h3 className="text-xl font-bold mb-2">Analyzing vehicle condition...</h3>
          <p className="text-sm text-gray-500 mb-6">This may take a minute or two</p>
          <Progress value={45} className="w-64 h-3" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult && !fullAnalysisResult) {
    return null;
  }

  const currentImage = images.find(img => img.id === selectedImage);
  const physicalScore = getPhysicalScore();
  const legalScore = getLegalScore();
  const marketValueRange = getMarketValueRange();
  const recommendedPrice = getRecommendedPrice();

  return (
    <Card className="shadow-xl border-t-4 border-t-car-blue bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-4">
        <CardTitle className="text-2xl text-car-blue flex items-center gap-2">
          <Car className="h-6 w-6" /> Vehicle Condition Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="visual" className="font-medium">
              Visual Analysis
            </TabsTrigger>
            <TabsTrigger value="scoring" className="font-medium">
              Condition Scores
            </TabsTrigger>
            <TabsTrigger value="pricing" className="font-medium">
              Pricing Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-base font-bold mb-3">Select Image</p>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    {images.map((image) => {
                      const defectCount = getDefectsForImage(image.id).length;
                      
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

                {fullAnalysisResult && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-base font-bold mb-2">Vehicle Info</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray-500">Make:</span>
                        <span className="font-medium">{fullAnalysisResult.vehicle.make}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="font-medium">{fullAnalysisResult.vehicle.model}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Color:</span>
                        <span className="font-medium">{fullAnalysisResult.vehicle.color}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Market Price:</span>
                        <span className="font-medium">{fullAnalysisResult.vehicle.price}</span>
                      </li>
                      {fullAnalysisResult.plate_number && (
                        <li className="flex justify-between">
                          <span className="text-gray-500">Number Plate:</span>
                          <span className="font-medium">{fullAnalysisResult.plate_number}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="col-span-2 space-y-4">
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
                    getDefectsForImage(selectedImage).map((defect) => (
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

                {selectedImage && getDefectsForImage(selectedImage).length > 0 ? (
                  <div className="bg-white p-4 rounded-lg border space-y-3">
                    <h4 className="font-bold mb-3 text-gray-800">Detected Issues:</h4>
                    <ul className="space-y-3">
                      {getDefectsForImage(selectedImage).map((defect) => (
                        <li key={defect.id} className="flex items-start p-3 bg-gray-50 rounded-lg text-sm">
                          <span
                            className={`inline-block w-3 h-3 rounded-full mt-1 mr-3 ${
                              defect.severity === 'high'
                                ? 'bg-red-500'
                                : defect.severity === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-orange-300'
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-gray-700 capitalize">{defect.type}</div>
                            <p className="text-gray-600">{defect.description}</p>
                            
                            {fullAnalysisResult?.damages?.[defect.type.toLowerCase()] && (
                              <div className="mt-1 text-xs text-gray-500">
                                Estimated repair cost: 
                                <span className="font-medium text-red-600 ml-1">
                                  {fullAnalysisResult.damages[defect.type.toLowerCase()]?.repair_cost}
                                </span>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-green-50 rounded-lg border border-dashed border-green-200">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No issues detected in this image</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="flex flex-col items-center">
                  <div className="car-gauge relative mb-6">
                    <div
                      className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
                      style={{ height: `${physicalScore}%` }}
                    />
                    <div className="car-gauge-text text-3xl">
                      <span className={getScoreColor(physicalScore)}>
                        {physicalScore}
                      </span>
                    </div>
                    <div className="absolute -bottom-4 left-0 right-0 text-center">
                      <span className="text-xs font-medium bg-white px-2 py-1 rounded-full shadow">Physical Condition</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-3 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Car className="w-5 h-5 text-car-blue" /> Physical Assessment
                    </h3>
                    
                    {fullAnalysisResult && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">Total Repair Cost: <span className="text-red-600">{fullAnalysisResult.total_repair_cost}</span></p>
                      </div>
                    )}
                    
                    <div className="mt-4 w-full space-y-2">
                      {getDefectsForImage(images[0]?.id || '').length > 0 ? (
                        <ul className="space-y-3">
                          {Object.entries(fullAnalysisResult?.damages || {}).map(([type, damage], index) => {
                            if (!damage) return null;
                            return (
                              <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <AlertCircle className={`w-5 h-5 ${damage.type === 'major' ? 'text-red-500' : 'text-orange-400'} mr-3`} />
                                <div>
                                  <span className="font-medium capitalize">{type}: </span>
                                  <span>{damage.description}</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Repair cost: <span className="text-red-600 font-medium">{damage.repair_cost}</span>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">Excellent physical condition</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="flex flex-col items-center">
                  <div className="car-gauge relative mb-6">
                    <div
                      className="car-gauge-indicator bg-gradient-to-t from-red-500 via-yellow-400 to-green-500"
                      style={{ height: `${legalScore}%` }}
                    />
                    <div className="car-gauge-text text-3xl">
                      <span className={getScoreColor(legalScore)}>
                        {legalScore}
                      </span>
                    </div>
                    <div className="absolute -bottom-4 left-0 right-0 text-center">
                      <span className="text-xs font-medium bg-white px-2 py-1 rounded-full shadow">Legal Status</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-3 mt-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-car-blue" /> Legal Assessment
                    </h3>
                    
                    <div className="mt-2 space-y-3">
                      {fullAnalysisResult && (
                        <>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Insurance</span>
                            <span className={fullAnalysisResult.legal_status.insurance.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                              {fullAnalysisResult.legal_status.insurance.status}
                            </span>
                          </div>
                          
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Registration</span>
                            <span className={fullAnalysisResult.legal_status.registration.status === 'valid' ? 'text-green-500' : 'text-red-500'}>
                              {fullAnalysisResult.legal_status.registration.status}
                            </span>
                          </div>
                          
                          {fullAnalysisResult.legal_status.challans.length > 0 && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium mb-2">Pending Challans</p>
                              <ul className="space-y-2 text-sm">
                                {fullAnalysisResult.legal_status.challans.map((challan, idx) => (
                                  <li key={idx} className="flex justify-between">
                                    <span>{challan.date}</span>
                                    <span className={challan.status === 'paid' ? 'text-green-500' : 'text-red-500'}>
                                      {challan.fine_amount} - {challan.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                      
                      {getLegalIssues().length > 0 ? (
                        <ul className="space-y-2 mt-4">
                          {getLegalIssues().map((issue, index) => (
                            <li key={index} className="flex items-center">
                              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">All legal documents in order</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="p-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md border">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-car-blue" /> Market Value Range
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Low</span>
                  <span>Average</span>
                  <span>High</span>
                </div>
                <div className="relative h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-md mb-3">
                  <div
                    className="absolute w-5 h-10 bg-black transform -translate-x-1/2 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${(
                        typeof recommendedPrice === 'string' 
                          ? 50  // Default to middle if string
                          : ((recommendedPrice - parseInt(marketValueRange.low.toString().replace(/[^0-9]/g, ''))) /
                             (parseInt(marketValueRange.high.toString().replace(/[^0-9]/g, '')) - parseInt(marketValueRange.low.toString().replace(/[^0-9]/g, '')))) * 100
                      )}%`,
                      top: '0',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>{marketValueRange.low}</span>
                  <span>{marketValueRange.average}</span>
                  <span>{marketValueRange.high}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-car-blue shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-car-blue flex items-center gap-2">
                    <DollarSign className="w-6 h-6" /> Recommended Purchase Price
                  </h3>
                  <div className="text-3xl font-bold text-car-blue">
                    {formatCurrency(recommendedPrice)}
                  </div>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-car-blue shrink-0 mt-0.5 mr-3" />
                    <p className="text-gray-700">
                      This price takes into account the vehicle's physical condition, legal status, and current market value.
                    </p>
                  </div>
                  
                  {fullAnalysisResult && (
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                      <div>
                        <p className="text-gray-700">
                          <strong>Value Assessment:</strong> This price accounts for all detected damages and legal issues.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Total repair cost: <span className="text-red-600 font-medium">{fullAnalysisResult.total_repair_cost}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {typeof marketValueRange.average === 'number' && typeof recommendedPrice === 'number' && (
                    marketValueRange.average > recommendedPrice ? (
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5 mr-3" />
                        <p className="text-gray-700">
                          This car is <strong>underpriced by approximately {formatCurrency(marketValueRange.average - recommendedPrice)}</strong> compared to market average.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5 mr-3" />
                        <p className="text-gray-700">
                          This car is <strong>overpriced by approximately {formatCurrency(recommendedPrice - marketValueRange.average)}</strong> compared to market average.
                        </p>
                      </div>
                    )
                  )}
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <p className="text-sm text-gray-500 mb-1">Physical Score</p>
                    <p className={`font-bold text-lg ${getScoreColor(physicalScore)}`}>{physicalScore}/100</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <p className="text-sm text-gray-500 mb-1">Legal Score</p>
                    <p className={`font-bold text-lg ${getScoreColor(legalScore)}`}>{legalScore}/100</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <p className="text-sm text-gray-500 mb-1">Market Position</p>
                    <p className="font-bold text-lg text-car-blue">Fair Price</p>
                  </div>
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
