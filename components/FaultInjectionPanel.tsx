import React from 'react';
import { FireIcon, BoltSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { AnomalousField } from '../types';

interface FaultInjectionPanelProps {
  onInjectFault: (faultType: 'pack_temp' | 'voltage' | 'current') => void;
  isLive: boolean;
  activeFault: AnomalousField;
}

const FaultButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    isActive: boolean;
}> = ({ label, icon, onClick, disabled, isActive }) => {
    const baseClasses = "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
    const disabledClasses = "bg-gray-700 text-gray-500 cursor-not-allowed";
    const enabledClasses = "bg-yellow-600/80 text-white hover:bg-yellow-500";
    const activeClasses = "bg-red-600 text-white animate-pulse ring-2 ring-red-400";

    const getClasses = () => {
        if (disabled) return `${baseClasses} ${disabledClasses}`;
        if (isActive) return `${baseClasses} ${activeClasses}`;
        return `${baseClasses} ${enabledClasses}`;
    }
    
    return (
        <button onClick={onClick} disabled={disabled || isActive} className={getClasses()}>
            {icon}
            <span>{isActive ? 'Injecting...' : label}</span>
        </button>
    );
};


const FaultInjectionPanel: React.FC<FaultInjectionPanelProps> = ({ onInjectFault, isLive, activeFault }) => {
  return (
    <div className="h-full flex flex-col justify-between">
        <div>
            <div className="space-y-3">
                <FaultButton
                    label="Trigger Thermal Spike"
                    icon={<FireIcon className="w-5 h-5" />}
                    onClick={() => onInjectFault('pack_temp')}
                    disabled={!isLive}
                    isActive={activeFault === 'pack_temp'}
                />
                <FaultButton
                    label="Trigger Voltage Sag"
                    icon={<BoltSlashIcon className="w-5 h-5" />}
                    onClick={() => onInjectFault('voltage')}
                    disabled={!isLive}
                    isActive={activeFault === 'voltage'}
                />
                <FaultButton
                    label="Trigger Over-current"
                    icon={<ExclamationTriangleIcon className="w-5 h-5" />}
                    onClick={() => onInjectFault('current')}
                    disabled={!isLive}
                    isActive={activeFault === 'current'}
                />
            </div>
        </div>
        <div className="text-center text-xs text-gray-500 border-t border-gray-700/50 pt-3">
            <p>
                {isLive 
                    ? 'Manually trigger fault conditions for stress testing.'
                    : 'Enable the live feed to begin fault injection.'
                }
            </p>
        </div>
    </div>
  );
};

export default FaultInjectionPanel;