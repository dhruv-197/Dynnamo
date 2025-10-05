
import React, { useState, useEffect } from 'react';
import { VehicleTelemetry } from '../types';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface AIChargingRecommendation {
  id: string;
  strategy: string;
  description: string;
  expected_gain: string;
}

interface RLStrategyRecommendationProps {
  telemetry: VehicleTelemetry;
  bhi: number;
}

const generateLocalStrategy = (telemetry: VehicleTelemetry, bhi: number): AIChargingRecommendation[] => {
    const strategies: AIChargingRecommendation[] = [];

    // Critical safety-first strategy
    if (telemetry.pack_temp > 45) {
        strategies.push({
            id: 'strat_pause',
            strategy: 'Pause Charging (Critical)',
            description: 'Critical pack temperature detected. Pausing charging immediately minimizes the risk of thermal runaway and protects battery cells from permanent damage.',
            expected_gain: 'Prevents critical damage',
        });
    }

    // High temperature strategies
    if (telemetry.pack_temp > 40 || (telemetry.ambient.temp > 30 && telemetry.charging_state === 'charging')) {
        strategies.push({
            id: 'strat_slow',
            strategy: 'Slow Charging',
            description: 'High pack or ambient temperature detected. Switching to slow charging reduces heat generation, which lowers thermal stress and preserves long-term battery health.',
            expected_gain: 'Reduces thermal stress',
        });
    }
    
    if (telemetry.ambient.temp > 30 && telemetry.soc > 60) {
        strategies.push({
            id: 'strat_delay',
            strategy: 'Delayed Charging',
            description: 'It is warm outside and the battery has sufficient charge. Delaying charging until ambient temperatures drop (e.g., overnight) is the optimal strategy to avoid unnecessary heat stress.',
            expected_gain: 'Avoids heat stress',
        });
    }

    // Health-based strategies
    if (bhi < 80) {
        strategies.push({
            id: 'strat_health_priority',
            strategy: 'Health Priority Mode',
            description: 'BHI is declining. Use slow charging and set a charge limit of 85% to significantly reduce battery wear and extend its overall lifespan.',
            expected_gain: '+0.5 BHI points/month',
        });
    }

    if (telemetry.charging_state === 'charging' && telemetry.soc > 90) {
        strategies.push({
            id: 'strat_soc_limit',
            strategy: 'Set 90% Charge Limit',
            description: 'Battery is nearly full. Avoiding charging to 100% for daily use minimizes stress on cells and improves long-term capacity.',
            expected_gain: 'Improves lifespan',
        });
    }
    
    // Cold weather strategy
    if (telemetry.ambient.temp < 5 && telemetry.charging_state === 'charging') {
        strategies.push({
            id: 'strat_cold_charge',
            strategy: 'Slow Charging (Cold Weather)',
            description: 'Low ambient temperature detected. Fast charging a cold battery can cause permanent damage (lithium plating). Slow charging allows the battery to warm up safely, preserving its health and capacity.',
            expected_gain: 'Prevents cold-related damage',
        });
    }

    // Default strategy if no specific conditions are met
    if (strategies.length === 0) {
        strategies.push({
            id: 'strat_standard',
            strategy: 'Standard Charging',
            description: 'Current conditions are optimal. Standard charging provides a good balance between charging speed and battery health preservation.',
            expected_gain: 'Balances speed & health',
        });
    }
    
    // De-duplicate and limit the number of strategies shown
    const uniqueStrategies = Array.from(new Map(strategies.map(item => [item.strategy, item])).values());


    return uniqueStrategies.slice(0, 3); // Return up to 3 strategies
};

const RLStrategyRecommendation: React.FC<RLStrategyRecommendationProps> = ({ telemetry, bhi }) => {
  const [recommendations, setRecommendations] = useState<AIChargingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = () => {
      setLoading(true);
      setError(null);
      // Simulate async call for local generation
      setTimeout(() => {
        try {
          const data = generateLocalStrategy(telemetry, bhi);
          setRecommendations(data);
        } catch (e) {
          console.error("Error generating local strategy:", e);
          setError("Failed to generate AI strategy.");
        } finally {
          setLoading(false);
        }
      }, 700);
    };
    if (telemetry && bhi) {
      fetchRecommendations();
    }
  }, [telemetry, bhi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <SparklesIcon className="h-6 w-6 mr-2 animate-pulse" />
        Generating AI-powered recommendations...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center">{error}</div>;
  }
  
  if (recommendations.length === 0) {
    return <div className="text-gray-400 text-center">No specific recommendations at this time. Standard charging is advised.</div>;
  }
  
  return (
    <div className="space-y-4">
      {recommendations.map((strategy) => (
        <div key={strategy.id} className="bg-gradient-to-br from-gray-800 to-gray-900/50 p-4 rounded-lg border border-cyan-500/30 shadow-lg animate-fade-in">
          <div className="flex items-start space-x-4">
            <SparklesIcon className="h-8 w-8 text-cyan-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-cyan-300">{strategy.strategy}</p>
                <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-medium">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{strategy.expected_gain}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-1">{strategy.description}</p>
            </div>
          </div>
        </div>
      ))}
       <p className="text-xs text-gray-500 text-center pt-2">Powered by DynamoX Reinforcement Learning Agent.</p>
    </div>
  );
};

export default RLStrategyRecommendation;