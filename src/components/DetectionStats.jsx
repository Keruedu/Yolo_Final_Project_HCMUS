import React from 'react';

const DetectionStats = ({ detectedObjects }) => {
    // Count objects by category
    const objectsByCategory = detectedObjects.reduce((acc, obj) => {
        acc[obj.label] = (acc[obj.label] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="text-white">
            <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
            <p>Total objects detected: {detectedObjects.length}</p>
            
            <h4 className="font-medium mt-2 mb-1">Objects by category:</h4>
            <ul className="list-disc pl-5">
                {Object.entries(objectsByCategory).map(([category, count]) => (
                    <li key={category} className="text-blue-400">
                        {category}: {count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetectionStats;