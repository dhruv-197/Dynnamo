import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardCard from './components/DashboardCard';
import BHIDisplay from './components/BHIDisplay';
import BHITrendChart from './components/BHITrendChart';
import AnomalyAlerts from './components/AnomalyAlerts';
import ClimateImpactMap from './components/ClimateImpactMap';
import VehicleTelemetryDisplay from './components/VehicleTelemetry';
import BHIContributors from './components/BHIContributors';
import LandingPage from './components/LandingPage';
import RLStrategyRecommendation from './components/RLStrategyRecommendation';
import TelemetryCharts from './components/TelemetryCharts';
import ChargingRecommendations from './components/ChargingRecommendations';
import FaultInjectionPanel from './components/FaultInjectionPanel';
import AboutPage from './components/TechnicalReport';
import ForecastPanel from './components/ForecastPanel';
import BHIDetails from './components/BHIDetails';
import EcoMetricDisplay from './components/EcoMetricDisplay';
import { Page, Role, VehicleTelemetry, BHIContributor, Alert, TelemetryDataPoint, AnomalousField, AlertSeverity } from './types';
import { 
  INITIAL_BHI, 
  INITIAL_CONTRIBUTORS,
  BHI_TREND_DATA, 
  DYNAMIC_ALERT_DEFINITIONS,
  LOW_RISK_MESSAGES,
  CLIMATE_IMPACT_DATA,
  VEHICLE_TELEMETRY_DATA,
} from './constants';


const determineAlerts = (telemetry: VehicleTelemetry, bhi: number): Alert[] => {
    const activeAlerts: Alert[] = [];

    // Evaluate dynamic alert definitions
    for (const def of DYNAMIC_ALERT_DEFINITIONS) {
        if (def.condition(telemetry, bhi)) {
            // Pick a random message for variety
            const message = def.messages[Math.floor(Math.random() * def.messages.length)];
            
            // Personalize message with live data
            const personalizedMessage = message
                .replace('[TEMP]', telemetry.pack_temp.toFixed(1))
                .replace('[BHI]', bhi.toFixed(1))
                .replace('[SOC]', telemetry.soc.toFixed(1))
                .replace('[VOLTAGE]', telemetry.voltage.toFixed(1));

            activeAlerts.push({
                id: def.id,
                severity: def.severity,
                message: personalizedMessage,
                advisory: def.advisory,
                timestamp: 'Just now',
            });
        }
    }

    // If no high-risk alerts are active, show a positive, low-risk status message.
    if (activeAlerts.length === 0) {
        const randomIndex = Math.floor(Math.random() * LOW_RISK_MESSAGES.length);
        const lowRiskMessage = LOW_RISK_MESSAGES[randomIndex].replace('[BHI]', bhi.toFixed(1));
        
        activeAlerts.push({
            id: 'low-risk-status',
            severity: AlertSeverity.Low,
            message: lowRiskMessage,
            advisory: 'System operating within normal parameters.',
            timestamp: 'Just now'
        });
    }

    // Sort by severity and return the top alerts
    const severityOrder: { [key in AlertSeverity]: number } = { [AlertSeverity.Critical]: 0, [AlertSeverity.High]: 1, [AlertSeverity.Medium]: 2, [AlertSeverity.Low]: 3 };
    activeAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return Array.from(new Map(activeAlerts.map(item => [item.id, item])).values()).slice(0, 4);
};


