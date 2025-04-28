import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { ClearOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import LoadingIndicator from './components/LoadingIndicator';
import DetectionStats from './components/DetectionStats';
import notify from './components/Notifications';
import { detectObjects } from './services/api';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [sourceImage, setSourceImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [imageFile, setImageFile] = useState(null); // Store the actual file object

  // Process the image through the detection API
  const processImage = async (file) => {
    setLoading(true);
    
    // Show a loading notification
    const loadingNotification = notify.loading('Processing Image', 'Please wait while we detect objects in your image...');
    
    try {
      // Use the API service instead of direct axios call
      const response = await detectObjects(file);
      
      setResultImage(response.data.imageUrl);
      setDetectedObjects(response.data.detections || []);
      
      // Close the loading notification
      notification.close(loadingNotification);
      
      // Show success
      notify.success('Detection Complete', `Found ${response.data.detections.length} objects in your image!`);
    } catch (error) {
      console.error('Error:', error);
      
      // Close the loading notification
      notification.close(loadingNotification);
      
      // Show error
      notify.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle initial file upload
  const handleUpload = (file) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      notify.warning('Invalid File', 'Please upload an image file (JPEG, PNG, etc.)');
      return false;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      notify.warning('File Too Large', 'Please upload an image smaller than 10MB');
      return false;
    }
    
    setImageFile(file);
    setSourceImage(URL.createObjectURL(file));
    notify.info('Image Ready', 'Click "Submit" to detect objects in your image');
    return false; // Prevent default upload behavior
  };

  // Handle the submit button click
  const handleSubmit = () => {
    if (!imageFile) {
      notify.warning('Missing Image', 'Please select an image first.');
      return;
    }
    processImage(imageFile);
  };

  const handleClear = () => {
    setSourceImage(null);
    setResultImage(null);
    setDetectedObjects([]);
    setImageFile(null);
    notify.info('Cleared', 'All images have been cleared.');
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-4">YOLO v3 Object Detector</h1>
      
      <p className="text-center mb-8">
        Welcome to my object detection web application. Simply upload an image and let the model do the rest! 
        It will quickly identify and locate objects within the image and classify them into one of the 
        <span className="text-blue-400"> 80 classes</span>.
        The model is based on <span className="text-blue-400">YOLOv3</span> and was trained on a massive dataset 
        called <span className="text-blue-400">COCO</span>, which made it one of the fastest and most accurate 
        object detectors available.
      </p>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Panel - Upload Area */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="bg-blue-600 text-white rounded p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
              </svg>
            </div>
            <span>source_img</span>
          </div>
          
          <Upload.Dragger
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            accept="image/*"
            className="bg-gray-800 border border-gray-700 rounded-lg p-8  flex flex-col items-center justify-center overflow-hidden"
          >
            {sourceImage ? (
              <img src={sourceImage} alt="Source" className="object-contain max-h-full max-w-full" />
            ) : (
              <>

                <div className="flex flex-col items-center">
                  <UploadOutlined style={{ fontSize: '2rem', color: 'white' }} />
                  <p className="text-white mt-4">Drop Image Here</p>
                  <p className="text-gray-400">- or -</p>
                  <p className="text-white">Click to Upload</p>
                </div>
              </>
            )}
          </Upload.Dragger>
          
          <div className="flex justify-between mt-4">
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
              className="w-1/2 mr-2 bg-gray-700 text-white border-none h-10"
              disabled={loading}
            >
              Clear
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              className="w-1/2 ml-2 bg-blue-600 text-white border-none h-10"
              disabled={!imageFile || loading}
              loading={loading}
            >
              {loading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </div>

        {/* Right Panel - Results Area */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="bg-blue-600 text-white rounded p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
              </svg>
            </div>
            <span>Image with detected objects</span>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg h-64 flex items-center justify-center">
            {loading ? (
              <LoadingIndicator />
            ) : resultImage ? (
              <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          
          {detectedObjects.length > 0 && (
            <div className="mt-4">
              <DetectionStats detectedObjects={detectedObjects} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;