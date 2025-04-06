import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export type CarFormData = {
  make: string;
  model: string;
  year: number;
  color: string;
  kilometers: number;
  fuelType: string;
  transmission: string;
  numberPlate: string;
};

type CarFormProps = {
  onSubmit: (data: CarFormData) => void;
  initialData?: Partial<CarFormData>;
};

const CarForm: React.FC<CarFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CarFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    kilometers: 0,
    fuelType: '',
    transmission: '',
    numberPlate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Create JSX for required symbol
  const requiredField = <span className="text-red-500 ml-1">*</span>;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Make{requiredField}
          </label>
          <input
            id="make"
            name="make"
            type="text"
            required
            value={formData.make}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
        
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model{requiredField}
          </label>
          <input
            id="model"
            name="model"
            type="text"
            required
            value={formData.model}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year{requiredField}
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            min="1900"
            max={new Date().getFullYear()}
            value={formData.year}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color{requiredField}
          </label>
          <input
            id="color"
            name="color"
            type="text"
            required
            value={formData.color}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
        
        <div>
          <label htmlFor="kilometers" className="block text-sm font-medium text-gray-700 mb-1">
            Kilometers{requiredField}
          </label>
          <input
            id="kilometers"
            name="kilometers"
            type="number"
            required
            min="0"
            value={formData.kilometers}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
        
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type{requiredField}
          </label>
          <select
            id="fuelType"
            name="fuelType"
            required
            value={formData.fuelType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          >
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="CNG">CNG</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
            Transmission{requiredField}
          </label>
          <select
            id="transmission"
            name="transmission"
            required
            value={formData.transmission}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          >
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="numberPlate" className="block text-sm font-medium text-gray-700 mb-1">
            Number Plate{requiredField}
          </label>
          <input
            id="numberPlate"
            name="numberPlate"
            type="text"
            required
            value={formData.numberPlate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-car-blue"
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button type="submit" className="bg-car-blue hover:bg-car-blue/90">
          Analyze Car Condition
        </Button>
      </div>
    </form>
  );
};

export default CarForm;
