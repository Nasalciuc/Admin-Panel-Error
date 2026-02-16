import { Search, Calendar, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { leads } from '../data/mock'
import type { LeadStatus } from '../types'

const statusStyles: Record<LeadStatus, string> = {
  new: 'bg-emerald-500 text-white',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-purple-100 text-purple-700',
  converted: 'bg-gold-500 text-black',
  lost: 'bg-gray-100 text-gray-500',
}

const intentDotColor: Record<string, string> = {
  'Flight Booking': 'bg-amber-400',
  'Price Inquiry': 'bg-gray-400',
  'Route Information': 'bg-emerald-400',
  'Support': 'bg-blue-400',
  'General': 'bg-gray-300',
  'Booking Inquiry': 'bg-amber-400',
}

export default function Leads() {
  const totalLeads = 38

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-extrabold text-gray-900 font-display">Captured Leads</h1>
          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
            {totalLeads} leads
          </span>
        </div>
        <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          Export CSV
        </button>
      </header>

      {/* Filters Bar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 bg-white"
          />
        </div>
        <select className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-gold-500 min-w-[140px]">
          <option>All Intents</option>
          <option>Flight Booking</option>
          <option>Price Inquiry</option>
          <option>Route Information</option>
          <option>Support</option>
        </select>
        <select className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-gold-500 min-w-[130px]">
          <option>All Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Converted</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          <span>Date range</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Title */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Main Table</h2>
        </div>

        <table className="w-full text-left">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Phone</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Route</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Intent</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Score</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Time</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${lead.avatarColor} flex items-center justify-center font-bold text-xs`}>
                      {lead.initials}
                    </div>
                    <span className="font-medium text-gray-900">{lead.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{lead.email}</td>
                <td className="px-6 py-4 text-gray-500">{lead.phone}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{lead.route}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${intentDotColor[lead.intent] || 'bg-gray-300'}`} />
                    <span className="text-gray-700">{lead.intent}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {lead.isGold ? (
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                      <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded font-bold">
                        {lead.score} GOLD
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 font-medium">{lead.score}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`${statusStyles[lead.status]} px-3 py-1 rounded text-xs font-semibold capitalize`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{lead.timeAgo}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">1-20</span> of {totalLeads} leads
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
