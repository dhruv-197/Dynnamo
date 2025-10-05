// constants.ts
import { Alert, AlertSeverity, RegionalClimateImpact, ClimateRiskLevel, VehicleTelemetry, BHIContributor, ChargingRecommendation, RLStrategy, RLStrategyName, AlertDefinition } from './types';
import { ClockIcon, Battery50Icon, SunIcon } from '@heroicons/react/24/outline';


export const INITIAL_BHI = 88.4;
export const INITIAL_CONTRIBUTORS: BHIContributor[] = [
    { factor: 'pack_temp', impact: -8.1 },
    { factor: 'fast_charge_ratio', impact: -4.2 },
    { factor: 'cycle_count', impact: -3.5 },
];

export const BHI_TREND_DATA = [
  { date: 'Jan', bhi: 99.2 },
  { date: 'Feb', bhi: 98.5 },
  { date: 'Mar', bhi: 97.1 },
  { date: 'Apr', bhi: 95.8 },
  { date: 'May', bhi: 93.2 },
  { date: 'Jun', bhi: 90.5 },
  { date: 'Jul', bhi: 88.4 },
];

// --- New Dynamic Alert System ---

export const LOW_RISK_MESSAGES: string[] = [
    '✅ Battery temperature stable. Continue charging as normal.',
    '✅ Battery Health Index: [BHI]/100 — Good condition.',
    '✅ Charging efficiency optimal at current rate.',
    '⚡ All systems are green. Ready for operation.',
    '✅ Cell balancing complete. Battery is optimized.',
    '✅ System check complete. All parameters nominal.',
    '⚡ Smart charging active to protect battery health.'
];

export const DYNAMIC_ALERT_DEFINITIONS: AlertDefinition[] = [
    // --- Critical Risk ---
    {
        id: 'crit-temp',
        severity: AlertSeverity.Critical,
        condition: (telemetry) => telemetry.pack_temp > 52,
        messages: [
            '🔥 CRITICAL: High temperature detected ([TEMP]°C). Risk of thermal runaway.',
            '🔥 DANGER: Temperature spike to [TEMP]°C. Cease all operations immediately.',
            '🔥 THERMAL ALERT: Pack temperature exceeds safe limits ([TEMP]°C). IMMEDIATE ACTION REQUIRED.',
        ],
        advisory: 'System has halted charging. Disconnect from charger and consult service.',
    },
    {
        id: 'crit-current',
        severity: AlertSeverity.Critical,
        condition: (telemetry) => telemetry.charging_state === 'charging' && telemetry.current > 95,
        messages: [
            '🚫 CRITICAL: Unsafe fast charging current detected. Charging paused by system.',
            '🚫 DANGER: Over-current detected. Risk of permanent component damage.',
        ],
        advisory: 'Charging has been automatically stopped to prevent damage.',
    },
    {
        id: 'crit-voltage-high',
        severity: AlertSeverity.Critical,
        condition: (telemetry) => telemetry.voltage > 415,
        messages: [
            '⚡ DANGER: Critical over-voltage detected ([VOLTAGE]V). Risk of immediate cell damage.',
            '⚡ CRITICAL: Voltage limit exceeded ([VOLTAGE]V). Halting all systems.',
        ],
        advisory: 'System has performed an emergency shutdown. Do not operate vehicle.',
    },
     {
        id: 'crit-bms-comms',
        severity: AlertSeverity.Critical,
        // This would be triggered by a specific flag in a real system
        condition: (telemetry) => telemetry.voltage < 350, // Simulate with low voltage for demo
        messages: [
            '📡 CRITICAL: BMS communication lost. Vehicle state is unknown and unsafe.',
        ],
        advisory: 'Vehicle is in a failsafe mode. Consult service immediately.',
    },

    // --- High Risk ---
    {
        id: 'high-temp',
        severity: AlertSeverity.High,
        condition: (telemetry) => telemetry.pack_temp > 48 && telemetry.pack_temp <= 52,
        messages: [
            '🔴 High temperature detected ([TEMP]°C). Risk of overheating — stop charging immediately.',
            '🔴 Pack temperature is reaching critical levels ([TEMP]°C). Action is required.',
        ],
        advisory: 'Stop charging immediately to allow the battery to cool down.',
    },
    {
        id: 'high-discharge',
        severity: AlertSeverity.High,
        condition: (telemetry) => telemetry.charging_state === 'discharging' && telemetry.current < -80,
        messages: [
            '🚨 Abnormal discharge pattern detected. Heavy load on battery.',
            '🚨 Unusually high power draw detected. Investigate for faults.',
        ],
        advisory: 'Please reduce vehicle load or consult a service center.',
    },
    {
        id: 'high-cold-charge',
        severity: AlertSeverity.High,
        condition: (telemetry) => telemetry.charging_state === 'charging' && telemetry.ambient.temp < 5 && telemetry.current > 30,
        messages: [
            '❄️ Unsafe fast charging at low temperature ([TEMP]°C ambient).',
            '❄️ Attempting to fast charge a cold battery. High risk of cell damage.',
        ],
        advisory: 'System is switching to slow charging to protect the battery.',
    },
    {
        id: 'high-bhi-low',
        severity: AlertSeverity.High,
        condition: (telemetry, bhi) => bhi < 60,
        messages: [
            '💔 Battery Health Index is critical ([BHI]/100). Significant range loss expected.',
            '💔 Severe degradation detected. Immediate service is recommended to assess safety.',
        ],
        advisory: 'Vehicle performance and range are severely compromised. Schedule service.',
    },
     {
        id: 'high-cooling-fault',
        severity: AlertSeverity.High,
        // This would be triggered by a specific flag in a real system
        condition: (telemetry) => telemetry.pack_temp > 46 && Math.abs(telemetry.current) > 50, // Simulate with high temp under load
        messages: [
            '⚙️ Cooling system fault detected. Pack temperatures may rise uncontrollably.',
            '⚙️ Auxiliary cooling system has failed. Overheating is imminent under load.',
        ],
        advisory: 'Avoid high-load driving and charging. Service is required.',
    },

    // --- Medium Risk ---
    {
        id: 'med-temp-rise',
        severity: AlertSeverity.Medium,
        condition: (telemetry) => telemetry.pack_temp > 42 && telemetry.pack_temp <= 48,
        messages: [
            '⚠️ Temperature rising faster than normal. Consider switching to slow charging.',
            '⚠️ Battery pack is becoming excessively warm ([TEMP]°C).',
        ],
        advisory: 'Switch to trickle charge due to rising cell temperature.',
    },
    {
        id: 'med-bhi-drop',
        severity: AlertSeverity.Medium,
        condition: (telemetry, bhi) => bhi < 80 && bhi >= 60,
        messages: [
            '⚠️ Battery Health Index dropped to [BHI]/100 — moderate degradation detected.',
            '⚠️ Moderate battery degradation detected. Performance may be affected soon.',
        ],
        advisory: 'Adopt health-conscious charging habits (e.g., 20-80% SOC).',
    },
    {
        id: 'med-voltage-imbalance',
        severity: AlertSeverity.Medium,
        condition: (telemetry) => telemetry.voltage > 405 && telemetry.voltage < 415,
        messages: [
            '⚠️ Voltage imbalance across cells detected. Monitoring closely.',
            '⚠️ Cell balancing is currently active. Charging may be slower than usual.',
        ],
        advisory: 'The BMS is working to rebalance cells. No immediate action needed.',
    },
    {
        id: 'med-charge-slow',
        severity: AlertSeverity.Medium,
        condition: (telemetry) => telemetry.charging_state === 'charging' && telemetry.current < 20,
        messages: [
            '🔌 Slow charging speed detected. Expected faster rate. Check charger.',
            '🔌 Charging power is lower than expected. Your charge will take longer.',
        ],
        advisory: 'Verify charger specifications and connection for optimal speed.',
    },
     {
        id: 'med-soc-low',
        severity: AlertSeverity.Medium,
        condition: (telemetry) => telemetry.soc < 15,
        messages: [
            '🔋 Low State of Charge ([SOC]%). Plan to charge soon to avoid deep discharge.',
            '🔋 Battery level is critically low. Limited range remaining.',
        ],
        advisory: 'Locate a charging station. Deep discharge can harm the battery.',
    },
];

