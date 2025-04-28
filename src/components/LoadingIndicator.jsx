import React from 'react';
import { Spin } from 'antd';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <Spin size="large" />
        </div>
    );
};

export default LoadingIndicator;