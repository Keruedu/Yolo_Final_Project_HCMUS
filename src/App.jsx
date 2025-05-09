import React, { useState } from 'react';
import { Upload, Button, notification, Dropdown } from 'antd';
import { DownOutlined, ClearOutlined, UploadOutlined } from '@ant-design/icons';
import LoadingIndicator from './components/LoadingIndicator';
import DetectionStats from './components/DetectionStats';
import { detectObjects } from './services/api';

// Set global notification config
notification.config({
  placement: 'topRight',
  duration: 4,
});

const modelItems = [
  { key: 'yolov5', label: 'YOLO v5' },
  { key: 'yolov8', label: 'YOLO v8' },
  { key: 'yolov8-trained', label: 'YOLO v8 (train dataset fruits)' },
];

const App = () => {
  const [loading, setLoading] = useState(false);
  const [sourceImage, setSourceImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('yolov5');

  // Use Ant Design notification hook
  const [api, contextHolder] = notification.useNotification();

  const processImage = async (file) => {
    setLoading(true);
    try {
      const response = await detectObjects(file, selectedModel);
      const imageData = response.data.image || response.data.imageData;
      const imageUrl = `data:image/jpeg;base64,${imageData}`;
      setResultImage(imageUrl);
      setDetectedObjects(response.data.detections || []);
      api.success({
        message: 'Thành công',
        description: 'Xử lý ảnh thành công!',
      });
    } catch (error) {
      console.error('Error:', error);
      api.error({
        message: 'Lỗi',
        description: 'Xử lý ảnh thất bại!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      api.error({
        message: 'Lỗi',
        description: 'Chỉ được phép tải lên file ảnh!',
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      api.error({
        message: 'Lỗi',
        description: 'Dung lượng ảnh tối đa là 10MB!',
      });
      return false;
    }
    setImageFile(file);
    setSourceImage(URL.createObjectURL(file));
    return false;
  };

  const handleSubmit = () => {
    if (!imageFile) {
      api.warning({
        message: 'Thiếu ảnh',
        description: 'Vui lòng chọn ảnh trước khi submit!',
      });
      return;
    }
    processImage(imageFile);
  };

  const handleClear = () => {
    setSourceImage(null);
    setResultImage(null);
    setDetectedObjects([]);
    setImageFile(null);
  };

  const handleMenuClick = (e) => {
    setSelectedModel(e.key);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {contextHolder}
      <h1 className="text-4xl font-bold text-center mb-4">YOLO Object Detector</h1>
      <div className="flex justify-center mb-6">
        <Dropdown
          menu={{
            items: modelItems,
            onClick: handleMenuClick,
          }}
          placement="bottom"
        >
          <Button>
            {modelItems.find((item) => item.key === selectedModel)?.label || 'Chọn model'} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
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
            className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center overflow-hidden"
          >
            {sourceImage ? (
              <img src={sourceImage} alt="Source" className="object-contain max-h-full max-w-full" />
            ) : (
              <div className="flex flex-col items-center">
                <UploadOutlined style={{ fontSize: '2rem', color: 'white' }} />
                <p className="text-white mt-4">Drop Image Here</p>
                <p className="text-gray-400">- or -</p>
                <p className="text-white">Click to Upload</p>
              </div>
            )}
          </Upload.Dragger>
          <div className="flex justify-between mt-4">
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClear}
              className="w-1/2 mr-2 bg-gray-700 text-white border-none h-10 rounded-lg"
              disabled={loading}
            >
              Clear
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              className="w-1/2 ml-2 bg-blue-600 text-white border-none h-10 rounded-lg"
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center overflow-hidden">
            {loading ? (
              <LoadingIndicator />
            ) : resultImage ? (
              <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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