import React from 'react';

interface LiveFeedToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const LiveFeedToggle: React.FC<LiveFeedToggleProps> = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={isActive}
      className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        isActive ? 'bg-green-500' : 'bg-gray-600'
      }`}
    >
      <span className="sr-only">Toggle Live Feed</span>
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default LiveFeedToggle;