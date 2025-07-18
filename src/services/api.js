import axios from 'axios';

// Configure the API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Function to detect objects in an image
export const detectObjects = async (imageFile, model) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('model', model); // truyền model từ tham số
  return await axios.post(`${API_URL}/predict?json_response=true`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};