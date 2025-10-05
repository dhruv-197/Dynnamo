

import React from 'react';
import { VehicleTelemetry, AnomalousField } from '../types';
import { 
    CpuChipIcon, 
    BoltIcon, 
    ArrowTrendingDownIcon, 
    FireIcon, 
    MapPinIcon, 
    SunIcon,
    CloudIcon,
    ArrowPathIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

interface VehicleTelemetryProps {
  data: VehicleTelemetry | null;
  anomalousField: AnomalousField;
}

const TelemetryItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: string | number; 
    unit?: string; 
    color?: string;
    isAnomalous?: boolean;
}> = ({ icon, label, value, unit, color = 'text-cyan-300', isAnomalous = false }) => {
    const anomalyClass = isAnomalous 
        ? (label === 'Pack Temp' || label === 'Current'
            ? 'border-2 border-red-500 animate-pulse bg-red-500/20' 
            : 'border-2 border-yellow-500 animate-pulse bg-yellow-500/20')
        : 'bg-gray-800/50';

    return (
    <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${anomalyClass}`}>
        <div className="bg-gray-700/50 p-2 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className={`text-lg ${isAnomalous ? (label === 'Pack Temp' || label === 'Current' ? 'font-bold text-red-400' : 'font-bold text-yellow-400') : `font-semibold ${color}`}`}>{value} <span className="text-sm font-normal text-gray-500">{unit}</span></p>
        </div>
    </div>
    );
};

const VehicleTelemetryDisplay: React.FC<VehicleTelemetryProps> = ({ data, anomalousField }) => {
  if (!data) {
    return <div className="text-gray-500 flex items-center justify-center h-full">Loading telemetry data...</div>;
  }

  const getTempColor = (temp: number) => {
    if (temp > 45) return 'text-red-500';
    if (temp > 38) return 'text-yellow-400';
    return 'text-green-400';
  }
  
  const socColor = data.soc > 60 ? 'text-green-400' : data.soc > 20 ? 'text-yellow-400' : 'text-red-500';

  const statusInfo = {
    charging: {
        icon: <BoltIcon className="h-6 w-6 text-green-400" />,
        label: "Charging",
        color: 'text-green-400',
    },
    discharging: {
        icon: <ArrowTrendingDownIcon className="h-6 w-6 text-yellow-400" />,
        label: "Discharging",
        color: 'text-yellow-400',
    },
    idle: {
        icon: <ClockIcon className="h-6 w-6 text-gray-400" />,
        label: "Idle",
        color: 'text-gray-400',
    }
  }[data.charging_state];
  

  return (
    <div className="space-y-3 h-full flex flex-col justify-between">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <TelemetryItem 
            icon={<BoltIcon className="h-6 w-6 text-cyan-400" />} 
            label="State of Charge" 
            value={`${data.soc.toFixed(1)}`}
            unit="%"
            color={socColor}
            />
            <TelemetryItem 
            icon={<CpuChipIcon className="h-6 w-6 text-cyan-400" />} 
            label="Voltage" 
            value={data.voltage.toFixed(1)} 
            unit="V"
            isAnomalous={anomalousField === 'voltage'}
            />
            <TelemetryItem 
            icon={<ArrowTrendingDownIcon className="h-6 w-6 text-cyan-400" />} 
            label="Current" 
            value={data.current.toFixed(1)} 
            unit="A"
            isAnomalous={anomalousField === 'current'}
            />
            <TelemetryItem 
            icon={<ArrowPathIcon className="h-6 w-6 text-cyan-400" />} 
            label="Cycles" 
            value={data.cycle_count}
            />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400 border-t border-gray-700 pt-3">Thermal & Environment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <TelemetryItem 
              icon={<FireIcon className="h-6 w-6 text-cyan-400" />} 
              label="Pack Temp" 
              value={data.pack_temp.toFixed(1)} 
              unit="°C"
              color={getTempColor(data.pack_temp)}
              isAnomalous={anomalousField === 'pack_temp'}
            />
             <TelemetryItem 
              icon={<SunIcon className="h-6 w-6 text-cyan-400" />} 
              label="Ambient Temp" 
              value={data.ambient.temp.toFixed(1)} 
              unit="°C"
            />
            <TelemetryItem 
              icon={<CloudIcon className="h-6 w-6 text-cyan-400" />} 
              label="Humidity" 
              value={data.ambient.humidity.toFixed(0)} 
              unit="%"
            />
            <TelemetryItem 
              icon={<MapPinIcon className="h-6 w-6 text-cyan-400" />} 
              label="Location" 
              value="Mumbai"
            />
        </div>
      </div>
      
       <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50">
                <div className="bg-gray-700/50 p-2 rounded-lg">{statusInfo.icon}</div>
                <div>
                    <p className={`text-lg font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
                    <p className="text-xs text-gray-500">
                        {data.current > 0 
                            ? `Drawing ${data.current.toFixed(1)} A` 
                            : data.current < 0 
                            ? `Delivering ${Math.abs(data.current).toFixed(1)} A` 
                            : 'No current flow'}
                    </p>
                </div>
            </div>
            <p className="text-center text-xs text-gray-600 pt-2">{data.vehicle_id}</p>
       </div>
    </div>
  );
};

export default VehicleTelemetryDisplay;