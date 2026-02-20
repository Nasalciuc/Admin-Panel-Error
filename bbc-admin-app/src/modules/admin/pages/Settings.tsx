import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../shared/hooks/useSettings';
import { Toast } from '../../../shared/components/Toast';
import type { AppSettings } from '../../../shared/types';

type TabType = 'general' | 'greetings' | 'hours' | 'ai' | 'notifications';

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const Settings: React.FC = () => {
  const { settings, update } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [form, setForm] = useState<AppSettings>(settings);
  const [toast, setToast] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setForm({ ...form, [key]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    update(form);
    setIsDirty(false);
    setToast('Settings saved successfully!');
  };

  const handleToggle = (key: keyof AppSettings) => {
    setForm({ ...form, [key]: !form[key] });
    setIsDirty(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your business class chatbot</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            {[
              { id: 'general', label: 'General' },
              { id: 'greetings', label: 'Greetings' },
              { id: 'hours', label: 'Business Hours' },
              { id: 'ai', label: 'AI Config' },
              { id: 'notifications', label: 'Notifications' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[var(--color-navy-900)] text-[var(--color-navy-900)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={e => handleChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Widget Position</label>
                <select
                  value={form.widgetPosition}
                  onChange={e => handleChange('widgetPosition', e.target.value as 'bottom-right' | 'bottom-left')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Timezone</label>
                <select
                  value={form.businessTimezone}
                  onChange={e => handleChange('businessTimezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Greetings Tab */}
          {activeTab === 'greetings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Greeting</label>
                <textarea
                  value={form.salesGreeting}
                  onChange={e => handleChange('salesGreeting', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Greeting</label>
                <textarea
                  value={form.supportGreeting}
                  onChange={e => handleChange('supportGreeting', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Auto-reply After Hours</label>
                  <button
                    onClick={() => handleToggle('autoReplyAfterHours')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.autoReplyAfterHours ? 'bg-[var(--color-navy-900)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        form.autoReplyAfterHours ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {form.autoReplyAfterHours && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">After-Hours Message</label>
                  <textarea
                    value={form.afterHoursMessage}
                    onChange={e => handleChange('afterHoursMessage', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                  />
                </div>
              )}
            </div>
          )}

          {/* Business Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={form.businessHoursStart}
                    onChange={e => handleChange('businessHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={form.businessHoursEnd}
                    onChange={e => handleChange('businessHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Hours are in {form.businessTimezone} timezone</p>
            </div>
          )}

          {/* AI Config Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default AI Model</label>
                <select
                  value={form.aiModel}
                  onChange={e => handleChange('aiModel', e.target.value as 'haiku' | 'sonnet')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                >
                  <option value="haiku">Claude Haiku (Fast & Cheap)</option>
                  <option value="sonnet">Claude Sonnet (Smart & Precise)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {form.aiModel === 'haiku'
                    ? 'Haiku is recommended for most cases. Faster & cheaper.'
                    : 'Sonnet is for complex reasoning. Slower & more expensive.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max AI Messages Per Conversation</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={form.maxAIMessagesPerConv}
                  onChange={e => handleChange('maxAIMessagesPerConv', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Lead Notifications</h3>
                  <p className="text-xs text-gray-500">Get notified when new leads are captured</p>
                </div>
                <button
                  onClick={() => handleToggle('enableLeadNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.enableLeadNotifications ? 'bg-[var(--color-navy-900)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      form.enableLeadNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Slack Notifications</h3>
                  <p className="text-xs text-gray-500">Send notifications to your Slack workspace</p>
                </div>
                <button
                  onClick={() => handleToggle('enableSlackNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.enableSlackNotifications ? 'bg-[var(--color-navy-900)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      form.enableSlackNotifications ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {form.enableSlackNotifications && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slack Webhook URL</label>
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={form.slackWebhookUrl}
                    onChange={e => handleChange('slackWebhookUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-900)]/20"
                  />
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`bg-[var(--color-navy-900)] hover:bg-[var(--color-navy-900)]/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default Settings;
