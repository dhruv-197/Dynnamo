import React from 'react';

interface BHIDisplayProps {
  bhi: number;
}

const BHIDisplay: React.FC<BHIDisplayProps> = ({ bhi }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (bhi / 100) * circumference;

  const getColor = () => {
    if (bhi > 75) return 'text-green-400';
    if (bhi > 50) return 'text-yellow-400';
    return 'text-red-500';
  };
  
  const getStrokeColor = () => {
    if (bhi > 75) return '#4ade80'; // green-400
    if (bhi > 50) return '#facc15'; // yellow-400
    return '#ef4444'; // red-500
  };

  const getHealthStatus = () => {
    if (bhi > 75) return 'Healthy';
    if (bhi > 50) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-56 h-56">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <circle
          className="text-gray-700"
          strokeWidth="15"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
        />
        <circle
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getStrokeColor()}
          fill="transparent"
          r={radius}
          cx="100"
          cy="100"
          className="transform -rotate-90 origin-center transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-bold ${getColor()}`}>{bhi.toFixed(1)}</span>
        <span className="text-gray-400 text-lg">{getHealthStatus()}</span>
      </div>
    </div>
  );
};

export default BHIDisplay;