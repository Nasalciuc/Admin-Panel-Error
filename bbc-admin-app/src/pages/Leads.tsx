import { Search, Filter, Download } from 'lucide-react'
import { leads } from '../data/mock'
import type { LeadStatus } from '../types'

const statusStyles: Record<LeadStatus, string> = {
  new: 'bg-emerald-500 text-white',
  contacted: 'bg-blue-100 text-blue-600',
  qualified: 'bg-purple-100 text-purple-600',
  converted: 'bg-gold-500 text-black',
  lost: 'bg-gray-100 text-gray-500',
}

export default function Leads() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-sm text-gray-400 mt-1">{leads.length} total leads captured by AI chatbot</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500 w-64"
            />
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg border border-gray-200">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border-t-4 border-gold-500 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Route</th>
              <th className="px-6 py-3 font-medium">Intent</th>
              <th className="px-6 py-3 font-medium">Score</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${lead.avatarColor} flex items-center justify-center font-bold text-[10px]`}>
                    {lead.initials}
                  </div>
                  <span className="font-bold text-gray-800">{lead.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{lead.email}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{lead.phone}</td>
                <td className="px-6 py-4 text-gray-500 font-medium">{lead.route}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-900/10 text-blue-900 px-3 py-1 rounded-full text-[11px] font-medium">
                    {lead.intent}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {lead.isGold ? (
                    <div className="flex items-center space-x-1.5 bg-yellow-500 text-white px-2 py-0.5 rounded-full w-fit">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="text-[10px] font-bold">{lead.score} GOLD</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 font-bold">{lead.score}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`${statusStyles[lead.status]} px-3 py-1 rounded-full text-[10px] font-bold uppercase`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">{lead.timeAgo}</td>
                <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">•••</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <span>Showing 1-{leads.length} of {leads.length}</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-navy-900 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
