import { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confirmRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}>
      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-message"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100"
        onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start gap-3 px-5 py-5 border-b border-gray-100">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={19} />
          </div>
          <div className="flex-1">
            <h2 id="admin-confirm-title" className="font-bold text-base text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {title}
            </h2>
            <p id="admin-confirm-message" className="mt-1.5 text-sm leading-relaxed text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {message}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close confirmation dialog"
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40">
            <X size={17} />
          </button>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 bg-gray-50/70">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={busy}
            onClick={() => void onConfirm()}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            {busy && <Loader2 size={15} className="animate-spin" />}
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}