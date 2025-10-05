import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TelemetryDataPoint } from '../types';

interface TelemetryChartsProps {
  data: TelemetryDataPoint[];
}

const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Waiting for live telemetry data...</div>;
  }

  return (
    <div className="w-full h-[95%] min-h-[26rem]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            dy={10}
          />
          <YAxis yAxisId="left" stroke="#9ca3af" label={{ value: 'SoC (%) / Temp (°C)', angle: -90, position: 'insideLeft', fill: '#9ca3af', dy: 40 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" label={{ value: 'Voltage (V)', angle: 90, position: 'insideRight', fill: '#9ca3af', dy: -20 }}/>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderColor: '#4b5563',
            }}
            labelStyle={{ color: '#d1d5db' }}
            labelFormatter={(time) => new Date(time).toLocaleString()}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}}/>
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="soc" 
            name="SoC" 
            stroke="#4ade80" // green-400
            strokeWidth={2} 
            dot={false}
          />
           <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="pack_temp" 
            name="Pack Temp" 
            stroke="#f87171" // red-400
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="voltage" 
            name="Voltage" 
            stroke="#60a5fa" // blue-400
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryCharts;