

import React from 'react';
import { Alert, AlertSeverity } from '../types';
import { ShieldExclamationIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const severityConfig = {
  [AlertSeverity.Critical]: {
    icon: <ShieldExclamationIcon className="h-6 w-6 text-red-500" />,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
  },
  [AlertSeverity.High]: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-orange-400" />,
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/50',
  },
  [AlertSeverity.Medium]: {
    icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />,
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/50',
  },
  [AlertSeverity.Low]: {
    icon: <CheckCircleIcon className="h-6 w-6 text-green-400" />,
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/50',
  },
};

const AnomalyAlerts: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  if (alerts.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No active alerts. System nominal.</div>;
  }
  
  return (
    <div className="space-y-4 pr-2">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        return (
          <div key={alert.id} className={`flex items-start space-x-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all duration-300`}>
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-100">{alert.message}</p>
                <span className="text-xs text-gray-400">{alert.timestamp}</span>
              </div>
              {alert.severity !== AlertSeverity.Low && (
                <div className="text-sm text-cyan-300 mt-2 bg-cyan-500/10 p-2 rounded-md border border-cyan-500/20">
                    <span className="font-semibold">👉 Action:</span> {alert.advisory}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnomalyAlerts;