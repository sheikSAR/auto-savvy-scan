
import axios from 'axios';
import { CarFormData } from '@/components/CarForm';

const API_URL = 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadImageForCarDetails = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/identify_car_details', formData);
    return response.data;
  } catch (error) {
    console.error('Error identifying car details:', error);
    throw error;
  }
};

export const uploadImageForFullAnalysis = async (file: File, carDetails: CarFormData) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Append all car details to the form data
  Object.entries(carDetails).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  try {
    const response = await apiClient.post('/identify_all_details', formData);
    return response.data;
  } catch (error) {
    console.error('Error identifying car damages:', error);
    throw error;
  }
};
