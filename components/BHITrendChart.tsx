import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BHITrendChartProps {
  data: { date: string; bhi: number }[];
}

const BHITrendChart: React.FC<BHITrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" domain={[70, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#4b5563',
            }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="bhi" 
            name="BHI" 
            stroke="#22d3ee" // cyan-400
            strokeWidth={2} 
            dot={{ r: 4, fill: '#06b6d4' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BHITrendChart;