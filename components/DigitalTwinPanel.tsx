import React from 'react';
import DashboardCard from './DashboardCard';
import { FireIcon, BoltIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface DigitalTwinPanelProps {
  onRunSimulation: (simulationType: 'heat' | 'crash' | 'charging') => void;
  simulationStatus: 'idle' | 'running' | 'complete';
  activeSimulation: string | null;
  digitalTwinCells: string[];
}

const SimulationButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, icon, onClick, disabled }) => {
    const baseClasses = "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
    const disabledClasses = "bg-gray-700 text-gray-500 cursor-not-allowed";
    const enabledClasses = "bg-cyan-600/80 text-white hover:bg-cyan-500";

    const getClasses = () => {
        if (disabled) return `${baseClasses} ${disabledClasses}`;
        return `${baseClasses} ${enabledClasses}`;
    }
    
    return (
        <button onClick={onClick} disabled={disabled} className={getClasses()}>
            {icon}
            <span>{label}</span>
        </button>
    );
};


const DigitalTwinPanel: React.FC<DigitalTwinPanelProps> = ({
  onRunSimulation,
  simulationStatus,
  activeSimulation,
  digitalTwinCells,
}) => {

  const getCellClass = (status: string) => {
    switch (status) {
      case 'stressed':
        return 'bg-yellow-500/60 animate-pulse';
      case 'damaged':
        return 'bg-red-600/80';
      case 'nominal':
      default:
        return 'bg-green-500/30';
    }
  };
  
  const getStatusInfo = () => {
    switch(simulationStatus) {
        case 'running':
            return {
                text: `Running: ${activeSimulation?.replace('_', ' ')} Test...`,
                color: 'text-yellow-400 animate-pulse'
            };
        case 'complete':
             return {
                text: `Simulation Complete. Results analyzed.`,
                color: 'text-green-400'
            };
        case 'idle':
        default:
             return {
                text: 'System Nominal. Ready for simulation.',
                color: 'text-gray-400'
            };
    }
  }
  
  const statusInfo = getStatusInfo();

  return (
    <DashboardCard title="Battery Digital Twin & Metaverse Simulation">
      <div className="h-full flex flex-col justify-between">
        
        {/* Digital Twin Visualization */}
        <div>
            <h3 className="text-md font-semibold text-gray-300 mb-3">Cell Matrix Digital Twin</h3>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-gray-900/50 rounded-lg">
                {digitalTwinCells.map((status, index) => (
                    <div key={index} className={`w-full aspect-square rounded ${getCellClass(status)} transition-colors duration-500`}></div>
                ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div><span>Nominal</span></div>
                <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div><span>Stressed</span></div>
                <div className="flex items-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600/80"></div><span>Damaged</span></div>
            </div>
        </div>

        {/* Simulation Controls */}
        <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-300 border-t border-gray-700/50 pt-4">Virtual Abuse Tests</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SimulationButton
                    label="Extreme Heat"
                    icon={<FireIcon className="w-5 h-5" />}
                    onClick={() => onRunSimulation('heat')}
                    disabled={simulationStatus === 'running'}
                />
                <SimulationButton
                    label="Crash Impact"
                    icon={<ShieldExclamationIcon className="w-5 h-5" />}
                    onClick={() => onRunSimulation('crash')}
                    disabled={simulationStatus === 'running'}
                />
                <SimulationButton
                    label="Rapid Fast Charge"
                    icon={<BoltIcon className="w-5 h-5" />}
                    onClick={() => onRunSimulation('charging')}
                    disabled={simulationStatus === 'running'}
                />
            </div>
        </div>
        
        {/* Status */}
        <div className="text-center p-3 rounded-lg bg-gray-900/50">
            <p className={`font-medium text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
        </div>
      </div>
    </DashboardCard>
  );
};

export default DigitalTwinPanel;