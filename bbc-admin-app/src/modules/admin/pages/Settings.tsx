import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your admin panel preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
          <SettingsIcon className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 font-display mb-1">Coming Soon</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Settings will be available in the next update. This will include chatbot configuration, notification preferences, and team management.
        </p>
      </div>
    </div>
  );
};

export default Settings;
