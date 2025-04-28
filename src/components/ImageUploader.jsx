import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ImageUploader = () => {
    const [file, setFile] = useState(null);

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            message.error('Please upload an image before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle the response (e.g., navigate to the result page or update state)
            console.log(response.data);
        } catch (error) {
            message.error('Error uploading image.');
        }
    };

    return (
        <div className="image-uploader">
            <Upload
                beforeUpload={(file) => {
                    setFile(file);
                    return false; // Prevent automatic upload
                }}
                onChange={handleChange}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-4">
                Submit
            </Button>
        </div>
    );
};

export default ImageUploader;