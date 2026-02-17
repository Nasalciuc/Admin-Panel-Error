import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import { Building2, Star, Plane, CalendarCheck, HelpCircle } from 'lucide-react';
import { useKB } from '../../../shared/hooks/useKB';
import { Modal } from '../../../shared/components/Modal';
import { EmptyState } from '../../../shared/components/EmptyState';
import type { KBCategory, KBEntry } from '../../../shared/types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2, Star, Plane, CalendarCheck, HelpCircle,
};

const KnowledgeBase: React.FC = () => {
  const { categories, addEntry, updateEntry, removeEntry } = useKB();
  const [selectedCat, setSelectedCat] = useState<KBCategory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<KBEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ catId: string; entryId: string } | null>(null);

  const openAdd = () => {
    setEditEntry(null);
    setTitle('');
    setContent('');
    setModalOpen(true);
  };

  const openEdit = (entry: KBEntry) => {
    setEditEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !selectedCat) return;
    if (editEntry) {
      updateEntry(selectedCat.id, editEntry.id, { title: title.trim(), content: content.trim() });
    } else {
      addEntry(selectedCat.id, title.trim(), content.trim());
    }
    setModalOpen(false);
    // Refresh the selected category view
    const updated = categories.find(c => c.id === selectedCat.id);
    if (updated) setSelectedCat({ ...updated });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      removeEntry(deleteTarget.catId, deleteTarget.entryId);
      setDeleteTarget(null);
      const updated = categories.find(c => c.id === deleteTarget.catId);
      if (updated) setSelectedCat({ ...updated });
    }
  };

  // Category Grid View
  if (!selectedCat) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">Manage AI training content across categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || BookOpen;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-left hover:border-gray-300 hover:shadow transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cat.iconBg} ${cat.iconColor}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--color-navy-900)] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.entries.length} entries</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-navy-800)] transition-all"
                      style={{ width: `${Math.min(100, (cat.entries.length / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Category Entries View
  const IconComp = ICON_MAP[selectedCat.icon] || BookOpen;
  const currentEntries = categories.find(c => c.id === selectedCat.id)?.entries || selectedCat.entries;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedCat(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedCat.iconBg} ${selectedCat.iconColor}`}>
            <IconComp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{selectedCat.name}</h1>
            <p className="text-sm text-gray-500">{currentEntries.length} entries</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-navy-900)] rounded-lg hover:bg-[var(--color-navy-800)] transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {currentEntries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState
              title="No entries yet"
              description="Add your first knowledge base entry for this category."
              action={
                <button onClick={openAdd} className="text-sm text-[var(--color-navy-900)] hover:underline font-medium">
                  + Add Entry
                </button>
              }
            />
          </div>
        ) : (
          currentEntries.map(entry => (
            <div key={entry.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{entry.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{entry.content}</p>
                  <p className="text-xs text-gray-400 mt-2">Updated {new Date(entry.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  <button onClick={() => openEdit(entry)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget({ catId: selectedCat.id, entryId: entry.id })} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editEntry ? 'Edit Entry' : 'Add New Entry'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-navy-900)] rounded-lg hover:bg-[var(--color-navy-800)] transition-colors">
              {editEntry ? 'Save Changes' : 'Add Entry'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-800)]/20 focus:border-[var(--color-navy-800)] resize-none" />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Entry"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">Are you sure you want to delete this entry? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default KnowledgeBase;
