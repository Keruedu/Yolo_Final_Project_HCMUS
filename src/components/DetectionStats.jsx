import React from 'react';

const DetectionStats = ({ detectedObjects }) => {
    // Count objects by category and calculate average confidence
    const objectStats = detectedObjects.reduce((acc, obj) => {
        if (!acc[obj.label]) {
            acc[obj.label] = {
                count: 0,
                totalConfidence: 0,
                confidences: []
            };
        }
        acc[obj.label].count += 1;
        acc[obj.label].totalConfidence += obj.confidence;
        acc[obj.label].confidences.push(obj.confidence);
        return acc;
    }, {});

    return (
        <div className="text-white">
            <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
            <p>Total objects detected: {detectedObjects.length}</p>
            
            <h4 className="font-medium mt-2 mb-1">Objects by category:</h4>
            <ul className="list-disc pl-5">
                {Object.entries(objectStats).map(([category, stats]) => {
                    const avgConfidence = stats.totalConfidence / stats.count;
                    return (
                        <li key={category} className="text-blue-400 mb-2">
                            <div>{category}: {stats.count}</div>
                            <div className="text-sm text-gray-400 ml-2">
                                Average confidence: {(avgConfidence * 100).toFixed(2)}%
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-700 rounded-full h-2 mr-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${avgConfidence * 100}%` }}
                                        ></div>
                                    </div>
                                    {(avgConfidence * 100).toFixed(2)}%
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default DetectionStats;