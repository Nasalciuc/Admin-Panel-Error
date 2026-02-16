import { Search, Filter, Plus } from 'lucide-react'
import { conversations, johnThompsonConversation } from '../data/mock'

export default function Conversations() {
  const detail = johnThompsonConversation

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <a href="/" className="text-blue-500 font-medium">Dashboard</a>
          <span>/</span>
          <span className="text-gray-600">Conversations</span>
          <span>/</span>
          <span className="text-gray-600">Session {detail.sessionId}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full border border-gray-100">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full border border-gray-100">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-gold-500 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center">
            <Plus className="w-4 h-4 mr-1" /> New Conversation
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List (narrow) */}
        <div className="w-72 bg-white border-r border-gray-100 overflow-y-auto shrink-0">
          <div className="p-4 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition ${
                c.id === '1' ? 'bg-blue-50/50 border-l-2 border-l-gold-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${c.visitor.avatarColor} flex items-center justify-center font-bold text-[10px]`}>
                  {c.visitor.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800 truncate">{c.visitor.name}</span>
                    <span className="text-[10px] text-gray-400">{c.timeAgo}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {c.messages[c.messages.length - 1]?.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-blue-900/10 text-blue-900 px-2 py-0.5 rounded-full text-[10px] font-medium">{c.intent}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  c.status === 'active' ? 'bg-green-500' : c.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white overflow-y-auto p-8 border-r border-gray-100">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">{detail.visitor.name}</h2>
                <a href="#" className="text-blue-500 text-sm hover:underline">{detail.visitor.email}</a>
                <span className="text-gray-400 text-sm">Session: {detail.sessionId}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Lead Captured</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">Duration: {detail.duration}</span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">Messages: {detail.messageCount}</span>
              <span className="bg-navy-900 text-white text-[10px] px-2 py-0.5 rounded-full">Intent: {detail.intent}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 my-4 uppercase tracking-widest font-medium">Today, 2:34 PM</div>

          <div className="space-y-6">
            {detail.messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'visitor' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tight">
                  {msg.role === 'visitor' ? 'Visitor' : 'AI Assistant'}
                </span>
                <div className={`p-4 max-w-lg text-sm leading-relaxed ${
                  msg.role === 'visitor'
                    ? 'bg-navy-900 text-white rounded-xl rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-xl rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Route Card */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tight">AI Assistant</span>
              <div className="border border-emerald-200 bg-emerald-50/20 p-4 max-w-lg w-full rounded-xl rounded-tl-none">
                <p className="text-sm mb-3">Thank you, John. Based on your preferences, here is a popular route option:</p>
                <div className="border border-emerald-100 bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">✈️ NYC → LON Route</span>
                    <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full font-bold">Est. from $2,800 - $4,500</span>
                  </div>
                  <div className="flex text-[11px] text-gray-500 space-x-4">
                    <div><span className="block font-bold text-gray-800">JFK → LHR</span> Non-stop | ~7h 15m</div>
                    <div><span className="block font-bold text-gray-800">Airlines:</span> Delta, British Airways</div>
                  </div>
                  <div className="mt-2 text-[11px] text-blue-500 font-bold uppercase tracking-tight">Oct 15 - Oct 22</div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">2:36 PM</span>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-auto pt-6">
            <div className="flex items-center space-x-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              <input
                type="text"
                placeholder="Type a message (read-only admin view)..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
                disabled
              />
              <button className="bg-gold-500 text-black px-4 py-1.5 rounded-lg text-sm font-bold" disabled>Send</button>
            </div>
          </div>
        </section>

        {/* Right Sidebar — Lead Details */}
        <aside className="w-80 bg-slate-50 overflow-y-auto p-6 flex flex-col space-y-6 shrink-0">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
            <h3 className="flex items-center text-sm font-bold text-emerald-800 mb-4">
              <span className="w-4 h-4 mr-2 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
              Lead Details
            </h3>
            <div className="space-y-3">
              <div><p className="text-[10px] uppercase text-gray-400 font-bold">Name</p><p className="text-sm font-medium">John Thompson</p></div>
              <div><p className="text-[10px] uppercase text-gray-400 font-bold">Email</p><p className="text-sm font-medium">john.thompson@email.com</p></div>
              <div><p className="text-[10px] uppercase text-gray-400 font-bold">Phone</p><p className="text-xs text-gray-400 italic">(Optional, not provided)</p></div>
              <div><p className="text-[10px] uppercase text-gray-400 font-bold">Route Interest</p><p className="text-sm font-medium">NYC (JFK) → London (LHR)</p></div>
              <div><p className="text-[10px] uppercase text-gray-400 font-bold">Dates</p><p className="text-sm font-medium">Oct 15 - Oct 22</p></div>
            </div>
            <button className="w-full bg-gold-500 text-black text-sm font-bold py-2.5 rounded-lg mt-5 flex items-center justify-center">
              Contact Lead <span className="ml-2">→</span>
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-tight">Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="font-bold">Messages Count</span><span>8</span></div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-navy-900 h-full w-[80%] rounded-full" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="font-bold">Duration</span><span>4m 32s</span></div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-navy-900 h-full w-[60%] rounded-full" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="font-bold">First Response Time</span><span>1.2s</span></div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden"><div className="bg-navy-900 h-full w-[15%] rounded-full" /></div>
              </div>
              <div className="pt-2 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Intent Breakdown</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">Flight Booking (90%), Information (10%)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white border border-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-lg shadow-sm hover:bg-gray-50">Export Transcript</button>
            <button className="w-full bg-white border border-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-lg shadow-sm hover:bg-gray-50">Flag for Review</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
