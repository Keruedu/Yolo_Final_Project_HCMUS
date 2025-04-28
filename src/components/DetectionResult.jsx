import React from 'react';

const DetectionResult = ({ imageUrl, detections }) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Detection Result</h2>
            <img src={imageUrl} alt="Detected" className="max-w-full h-auto" />
            {detections && detections.length > 0 && (
                <div className="mt-4">
                    {detections.map((detection, index) => (
                        <div key={index} className="absolute" style={{
                            border: '2px solid red',
                            left: detection.x,
                            top: detection.y,
                            width: detection.width,
                            height: detection.height,
                        }}>
                            <span className="bg-white text-black p-1">
                                {detection.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetectionResult;