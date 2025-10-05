import React from 'react';
import { Role, Page } from '../types';
import LiveFeedToggle from './LiveFeedToggle';
import { 
    ChartPieIcon, 
    SignalIcon, 
    BeakerIcon, 
    BellAlertIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ page, currentPage, onClick, icon, label }) => (
  <button
    onClick={() => onClick(page)}
    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      currentPage === page
        ? 'bg-cyan-500/20 text-cyan-300'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const RoleButton: React.FC<{ role: Role; currentRole: Role; onClick: (role: Role) => void }> = ({ role, currentRole, onClick }) => (
  <button
    onClick={() => onClick(role)}
    className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors duration-200 ${
      currentRole === role
        ? 'bg-cyan-500 text-white shadow-md'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {role}
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, currentRole, setCurrentRole, isLive, setIsLive }) => {
  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-md border-r border-gray-800/50 flex flex-col p-4 space-y-6 z-10">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wider">DynamoX</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem page="dashboard" currentPage={currentPage} onClick={setCurrentPage} icon={<ChartPieIcon className="w-6 h-6" />} label="Dashboard" />
        {currentRole === Role.OEM && (
          <>
            <NavItem page="telemetry" currentPage={currentPage} onClick={setCurrentPage} icon={<SignalIcon className="w-6 h-6" />} label="Telemetry" />
            <NavItem page="analysis" currentPage={currentPage} onClick={setCurrentPage} icon={<BeakerIcon className="w-6 h-6" />} label="Predictive Analysis" />
            <NavItem page="alerts" currentPage={currentPage} onClick={setCurrentPage} icon={<BellAlertIcon className="w-6 h-6" />} label="Alerts" />
            <NavItem page="about" currentPage={currentPage} onClick={setCurrentPage} icon={<InformationCircleIcon className="w-6 h-6" />} label="About" />
          </>
        )}
      </nav>

      <div>
        <div className="px-2 mb-4">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">Live Feed</p>
             <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-3 w-3">
                      {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  </span>
                  <span className={`text-sm font-medium ${isLive ? 'text-green-400' : 'text-gray-400'}`}>{isLive ? 'Active' : 'Paused'}</span>
                </div>
                <LiveFeedToggle isActive={isLive} onToggle={() => setIsLive(!isLive)} />
            </div>
        </div>

        <div className="px-2">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase">View As</p>
            <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
                <RoleButton role={Role.User} currentRole={currentRole} onClick={setCurrentRole} />
                <RoleButton role={Role.OEM} currentRole={currentRole} onClick={setCurrentRole} />
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;