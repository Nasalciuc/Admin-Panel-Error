import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Edit3 } from 'lucide-react';
import { useLeads } from '../../../shared/hooks/useLeads';
import { Badge } from '../../../shared/components/Badge';
import { Modal } from '../../../shared/components/Modal';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Avatar } from '../../../shared/components/Avatar';
import { ScoreBadge } from '../../../shared/components/ScoreBadge';
import { SearchInput } from '../../../shared/components/SearchInput';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { Toast } from '../../../shared/components/Toast';
import { leadsToCSV, downloadCSV } from '../../../shared/utils/export';
import { formatPhone } from '../../../shared/utils/formatters';
import type { Lead } from '../../../shared/types';

const INTENTS = ['Flight Booking', 'Price Inquiry', 'Route Information'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];

interface LeadForm {
  name: string;
  email: string;
  phone: string;
  route: string;
  intent: Lead['intent'];
  score: number;
  status: Lead['status'];
  notes: string;
}

const emptyForm: LeadForm = { name: '', email: '', phone: '', route: '', intent: 'Flight Booking', score: 75, status: 'New', notes: '' };

const Leads: React.FC = () => {
  const { leads, add, update, remove, filter, refresh } = useLeads();
  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Apply filters
  useEffect(() => {
    if (!search && !intentFilter && !statusFilter) {
      refresh();
    } else {
      filter({ search, intent: intentFilter || undefined, status: statusFilter || undefined });
    }
  }, [search, intentFilter, statusFilter, filter, refresh]);

  const openAdd = () => {
    setEditLead(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setForm({ name: lead.name, email: lead.email, phone: lead.phone, route: lead.route, intent: lead.intent, score: lead.score, status: lead.status, notes: lead.notes });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    const clampedScore = Math.max(0, Math.min(100, form.score));
    const validatedForm = { ...form, score: clampedScore };
    if (editLead) {
      update(editLead.id, validatedForm);
    } else {
      add(validatedForm);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      remove(deleteId);
      setDeleteId(null);
    }
  };

  const handleExportCSV = () => {
    const csv = leadsToCSV(leads);
    downloadCSV(csv, `bbc-leads-${Date.now()}.csv`);
    setToast('Leads exported successfully!');
  };

  const setField = (key: keyof LeadForm, value: string | number) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{leads.length} total leads captured</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-navy-900)] rounded-lg hover:bg-[var(--color-navy-800)] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search leads..." className="flex-1 min-w-[200px] max-w-sm" />
        <select value={intentFilter} onChange={e => setIntentFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20">
          <option value="">All Intents</option>
          {INTENTS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <EmptyState title="No leads found" description="Adjust your filters or add a new lead." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Route</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Intent</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Score</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                          {lead.tags && lead.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {lead.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{lead.route}</td>
                    <td className="px-5 py-3.5"><Badge label={lead.intent} variant="intent" /></td>
                    <td className="px-5 py-3.5"><ScoreBadge score={lead.score} /></td>
                    <td className="px-5 py-3.5"><Badge label={lead.status} variant="status" /></td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <span className="text-xs">{formatPhone(lead.phone)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(lead)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editLead ? 'Edit Lead' : 'Add New Lead'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-navy-900)] rounded-lg hover:bg-[var(--color-navy-800)] transition-colors">
              {editLead ? 'Save Changes' : 'Add Lead'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input value={form.name} onChange={e => setField('name', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setField('phone', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
              <input value={form.route} onChange={e => setField('route', e.target.value)} placeholder="e.g. NYC → LHR" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intent</label>
              <select value={form.intent} onChange={e => setField('intent', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20">
                {INTENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input type="number" min={0} max={100} value={form.score} onChange={e => {
                const val = parseInt(e.target.value);
                setField('score', isNaN(val) ? 0 : val);
              }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setField('status', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setField('notes', e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)] resize-none" />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Toast */}
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default Leads;
