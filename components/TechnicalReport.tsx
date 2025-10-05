import React from 'react';
import DashboardCard from './DashboardCard';
import { SparklesIcon, CogIcon, ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/outline';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-cyan-300 mb-3 border-b-2 border-cyan-500/20 pb-2">{title}</h3>
    <div className="text-gray-300 space-y-4 text-base leading-relaxed">{children}</div>
  </div>
);

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4 p-4 bg-gray-900/40 rounded-lg">
        <div className="flex-shrink-0 text-cyan-400">{icon}</div>
        <div>
            <h4 className="font-semibold text-gray-100">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <DashboardCard title="About DynamoX">
        <div className="max-h-[80vh] overflow-y-auto pr-4 text-gray-300">
          <Section title="Our Mission">
            <p>
              DynamoX is an AI-powered dashboard designed to enhance the safety, reliability, and lifespan of Electric Vehicle (EV) batteries. Our mission is to provide proactive, data-driven insights that empower EV owners, manufacturers (OEMs), and regulatory bodies to mitigate risks associated with battery degradation, especially in challenging and diverse climate conditions.
            </p>
          </Section>

          <Section title="Core Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Feature 
                    icon={<ShieldCheckIcon className="w-8 h-8"/>} 
                    title="Battery Health Monitoring"
                    description="Calculates a real-time Battery Health Index (BHI) and uses anomaly detection to identify immediate risks like thermal spikes and voltage sags."
                />
                 <Feature 
                    icon={<SparklesIcon className="w-8 h-8"/>} 
                    title="AI-Powered Recommendations"
                    description="A Reinforcement Learning agent analyzes live telemetry to provide optimal, context-aware charging strategies that prioritize long-term battery health."
                />
                 <Feature 
                    icon={<UsersIcon className="w-8 h-8"/>} 
                    title="Multi-Role Dashboard"
                    description="Provides tailored views for End Users, OEMs, and Government agencies, offering relevant data and actionable insights for each stakeholder."
                />
                <Feature 
                    icon={<CogIcon className="w-8 h-8"/>} 
                    title="Interactive Simulation"
                    description="Features a live data feed and a fault injection panel, allowing for robust stress testing and demonstration of the system's responsiveness."
                />
            </div>
          </Section>
          
          <Section title="Technology Stack">
            <p>
              This prototype is built with a modern frontend stack to showcase its intelligent features.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Frontend:</strong> React with TypeScript and Tailwind CSS for a responsive and visually rich user interface.</li>
              <li><strong>Data Visualization:</strong> Recharts for dynamic and interactive telemetry charts.</li>
              <li><strong>AI & Machine Learning:</strong> A sophisticated rule-based system and simulated Reinforcement Learning agent to power contextual charging recommendations.</li>
            </ul>
          </Section>

           <Section title="The DynamoX Vision">
            <p>
              We believe that the future of mobility is electric, but its success hinges on safety and reliability. By harnessing the power of AI, DynamoX aims to build trust in EV technology by making battery management smarter, safer, and more transparent for everyone.
            </p>
          </Section>
        </div>
      </DashboardCard>
    </div>
  );
};

export default AboutPage;