/**
 * Reusable confirmation dialog for destructive actions.
 * Replaces inline delete confirmations in Leads.tsx and KnowledgeBase.tsx.
 *
 * Usage:
 * <ConfirmDialog
 *   open={!!deleteId}
 *   title="Delete Lead"
 *   message="Are you sure? This action cannot be undone."
 *   confirmLabel="Delete"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={() => setDeleteId(null)}
 * />
 */
import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger: {
    icon: 'bg-red-100 text-red-600',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: 'bg-amber-100 text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
};

export const ConfirmDialog: React.FC<Props> = ({
  open, title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel,
}) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <Modal open={open} onClose={onCancel} title="">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${styles.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
