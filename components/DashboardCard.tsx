
import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-lg p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-cyan-300 mb-4">{title}</h2>
      <div className="h-full">{children}</div>
    </div>
  );
};

export default DashboardCard;