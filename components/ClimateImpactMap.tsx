

import React from 'react';
import { RegionalClimateImpact, ClimateRiskLevel } from '../types';

const riskLevelConfig = {
  [ClimateRiskLevel.Severe]: 'bg-red-600/70 border-red-400',
  [ClimateRiskLevel.High]: 'bg-orange-500/70 border-orange-400',
  [ClimateRiskLevel.Moderate]: 'bg-yellow-500/70 border-yellow-400',
  [ClimateRiskLevel.Low]: 'bg-green-500/70 border-green-400',
};

const ClimateImpactMap: React.FC<{ data: RegionalClimateImpact[] }> = ({ data }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4">
            {data.map((item) => (
                <div key={item.region} className={`relative p-4 rounded-lg flex items-center justify-center text-center text-white font-bold text-sm sm:text-base border-2 transition-transform transform hover:scale-105 ${riskLevelConfig[item.riskLevel]}`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <span className="relative z-10">{item.region}</span>
                </div>
            ))}
        </div>
        <div className="lg:w-1/3 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-3 text-gray-300">Legend &amp; Key Factors</h3>
            <div className="space-y-2">
                {Object.entries(riskLevelConfig).map(([level, className]) => (
                    <div key={level} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${className.split(' ')[0]}`}></div>
                        <span className="text-sm text-gray-400">{level}</span>
                    </div>
                ))}
            </div>
             <p className="text-sm text-gray-500 mt-4">Factors include extreme temperatures, humidity, coastal salinity, and monsoon intensity.</p>
        </div>
    </div>
  );
};

export default ClimateImpactMap;