
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUpload, { UploadedImage } from '@/components/ImageUpload';
import CarForm, { CarFormData } from '@/components/CarForm';
import ConditionAnalysis, { AnalysisResult, FullAnalysisResult } from '@/components/ConditionAnalysis';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Car, Database, ShieldCheck, Gauge, DollarSign } from 'lucide-react';
import { uploadImageForFullAnalysis } from '@/services/api';

// Mock data for demonstration purposes
const mockAnalysisResult: AnalysisResult = {
  physicalScore: 78,
  legalScore: 95,
  marketValue: {
    low: 850000,
    average: 950000,
    high: 1050000,
  },
  recommendedPrice: 920000,
  defects: [
    {
      id: '1',
      type: 'Dent',
      severity: 'medium',
      description: 'Medium-sized dent on the rear bumper',
      position: { x: 0.65, y: 0.75 },
      imageId: 'img1', // This should match the id of the uploaded image
    },
    {
      id: '2',
      type: 'Scratch',
      severity: 'low',
      description: 'Light scratch on the driver side door',
      position: { x: 0.4, y: 0.5 },
      imageId: 'img1',
    },
    {
      id: '3',
      type: 'Headlight',
      severity: 'high',
      description: 'Broken right headlight',
      position: { x: 0.2, y: 0.3 },
      imageId: 'img2',
    },
  ],
  legalIssues: [
    'Unpaid parking fine: ₹500',
  ],
};

