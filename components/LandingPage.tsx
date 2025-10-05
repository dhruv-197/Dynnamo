import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
        {/* Background Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1633999993322-9214c7606e93?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold text-white tracking-wider">DynamoX</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-200/80 mb-12 max-w-2xl">
                AI-Powered EV Safety & Reliability for India’s Diverse Climate Conditions
            </p>
            <button
                onClick={onGetStarted}
                className="px-8 py-4 text-lg font-semibold text-white bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transform hover:-translate-y-1 transition-all duration-300"
            >
                Get Started
            </button>
        </div>
    </div>
  );
};

export default LandingPage;