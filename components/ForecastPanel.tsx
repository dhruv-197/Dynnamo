import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, BarChart, Bar, Cell } from 'recharts';
import { BHIForecastPoint, ComponentFailureForecast, VehicleTelemetry } from '../types';
import DashboardCard from './DashboardCard';
import { ArrowTrendingUpIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface ForecastPanelProps {
  bhi: number;
  telemetry: VehicleTelemetry;
}

const generateForecast = (currentBhi: number, telemetry: VehicleTelemetry): { bhiForecast: BHIForecastPoint[], componentForecast: ComponentFailureForecast[] } => {
    // Simplified forecast logic
    let baseMonthlyDecay = 0.4; // Base BHI points lost per month
    
    // --- 1. Explicitly calculate the impact of 'climate_stress' ---
    // This factor models the accelerated degradation from operating in harsh climates.
    let climateStressImpact = 0;
    // High ambient temperatures increase stress
    if (telemetry.ambient.temp > 38) { // Extreme heat
        climateStressImpact += 0.20;
    } else if (telemetry.ambient.temp > 32) { // Hot weather
        climateStressImpact += 0.10;
    }
    // High humidity also accelerates degradation
    if (telemetry.ambient.humidity > 80) { // Very high humidity
        climateStressImpact += 0.15;
    } else if (telemetry.ambient.humidity > 70) { // High humidity
        climateStressImpact += 0.05;
    }
    
    // --- 2. Combine all factors to get the total monthly decay rate ---
    let totalMonthlyDecay = baseMonthlyDecay + climateStressImpact;

    // Adjust decay based on other operational telemetry
    if (telemetry.pack_temp > 40) totalMonthlyDecay += 0.2;
    if (telemetry.cycle_count > 300) totalMonthlyDecay += (telemetry.cycle_count - 300) * 0.001;
    
    // Degradation accelerates as BHI drops
    if (currentBhi < 80) totalMonthlyDecay *= 1.1;

    const bhiForecast: BHIForecastPoint[] = [{ months: 0, bhi: currentBhi, confidenceMin: currentBhi, confidenceMax: currentBhi }];
    for (let i = 1; i <= 6; i++) {
        const projectedBhi = Math.max(50, currentBhi - (totalMonthlyDecay * i) + (Math.random() - 0.5) * 0.5);
        const confidenceRange = i * 0.5;
        bhiForecast.push({
            months: i,
            bhi: projectedBhi,
            confidenceMin: Math.max(50, projectedBhi - confidenceRange),
            confidenceMax: Math.min(100, projectedBhi + confidenceRange),
        });
    }

    // --- 3. Component Failure Forecast ---
    // Base probabilities for failure within 6 months
    let cellFailureProb = 0.05 + (telemetry.cycle_count / 10000); // Base probability increases with wear
    let bmsFailureProb = 0.02; // Generally reliable
    let coolingFailureProb = 0.03;
    let inverterFailureProb = 0.01;

    // Enhance probability based on specific stressors from telemetry
    // High pack temperature is a major stressor for cells and the cooling system.
    if (telemetry.pack_temp > 45) {
        cellFailureProb += 0.20; // Increased thermal stress on cells
        coolingFailureProb += 0.25; // Indicates the cooling system is under strain or failing
    }

    // High current (during fast charging or heavy discharge) stresses the inverter and cells.
    if (Math.abs(telemetry.current) > 80) {
        inverterFailureProb += 0.15; // Inverter handles the high power flow
        cellFailureProb += 0.10; // High current causes additional cell degradation
    }

    const componentForecast: ComponentFailureForecast[] = [
        { component: 'Battery Cells', probability: Math.min(1, cellFailureProb) },
        { component: 'BMS', probability: Math.min(1, bmsFailureProb) },
        { component: 'Cooling System', probability: Math.min(1, coolingFailureProb) },
        { component: 'Inverter', probability: Math.min(1, inverterFailureProb) },
    ];


    return { bhiForecast, componentForecast };
};

const BHIProjectionCard: React.FC<{ period: string; value: number | null; change: number | null }> = ({ period, value, change }) => {
    const getColor = (bhi: number | null) => {
        if (bhi === null) return 'text-gray-400';
        if (bhi > 75) return 'text-green-400';
        if (bhi > 50) return 'text-yellow-400';
        return 'text-red-500';
    };
    
    return (
        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">{period}</p>
            {value !== null ? (
                <>
                    <p className={`text-3xl font-bold ${getColor(value)}`}>{value.toFixed(1)}</p>
                    <p className={`text-sm ${change !== null && change < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        {change !== null ? `${change.toFixed(1)} pts` : '--'}
                    </p>
                </>
            ) : (
                <p className="text-3xl font-bold text-gray-500">...</p>
            )}
        </div>
    );
};

const ForecastPanel: React.FC<ForecastPanelProps> = ({ bhi, telemetry }) => {
    const [forecastData, setForecastData] = useState<{ bhiForecast: BHIForecastPoint[], componentForecast: ComponentFailureForecast[] } | null>(null);

    useEffect(() => {
        const { bhiForecast, componentForecast } = generateForecast(bhi, telemetry);
        setForecastData({ bhiForecast, componentForecast });
    }, [bhi, telemetry]);

    const BHI_1M = forecastData?.bhiForecast.find(p => p.months === 1)?.bhi ?? null;
    const BHI_3M = forecastData?.bhiForecast.find(p => p.months === 3)?.bhi ?? null;
    const BHI_6M = forecastData?.bhiForecast.find(p => p.months === 6)?.bhi ?? null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fade-in">
            <div className="lg:col-span-3">
                <DashboardCard title="BHI Projections (Next 6 Months)">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BHIProjectionCard period="1 Month" value={BHI_1M} change={BHI_1M ? BHI_1M - bhi : null} />
                        <BHIProjectionCard period="3 Months" value={BHI_3M} change={BHI_3M ? BHI_3M - bhi : null} />
                        <BHIProjectionCard period="6 Months" value={BHI_6M} change={BHI_6M ? BHI_6M - bhi : null} />
                    </div>
                </DashboardCard>
            </div>

            <DashboardCard title="BHI Forecast Trend" className="lg:col-span-2">
                 <div className="w-full h-80">
                     <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={forecastData?.bhiForecast} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                             <XAxis dataKey="months" stroke="#9ca3af" tickFormatter={(m) => `${m}M`} />
                             <YAxis stroke="#9ca3af" domain={[50, 100]}/>
                             <Tooltip 
                                 contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }}
                                 labelFormatter={(label) => `After ${label} Months`}
                                 formatter={(value: number, name: string) => [value.toFixed(1), name === 'bhi' ? 'Projected BHI' : 'Confidence']}
                             />
                             <Line type="monotone" dataKey="bhi" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} name="Projected BHI"/>
                             <Area type="monotone" dataKey="confidenceMax" stackId="1" stroke="none" fill="#22d3ee" fillOpacity={0.05} />
                             <Area type="monotone" dataKey="confidenceMin" stackId="2" stroke="none" fill="#8884d8" fillOpacity={0.05} />
                         </LineChart>
                     </ResponsiveContainer>
                 </div>
            </DashboardCard>
            
            <DashboardCard title="Component Failure Risk (6 Months)">
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={forecastData?.componentForecast} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                            <XAxis type="number" domain={[0, 1]} tickFormatter={(p) => `${p * 100}%`} stroke="#e5e7eb" />
                            <YAxis type="category" dataKey="component" width={120} tick={{ fill: '#e5e7eb', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }}
                                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                                labelStyle={{ color: '#e5e7eb' }}
                                itemStyle={{ color: '#e5e7eb' }}
                            />
                            <Bar dataKey="probability" barSize={20} radius={[0, 10, 10, 0]}>
                                {forecastData?.componentForecast.map((entry, index) => {
                                    const color = entry.probability > 0.2 ? '#ef4444' : entry.probability > 0.1 ? '#f97316' : '#22c55e';
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DashboardCard>

        </div>
    );
}

export default ForecastPanel;