const Index: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [carFormData, setCarFormData] = useState<CarFormData | null>(null);
  const [initialCarData, setInitialCarData] = useState<Partial<CarFormData> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>(undefined);
  const [fullAnalysisResult, setFullAnalysisResult] = useState<FullAnalysisResult | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const { toast } = useToast();

  const handleImagesUploaded = (uploadedImages: UploadedImage[]) => {
    setImages(uploadedImages);
    
    // Auto-advance to next step if we have images
    if (uploadedImages.length > 0 && step === 1) {
      setStep(2);
    }
  };

  const handleCarFormSubmit = async (data: CarFormData) => {
    setCarFormData(data);
    setStep(3);
    
    // Start loading
    setLoading(true);
    
    try {
      // Use the first image for analysis
      if (images.length > 0) {
        // Call backend API for full analysis
        const response = await uploadImageForFullAnalysis(images[0].file, data);
        
        if (response.status === 'success') {
          setFullAnalysisResult(response.data);
          
          // To handle backward compatibility, also populate the old analysisResult format
          const legalIssues: string[] = [];
          
          if (response.data.legal_status.insurance.status === 'invalid') {
            legalIssues.push(`Insurance expired on ${response.data.legal_status.insurance.expiry_date}`);
          }
          
          response.data.legal_status.challans
            .filter(challan => challan.status === 'unpaid')
            .forEach(challan => {
              legalIssues.push(`Unpaid challan: ${challan.fine_amount} from ${challan.date}`);
            });
          
          // Construct defects from damage data
          const defects = [];
          if (response.data.damages) {
            Object.entries(response.data.damages).forEach(([type, damage]) => {
              if (damage) {
                damage.coordinates.forEach((coord, index) => {
                  const centerX = (coord.x1 + coord.x2) / 2 / 100;
                  const centerY = (coord.y1 + coord.y2) / 2 / 100;
                  
                  defects.push({
                    id: `${type}-${index}`,
                    type,
                    severity: damage.type === 'major' ? 'high' : 'low',
                    description: damage.description,
                    position: { x: centerX, y: centerY },
                    imageId: images[0].id,
                  });
                });
              }
            });
          }
          
          // Parse market values to integers for calculation
          const parsePrice = (price: string) => {
            return parseInt(price.replace(/[^0-9]/g, '')) || 0;
          };
          
          setAnalysisResult({
            physicalScore: response.data.physical_condition,
            legalScore: response.data.legal_status.percentage,
            marketValue: {
              low: parsePrice(response.data.market_value_range.low_price),
              average: parsePrice(response.data.market_value_range.average_price),
              high: parsePrice(response.data.market_value_range.high_price),
            },
            recommendedPrice: parsePrice(response.data.market_value_range.recommended_price),
            defects,
            legalIssues,
          });
          
          toast({
            title: "Analysis Complete",
            description: "Your vehicle analysis report is ready to view.",
          });
        } else {
          throw new Error("Failed to analyze vehicle");
        }
      } else {
        // Fallback to mock data if no images
        setAnalysisResult(mockAnalysisResult);
        
        toast({
          title: "Using Demo Data",
          description: "No images provided, showing demo analysis.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Fallback to mock data
      setAnalysisResult(mockAnalysisResult);
      
      toast({
        title: "Analysis Error",
        description: "Failed to analyze vehicle. Using demo data instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCarDetailsDetected = (carData: any) => {
    if (!carData) return;
    
    const mappedData: Partial<CarFormData> = {};
    
    // Map detected values to form fields
    if (carData.make) mappedData.make = carData.make;
    if (carData.model) mappedData.model = carData.model;
    if (carData.color) mappedData.color = carData.color;
    if (carData.fuel_type) mappedData.fuelType = carData.fuel_type;
    if (carData.transmission) mappedData.transmission = carData.transmission;
    if (carData.number_plate) mappedData.numberPlate = carData.number_plate;
    
    // Set initial car data for form
    setInitialCarData(mappedData);
  };

  const resetAnalysis = () => {
    setImages([]);
    setCarFormData(null);
    setInitialCarData(null);
    setAnalysisResult(undefined);
    setFullAnalysisResult(undefined);
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        {step === 1 && (
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-car-blue">KARE</span> V-Analyser: Smart Used Car Analysis
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Upload car images and get instant AI analysis on condition, legal status, and fair pricing.
                </p>
                <Button 
                  size="lg" 
                  className="bg-car-blue hover:bg-car-blue/90 text-white shadow-lg hover:shadow-xl transition-all" 
                  onClick={() => window.scrollTo(0, document.getElementById('analysis-section')?.offsetTop || 0)}
                >
                  Start Your Analysis
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {step === 1 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 rounded-full p-4 mb-4 shadow-md">
                    <Car className="w-8 h-8 text-car-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Car Images</h3>
                  <p className="text-gray-600">Upload multiple photos of the car from different angles.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 rounded-full p-4 mb-4 shadow-md">
                    <Database className="w-8 h-8 text-car-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Enter Car Details</h3>
                  <p className="text-gray-600">Provide basic information about the car model and history.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 rounded-full p-4 mb-4 shadow-md">
                    <ShieldCheck className="w-8 h-8 text-car-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-600">Our AI detects defects and verifies legal status.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-50 rounded-full p-4 mb-4 shadow-md">
                    <DollarSign className="w-8 h-8 text-car-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Price Insights</h3>
                  <p className="text-gray-600">Receive a fair price recommendation based on condition.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Analysis Section */}
        <section id="analysis-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-car-blue text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                      1
                    </div>
                    <span className="text-sm font-medium">Upload Images</span>
                  </div>
                  
                  <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-car-blue' : 'bg-gray-200'}`} />
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-car-blue text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                      2
                    </div>
                    <span className="text-sm font-medium">Car Details</span>
                  </div>
                  
                  <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-car-blue' : 'bg-gray-200'}`} />
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-car-blue text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                      3
                    </div>
                    <span className="text-sm font-medium">Analysis Results</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Image Upload */}
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-xl p-6 animate-fade-in border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6 text-car-blue">Upload Car Images</h2>
                  <p className="text-gray-600 mb-6">
                    Upload clear, well-lit photos of the car from different angles for the best analysis results.
                    Include exterior shots, interior, engine bay, and any areas with visible damage.
                  </p>
                  <ImageUpload 
                    onImagesUploaded={handleImagesUploaded} 
                    onCarDetailsDetected={handleCarDetailsDetected}
                  />
                </div>
              )}

              {/* Step 2: Car Details Form */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-car-blue">Car Details</h2>
                    <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                      Back to Images
                    </Button>
                  </div>
                  <CarForm 
                    onSubmit={handleCarFormSubmit}
                    initialData={initialCarData || undefined}
                  />
                </div>
              )}

              {/* Step 3: Analysis Results */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-car-blue">Analysis Results</h2>
                    <Button variant="outline" size="sm" onClick={resetAnalysis}>
                      Start New Analysis
                    </Button>
                  </div>
                  <ConditionAnalysis 
                    images={images} 
                    analysisResult={analysisResult} 
                    fullAnalysisResult={fullAnalysisResult}
                    loading={loading} 
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {step === 1 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-car-blue">RS</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Rahul Sharma</h4>
                      <p className="text-sm text-gray-500">First-time car buyer</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "This tool saved me from buying a car with hidden damage. The AI detected issues the seller didn't disclose, and I negotiated a better price."
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-car-blue">PP</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Priya Patel</h4>
                      <p className="text-sm text-gray-500">Car enthusiast</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "I've bought several used cars, but this analysis is game-changing. The fair price estimation is spot-on, and the legal check saved me from paperwork headaches."
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-car-blue">AG</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Arun Gupta</h4>
                      <p className="text-sm text-gray-500">Car dealer</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "As a small dealership owner, this tool helps me accurately price my inventory. The detailed condition reports build trust with my customers."
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