const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>(Role.OEM);
  const [isLive, setIsLive] = useState(false);
  
  const [bhi, setBhi] = useState(INITIAL_BHI);
  const [bhiContributors, setBhiContributors] = useState<BHIContributor[]>(INITIAL_CONTRIBUTORS);
  const [telemetry, setTelemetry] = useState<VehicleTelemetry>(VEHICLE_TELEMETRY_DATA);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [anomalousField, setAnomalousField] = useState<AnomalousField>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryDataPoint[]>([]);
  const [injectedFault, setInjectedFault] = useState<AnomalousField>(null);
  const [carbonImpact, setCarbonImpact] = useState<number>(12);

  const intervalRef = useRef<number | null>(null);
  const faultTimeoutRef = useRef<number | null>(null);
  const bhiRef = useRef(INITIAL_BHI); // Ref to hold the latest BHI for state updaters

  // Effect to handle navigation when role changes
  useEffect(() => {
    if (currentRole === Role.User && currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
    }
  }, [currentRole, currentPage]);
  
  // Initialize alerts on mount
  useEffect(() => {
    setAlerts(determineAlerts(VEHICLE_TELEMETRY_DATA, INITIAL_BHI));
  }, []);

  const handleInjectFault = (faultType: 'pack_temp' | 'voltage' | 'current') => {
    if (!isLive) return;

    setInjectedFault(faultType);
    setAnomalousField(faultType);
    
    let faultAlert: Alert;
    if (faultType === 'pack_temp') {
        faultAlert = { id: 'fault-temp', severity: AlertSeverity.Critical, message: '🔥 FAULT INJECTED: Critical Thermal Spike', advisory: 'Manual fault injection active. System is under stress.', timestamp: 'Just now' };
    } else if (faultType === 'voltage') {
        faultAlert = { id: 'fault-volt', severity: AlertSeverity.Critical, message: '⚡ FAULT INJECTED: Sudden Voltage Sag', advisory: 'Manual fault injection active. System is under stress.', timestamp: 'Just now' };
    } else {
        faultAlert = { id: 'fault-curr', severity: AlertSeverity.Critical, message: '🚫 FAULT INJECTED: Critical Over-current', advisory: 'Manual fault injection active. System is under stress.', timestamp: 'Just now' };
    }
    setAlerts(prev => [faultAlert, ...prev.filter(a => a.id !== faultAlert.id)]);
    
    if (faultTimeoutRef.current) {
        clearTimeout(faultTimeoutRef.current);
    }
    faultTimeoutRef.current = window.setTimeout(() => {
      setInjectedFault(null);
      setAnomalousField(null);
      // The main simulation loop will reset alerts now that injectedFault is null.
    }, 10000);
  };


  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (faultTimeoutRef.current) {
        clearTimeout(faultTimeoutRef.current);
      }
      setBhi(INITIAL_BHI);
      setTelemetry(VEHICLE_TELEMETRY_DATA);
      setBhiContributors(INITIAL_CONTRIBUTORS);
      setAlerts(determineAlerts(VEHICLE_TELEMETRY_DATA, INITIAL_BHI));
      setAnomalousField(null);
      setInjectedFault(null);
      setTelemetryHistory([]);
      setCarbonImpact(12);
      bhiRef.current = INITIAL_BHI;
      return;
    }

    intervalRef.current = window.setInterval(() => {
      
      // Determine different types of random events to trigger multiple alerts
      const isHeatSpikeEvent = Math.random() < 0.20;       // 20% chance of a heat spike
      const isHighDischargeEvent = Math.random() < 0.20;  // 20% chance of a heavy discharge event
      const isVoltageImbalanceEvent = Math.random() < 0.30; // 30% chance of voltage imbalance

      const tempAnomalyTriggered = injectedFault === 'pack_temp';
      const voltageAnomalyTriggered = injectedFault === 'voltage';
      const currentAnomalyTriggered = injectedFault === 'current';
      
      setBhi((prevBhi) => {
        let decay = 0.03; // Increased base decay for demo purposes
        if (tempAnomalyTriggered) decay = 0.5;
        if (voltageAnomalyTriggered) decay = 0.3;
        if (currentAnomalyTriggered) decay = 0.4;
        if (isHeatSpikeEvent) decay += 0.1; // Accelerate BHI decline during stress for alert demo
        const newBhi = Math.max(50, prevBhi - decay);
        bhiRef.current = newBhi; // Update ref to get latest BHI in other state updaters
        return newBhi;
      });
      
      setBhiContributors(prev => prev.map(c => ({
          ...c,
          impact: c.impact - (Math.random() * 0.005)
      })));

      setTelemetry(prev => {
        let newChargingState = prev.charging_state;
        let newCurrent = prev.current;
        let newSoc = prev.soc;
        let newVoltage = prev.voltage;
        let newCycleCount = prev.cycle_count;

        if (Math.random() < 0.02) {
          if (prev.charging_state === 'discharging') newChargingState = 'idle';
          else if (prev.charging_state === 'idle') newChargingState = 'charging';
          else {
            newChargingState = 'discharging';
            newCycleCount += 1; // Increment cycle count when a discharge cycle begins
          }
        }

        switch(newChargingState) {
            case 'charging':
                newCurrent = 60 + (Math.random() - 0.5) * 5;
                newSoc = Math.min(100, prev.soc + 0.1);
                newVoltage = 400 + (Math.random() - 0.5) * 2;
                if (isVoltageImbalanceEvent) {
                    newVoltage = 407 + Math.random() * 2;
                }
                break;
            case 'discharging':
                newCurrent = isHighDischargeEvent ? -85 + (Math.random() - 0.5) * 10 : -40 + (Math.random() - 0.5) * 10;
                newSoc = Math.max(0, prev.soc - 0.05);
                newVoltage = 385 + (Math.random() - 0.5) * 5;
                break;
            case 'idle':
                newCurrent = (Math.random() - 0.5) * 0.5;
                newVoltage = 390 + (Math.random() - 0.5) * 1;
                break;
        }

        let newTemp = tempAnomalyTriggered
          ? Math.min(55, prev.pack_temp + Math.random() * 2)
          : Math.max(35, prev.pack_temp - Math.random() * 0.5);
          
        if (!tempAnomalyTriggered && prev.pack_temp > 40) {
            newTemp = prev.pack_temp - 0.2;
        } else if (!tempAnomalyTriggered) {
             newTemp += (Math.random() - 0.4); // Natural temp fluctuation
             newTemp = Math.max(30, Math.min(45, newTemp));
        }

        if (isHeatSpikeEvent && !tempAnomalyTriggered) {
            newTemp += 6 + Math.random() * 4;
        }
        
        if (voltageAnomalyTriggered) {
            newVoltage -= 20;
        }

        if (currentAnomalyTriggered && newChargingState === 'charging') {
            newCurrent = 100 + Math.random() * 10;
        }

        const newPoint: TelemetryDataPoint = {
            ...prev,
            pack_temp: parseFloat(newTemp.toFixed(1)),
            soc: parseFloat(newSoc.toFixed(1)),
            voltage: parseFloat(newVoltage.toFixed(1)),
            current: parseFloat(newCurrent.toFixed(1)),
            charging_state: newChargingState,
            cycle_count: newCycleCount,
            time: Date.now(),
        };

        setTelemetryHistory(prevHist => {
            const updated = [...prevHist, newPoint];
            return updated.slice(-50);
        });

        // Update alerts based on the new telemetry, only if no fault is manually injected
        if (!injectedFault) {
          setAlerts(determineAlerts(newPoint, bhiRef.current));
        }

        // Calculate carbon impact
        let impact = 5; // Base impact
        if (newPoint.charging_state === 'charging') {
            if (newPoint.current > 70) { // Fast charging
                impact += 7;
            } else if (newPoint.current > 40) {
                impact += 4;
            }
            if (newPoint.ambient.temp > 30) {
                impact += 4;
            }
            if (newPoint.soc > 85) { // Topping off
                impact += 2;
            }
        }
        setCarbonImpact(impact + (Math.random() - 0.5));
        
        return newPoint;
      });
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (faultTimeoutRef.current) clearTimeout(faultTimeoutRef.current);
    };
  }, [isLive, injectedFault]);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (currentRole === Role.User) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <DashboardCard title="Battery Health Index (BHI)" className="flex items-center justify-center">
                <BHIDisplay bhi={bhi} />
              </DashboardCard>
              <DashboardCard title="Key Alerts & Eco-Metric">
                 <div className="h-full flex flex-col space-y-4">
                    <EcoMetricDisplay carbonImpact={carbonImpact} />
                    <div className="flex-grow overflow-y-auto pr-2">
                        <AnomalyAlerts alerts={alerts.slice(0, 2)} />
                    </div>
                </div>
              </DashboardCard>
              <DashboardCard title="AI Charging Strategy" className="md:col-span-2">
                 <RLStrategyRecommendation telemetry={telemetry} bhi={bhi} />
              </DashboardCard>
            </div>
          );
        }
        // OEM View (Default)
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            <div className="xl:col-span-1 grid gap-6" style={{ gridTemplateRows: 'auto 1fr' }}>
              <DashboardCard title="Battery Health Index (BHI)" className="flex items-center justify-center">
                <BHIDisplay bhi={bhi} />
              </DashboardCard>
              <DashboardCard title="BHI Details">
                <BHIDetails projectedLife={8.5} efficiency={98.2} />
              </DashboardCard>
            </div>
            <DashboardCard title="BHI Trend (Last 6 Months)" className="lg:col-span-2 xl:col-span-3 min-h-[30rem]">
              <BHITrendChart data={BHI_TREND_DATA} />
            </DashboardCard>
            <DashboardCard title="BHI Negative Contributors" className="lg:col-span-2 xl:col-span-2">
              <BHIContributors data={bhiContributors} />
            </DashboardCard>
             <DashboardCard title="Live Anomaly Alerts & Eco-Metric" className="lg:col-span-1 xl:col-span-2">
                <div className="h-full flex flex-col space-y-4">
                    <EcoMetricDisplay carbonImpact={carbonImpact} />
                    <div className="flex-grow overflow-y-auto pr-2">
                        <AnomalyAlerts alerts={alerts} />
                    </div>
                </div>
            </DashboardCard>
          </div>
        );
      case 'telemetry':
         if (currentRole !== Role.OEM) {
           return <div className="flex items-center justify-center h-full text-gray-500 text-lg">Telemetry view is only available for OEM users.</div>;
         }
         return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fade-in">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <DashboardCard title="Live Vehicle Telemetry">
                  <VehicleTelemetryDisplay data={telemetry} anomalousField={anomalousField} />
                </DashboardCard>
                <DashboardCard title="Fault Injection & Stress Testing">
                    <FaultInjectionPanel onInjectFault={handleInjectFault} isLive={isLive} activeFault={injectedFault}/>
                </DashboardCard>
            </div>
            <DashboardCard title="Real-time Telemetry Charts" className="lg:col-span-2">
               <TelemetryCharts data={telemetryHistory} />
            </DashboardCard>
          </div>
        );
      case 'analysis':
         if (currentRole === Role.User) {
            return (
              <div className="animate-fade-in">
                <DashboardCard title="AI Charging Recommendations">
                   <ChargingRecommendations telemetry={telemetry} bhi={bhi} />
                </DashboardCard>
              </div>
            );
         }
         // OEM View
         return (
          <div className="animate-fade-in h-full">
            <ForecastPanel bhi={bhi} telemetry={telemetry} />
          </div>
        );
      case 'alerts':
        if (currentRole === Role.OEM) {
          return (
            <div className="animate-fade-in h-full">
              <DashboardCard title="Live Anomaly Alerts" className="h-full max-h-[85vh] overflow-y-auto">
                <AnomalyAlerts alerts={alerts} />
              </DashboardCard>
            </div>
          );
        }
        // Fallback for User role
        return (
          <div className="animate-fade-in">
            <DashboardCard title="Alert Log">
              <AnomalyAlerts alerts={alerts} />
            </DashboardCard>
          </div>
        );
      case 'about':
        return <AboutPage />;
      default:
        return null;
    }
  };

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex">
      <div className="fixed inset-0 bg-[url('https://tailwindcss.com/_next/static/media/hero-dark@90.dba36cdf.jpg')] bg-cover bg-center opacity-5"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900"></div>
      
      <div className="relative flex w-full">
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          isLive={isLive}
          setIsLive={setIsLive}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
