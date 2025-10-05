import React, { useState, useEffect } from 'react';
import { ChargingRecommendation, VehicleTelemetry } from '../types';
import { 
    LightBulbIcon, 
    ExclamationTriangleIcon, 
    SparklesIcon,
    Battery50Icon,
    BoltSlashIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

const priorityConfig = {
  High: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />,
    borderColor: 'border-red-500/50',
  },
  Medium: {
    icon: <LightBulbIcon className="h-6 w-6 text-yellow-400" />,
    borderColor: 'border-yellow-500/50',
  },
  Low: {
    icon: <LightBulbIcon className="h-6 w-6 text-blue-400" />,
    borderColor: 'border-blue-500/50',
  },
};

const BEST_PRACTICES = [
  { 
    id: 'bp1', 
    text: 'For daily use, try keeping your charge between 20-80% to maximize long-term battery lifespan.', 
    icon: Battery50Icon 
  },
  { 
    id: 'bp2', 
    text: 'Limit the use of DC fast chargers. Slower AC charging is gentler on the battery and generates less heat.', 
    icon: BoltSlashIcon 
  },
  { 
    id: 'bp3', 
    text: 'Avoid leaving your vehicle parked with a very low or 100% full charge for extended periods.', 
    icon: ClockIcon 
  },
];

interface ChargingRecommendationsProps {
  telemetry: VehicleTelemetry;
  bhi: number;
}

const generateLocalRecommendations = (telemetry: VehicleTelemetry, bhi: number): ChargingRecommendation[] => {
    const recs: ChargingRecommendation[] = [];

    if (telemetry.pack_temp > 45) {
        recs.push({
            id: 'temp_high',
            title: 'High Temperature: Switch to Slow Charging',
            reason: `Your battery pack is hot (${telemetry.pack_temp.toFixed(1)}°C). Fast charging will generate more heat and accelerate degradation. Use a slower charger.`,
            priority: 'High',
        });
    }

    if (telemetry.ambient.temp > 30 && telemetry.charging_state === 'charging') {
         recs.push({
            id: 'ambient_high',
            title: 'Hot Weather: Charge During Cooler Hours',
            reason: `Charging in high ambient temperatures (${telemetry.ambient.temp.toFixed(1)}°C) stresses the battery. It's better to charge during cooler periods, like overnight.`,
            priority: 'Medium',
        });
    }
    
    if (telemetry.soc < 20) {
        recs.push({
            id: 'soc_low',
            title: 'Low Battery: Plan to Charge Soon',
            reason: `Your battery is low (${telemetry.soc.toFixed(1)}%). Avoid deep discharging by planning for a slow, steady charge to preserve battery health.`,
            priority: 'Medium',
        });
    }
    
    if (telemetry.charging_state === 'charging' && telemetry.soc > 85) {
        recs.push({
            id: 'soc_high_charging',
            title: 'Optimize Charge Limit to 90%',
            reason: `Your battery is nearly full (${telemetry.soc.toFixed(1)}%). For daily use, charging to only 90% can significantly improve its long-term health and lifespan.`,
            priority: 'Low',
        });
    }

    if (bhi < 75) {
        recs.push({
            id: 'bhi_low',
            title: 'Prioritize Battery Health',
            reason: `Your battery's health index is declining. Prefer slow charging whenever possible to extend its lifespan and maintain performance.`,
            priority: 'Medium',
        });
    }

    return recs.slice(0, 3); // Max 3 recommendations
};


const ChargingRecommendations: React.FC<ChargingRecommendationsProps> = ({ telemetry, bhi }) => {
  const [recommendations, setRecommendations] = useState<ChargingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = () => {
      setLoading(true);
      setError(null);
      // Simulate async call for local generation
      setTimeout(() => {
        try {
          const data = generateLocalRecommendations(telemetry, bhi);
          setRecommendations(data);
        } catch (e) {
          console.error("Error generating local recommendations:", e);
          setError("Failed to generate recommendations.");
        } finally {
          setLoading(false);
        }
      }, 500);
    };

    if (telemetry && bhi) {
        fetchRecommendations();
    }
  }, [telemetry, bhi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <SparklesIcon className="h-6 w-6 mr-2 animate-pulse text-cyan-400" />
        Generating AI-powered recommendations...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center">{error}</div>;
  }

  return (
    <div className="max-h-80 overflow-y-auto pr-2">
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const config = priorityConfig[rec.priority];
            return (
              <div key={rec.id} className={`flex items-start space-x-4 p-4 rounded-lg bg-gray-800/60 border ${config.borderColor} animate-fade-in`}>
                <div className="flex-shrink-0 mt-1">{config.icon}</div>
                <div>
                  <p className="font-semibold text-gray-100">{rec.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{rec.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-center mb-4">
          No specific recommendations at this time. Standard charging is advised.
        </div>
      )}

      <div className="pt-4 mt-4 border-t border-gray-700/50">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">General Best Practices</h4>
        <div className="space-y-3">
          {BEST_PRACTICES.map(tip => (
             <div key={tip.id} className="flex items-start space-x-3">
                <tip.icon className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{tip.text}</p>
             </div>
          ))}
        </div>
      </div>
       
      <p className="text-xs text-gray-500 text-center pt-4">Powered by DynamoX AI.</p>
    </div>
  );
};

export default ChargingRecommendations;