export const CLIMATE_IMPACT_DATA: RegionalClimateImpact[] = [
  { region: 'Mumbai', riskLevel: ClimateRiskLevel.High },
  { region: 'Delhi', riskLevel: ClimateRiskLevel.Severe },
  { region: 'Bangalore', riskLevel: ClimateRiskLevel.Moderate },
  { region: 'Chennai', riskLevel: ClimateRiskLevel.High },
  { region: 'Kolkata', riskLevel: ClimateRiskLevel.High },
  { region: 'Hyderabad', riskLevel: ClimateRiskLevel.Moderate },
];

export const VEHICLE_TELEMETRY_DATA: VehicleTelemetry = {
    vehicle_id: 'DX-IND-MUM-741',
    soc: 76.2,
    voltage: 385.1,
    current: -40.5, // discharging
    pack_temp: 38.1,
    cycle_count: 241,
    charging_state: 'discharging',
    ambient: {
        temp: 35.2,
        humidity: 78,
    }
};

export const RL_STRATEGIES: Record<RLStrategyName, RLStrategy> = {
    'Standard Charging': {
        name: 'Standard Charging',
        description: 'Default charging protocol. Balances speed and battery health for typical conditions.',
        icon: Battery50Icon,
    },
    'Slow Charging': {
        name: 'Slow Charging',
        description: 'Reduces charging current to minimize heat generation and extend long-term battery lifespan.',
        icon: SunIcon,
    },
    'Delayed Charging': {
        name: 'Delayed Charging',
        description: 'Postpones charging until ambient temperatures are cooler (e.g., overnight) to prevent heat-related stress.',
        icon: ClockIcon,
    }
};