import { useState } from 'react'
import { Save, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { defaultSettings } from '../data/mock'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition ${enabled ? 'bg-gold-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [showApiKey, setShowApiKey] = useState(false)

  const updateAI = (key: string, value: string | number) =>
    setSettings((s) => ({ ...s, ai: { ...s.ai, [key]: value } }))

  const toggleLeadCapture = (key: string) =>
    setSettings((s) => ({
      ...s,
      leadCapture: { ...s.leadCapture, [key]: !s.leadCapture[key as keyof typeof s.leadCapture] },
    }))

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure your AI chatbot and admin preferences</p>
      </header>

      <div className="space-y-8">
        {/* AI Configuration */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">AI Configuration</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select
                value={settings.ai.model}
                onChange={(e) => updateAI('model', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              >
                <option>gpt-4-turbo</option>
                <option>gpt-4</option>
                <option>gpt-3.5-turbo</option>
                <option>claude-3-opus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {settings.ai.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.ai.temperature}
                onChange={(e) => updateAI('temperature', parseFloat(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
              <input
                type="number"
                value={settings.ai.maxTokens}
                onChange={(e) => updateAI('maxTokens', parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <textarea
              value={settings.ai.systemPrompt}
              onChange={(e) => updateAI('systemPrompt', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>
        </section>

        {/* Lead Capture */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">Lead Capture Settings</h2>
          <div className="space-y-4">
            {[
              { key: 'enabled', label: 'Enable Lead Capture', desc: 'Allow the AI to capture visitor information' },
              { key: 'captureEmail', label: 'Capture Email', desc: 'Ask visitors for their email address' },
              { key: 'captureName', label: 'Capture Name', desc: 'Ask visitors for their full name' },
              { key: 'capturePhone', label: 'Capture Phone', desc: 'Ask visitors for their phone number' },
              { key: 'captureRoute', label: 'Capture Route', desc: 'Detect and store route preferences' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle
                  enabled={settings.leadCapture[key as keyof typeof settings.leadCapture] as boolean}
                  onChange={() => toggleLeadCapture(key)}
                />
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Score for Gold Badge
              </label>
              <input
                type="number"
                value={settings.leadCapture.minScoreForGold}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    leadCapture: { ...s.leadCapture, minScoreForGold: parseInt(e.target.value) },
                  }))
                }
                className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">Appearance</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, appearance: { ...s.appearance, primaryColor: e.target.value } }))
                  }
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                />
                <span className="text-sm text-gray-500 font-mono">{settings.appearance.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, appearance: { ...s.appearance, accentColor: e.target.value } }))
                  }
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                />
                <span className="text-sm text-gray-500 font-mono">{settings.appearance.accentColor}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              <textarea
                value={settings.appearance.welcomeMessage}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, appearance: { ...s.appearance, welcomeMessage: e.target.value } }))
                }
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </section>

        {/* API Settings */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">API Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:border-gold-500"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
              <input
                type="url"
                value={settings.webhookUrl}
                onChange={(e) => setSettings((s) => ({ ...s, webhookUrl: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <h2 className="font-bold text-red-600 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
          </h2>
          <p className="text-sm text-gray-400 mb-4">Irreversible actions</p>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">
              Reset AI Training
            </button>
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">
              Delete All Leads
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
              Delete All Data
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end pb-8">
          <button className="bg-gold-500 text-black px-6 py-3 rounded-lg font-bold flex items-center shadow-sm hover:bg-gold-600 transition">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
