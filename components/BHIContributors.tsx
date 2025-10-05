import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BHIContributor } from '../types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface BHIContributorsProps {
  data: BHIContributor[];
}

const factorDetails: { [key in BHIContributor['factor'] | string]: { name: string; color: string; description: string; } } = {
    'pack_temp': { name: 'Pack Temperature', color: '#ef4444', description: 'High temperatures accelerate chemical degradation, reducing lifespan.' },
    'fast_charge_ratio': { name: 'Fast Charging', color: '#f97316', description: 'Frequent fast charging stresses battery cells, causing micro-damage.' },
    'cycle_count': { name: 'Cycle Count', color: '#eab308', description: 'Natural wear from the battery being charged and discharged over time.' },
    'depth_of_discharge': { name: 'Discharge Depth', color: '#84cc16', description: 'Consistently deep discharges are more stressful on the battery than shallow cycles.' },
    'climate_stress': { name: 'Climate Stress', color: '#3b82f6', description: 'Operating in extreme hot or cold climates affects battery performance and health.' }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 shadow-lg max-w-xs animate-fade-in">
        <p className="font-semibold text-cyan-300 mb-1">{label}</p>
        <p className="text-sm text-gray-200">
          BHI Impact: <span className="font-bold">{payload[0].value.toFixed(1)} pts</span>
        </p>
        <div className="flex items-start space-x-2 mt-2 pt-2 border-t border-gray-700/50">
          <InformationCircleIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">{data.description}</p>
        </div>
      </div>
    );
  }
  return null;
};

const BHIContributors: React.FC<BHIContributorsProps> = ({ data }) => {
  const chartData = data.map(contributor => ({
    ...contributor,
    name: factorDetails[contributor.factor]?.name || contributor.factor,
    color: factorDetails[contributor.factor]?.color || '#a855f7',
    description: factorDetails[contributor.factor]?.description || 'General battery wear.'
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            width={120}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="impact" name="Impact" barSize={20} radius={[0, 10, 10, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BHIContributors;