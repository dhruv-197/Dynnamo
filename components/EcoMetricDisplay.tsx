import React from 'react';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';

interface EcoMetricDisplayProps {
  carbonImpact: number;
}

const EcoMetricDisplay: React.FC<EcoMetricDisplayProps> = ({ carbonImpact }) => {
  const impactLevel = carbonImpact > 15 ? 'high' : carbonImpact > 10 ? 'medium' : 'low';
  
  const config = {
    low: { color: 'text-green-400', message: 'Your charging pattern is eco-friendly with minimal carbon impact.' },
    medium: { color: 'text-yellow-400', message: `Your current charging adds ${carbonImpact.toFixed(0)}% extra carbon impact compared to optimized charging.` },
    high: { color: 'text-orange-400', message: `Your current charging adds ${carbonImpact.toFixed(0)}% extra carbon impact compared to optimized charging.` }
  };

  const currentConfig = config[impactLevel];

  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg bg-gray-900/50">
      <div className="flex-shrink-0">
        <GlobeEuropeAfricaIcon className={`h-7 w-7 ${currentConfig.color}`} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-200">Eco-Metric BHI</p>
        <p className={`text-sm ${currentConfig.color}`}>
          {currentConfig.message}
        </p>
      </div>
    </div>
  );
};

export default EcoMetricDisplay;
