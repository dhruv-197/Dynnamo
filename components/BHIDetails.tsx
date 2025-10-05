// Fix: Populating the empty BHIDetails component file.
import React from 'react';

interface BHIDetailsProps {
  projectedLife: number;
  efficiency: number;
}

const DetailItem: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white">
            {value} <span className="text-lg text-gray-500">{unit}</span>
        </p>
    </div>
);

const BHIDetails: React.FC<BHIDetailsProps> = ({ projectedLife, efficiency }) => {
  return (
    <div className="h-full flex flex-col justify-center space-y-6">
      <DetailItem label="Projected Lifespan" value={projectedLife} unit="years" />
      <DetailItem label="Energy Efficiency" value={`${efficiency}%`} unit="" />
      <p className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        Based on current usage patterns and environmental conditions. Projections are estimates.
      </p>
    </div>
  );
};

export default BHIDetails;