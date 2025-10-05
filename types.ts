// types.ts
// Fix: Add React import to resolve 'Cannot find namespace React' error.
import React from 'react';

export type Page = 'dashboard' | 'telemetry' | 'analysis' | 'alerts' | 'about';

export interface BHIForecastPoint {
  months: number;
  bhi: number;
  confidenceMin: number;
  confidenceMax: number;
}

export interface ComponentFailureForecast {
  component: 'Battery Cells' | 'BMS' | 'Cooling System' | 'Inverter';
  probability: number; // 0 to 1
}

export enum Role {
  User = 'User',
  OEM = 'OEM',
}

export type AnomalousField = 'pack_temp' | 'voltage' | 'current' | null;

export enum AlertSeverity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export type AlertType = 'Thermal' | 'Voltage' | 'Degradation' | 'System' | 'Over-current' | 'Cooling' | 'Communication' | 'Sensor' | 'Charging';


export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  advisory: string;
}

export interface AlertDefinition {
    id: string;
    severity: AlertSeverity;
    condition: (telemetry: VehicleTelemetry, bhi: number) => boolean;
    messages: string[];
    advisory: string;
}


export enum ClimateRiskLevel {
  Severe = 'Severe',
  High = 'High',
  Moderate = 'Moderate',
  Low = 'Low',
}

export interface RegionalClimateImpact {
  region: string;
  riskLevel: ClimateRiskLevel;
}

export interface VehicleTelemetry {
  vehicle_id: string;
  soc: number;
  voltage: number;
  current: number;
  pack_temp: number;
  cycle_count: number;
  charging_state: 'charging' | 'discharging' | 'idle';
  ambient: {
    temp: number;
    humidity: number;
  };
}

export interface TelemetryDataPoint extends VehicleTelemetry {
    time: number;
}


export interface BHIContributor {
    factor: 'pack_temp' | 'fast_charge_ratio' | 'cycle_count' | 'depth_of_discharge' | 'climate_stress';
    impact: number; // a negative number representing point deduction
}


export interface ChargingRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
}

export type RLStrategyName = 'Standard Charging' | 'Slow Charging' | 'Delayed Charging';

export interface RLStrategy {
    name: RLStrategyName;
    description: string;
    icon: React.ElementType;
}