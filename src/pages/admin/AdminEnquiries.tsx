import { useEffect, useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, Loader2, Mail, Phone, Building2, Tag, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const PP = 'Poppins, sans-serif';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function EnquiryCard({ enq, onDelete, onReadChange }: {
  enq: Enquiry;
  onDelete: (id: string) => void;
  onReadChange: (id: string, read: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(!enq.read);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => setConfirmOpen(true);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/enquiries/${enq._id}`).catch(() => {});
      onDelete(enq._id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const toggleRead = async () => {
    setToggling(true);
    try {
      await api.patch(`/enquiries/${enq._id}`, { read: !enq.read });
      onReadChange(enq._id, !enq.read);
      if (!enq.read) setExpanded(false);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${enq.read ? 'border-gray-100' : 'border-blue-200'}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Unread dot */}
        <div className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: enq.read ? 'transparent' : '#3b82f6' }} />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>
            {enq.name}
            {enq.company && <span className="font-normal text-gray-400"> · {enq.company}</span>}
          </p>
          <p className="text-xs text-gray-400 truncate" style={{ fontFamily: PP }}>
            {enq.service || 'General Enquiry'} · {enq.email}
          </p>
        </div>

        <p className="shrink-0 text-xs text-gray-400 hidden md:block" style={{ fontFamily: PP }}>
          {fmtDate(enq.createdAt)}
        </p>

        <button
          onClick={() => setExpanded(e => !e)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 py-5 space-y-4">
          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" style={{ fontFamily: PP }}>
            <a href={`mailto:${enq.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors">
              <Mail size={13} className="shrink-0" /> {enq.email}
            </a>
            <a href={`tel:${enq.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors">
              <Phone size={13} className="shrink-0" /> {enq.phone}
            </a>
            {enq.company && (
              <span className="flex items-center gap-2 text-gray-600">
                <Building2 size={13} className="shrink-0" /> {enq.company}
              </span>
            )}
            {enq.service && (
              <span className="flex items-center gap-2 text-gray-600">
                <Tag size={13} className="shrink-0" /> {enq.service}
              </span>
            )}
          </div>

          {/* Message */}
          {enq.message && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: PP, color: 'var(--primary)' }}>
                <MessageSquare size={11} className="inline mr-1" />Message
              </p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl px-4 py-3"
                style={{ fontFamily: PP }}>
                {enq.message}
              </p>
            </div>
          )}

          {/* Received on mobile */}
          <p className="text-xs text-gray-400 md:hidden" style={{ fontFamily: PP }}>
            Received: {fmtDate(enq.createdAt)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={toggleRead}
              disabled={toggling}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-gray-50 disabled:opacity-60"
              style={{ fontFamily: PP, color: '#6b7280', borderColor: '#e5e7eb' }}>
              {toggling
                ? <Loader2 size={12} className="animate-spin" />
                : enq.read ? <EyeOff size={12} /> : <Eye size={12} />}
              {enq.read ? 'Mark unread' : 'Mark as read'}
            </button>
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-red-50 disabled:opacity-60"
              style={{ fontFamily: PP, color: '#b91c1c', borderColor: '#fca5a5' }}>
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Delete
            </button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete enquiry?"
        message={`Delete the enquiry from “${enq.name}”? This action cannot be undone.`}
        busy={deleting}
        onCancel={() => { if (!deleting) setConfirmOpen(false); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<Enquiry[]>('/enquiries')
      .then(setEnquiries)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => setEnquiries(prev => prev.filter(e => e._id !== id));
  const handleReadChange = (id: string, read: boolean) =>
    setEnquiries(prev => prev.map(e => e._id === id ? { ...e, read } : e));

  const filtered = enquiries.filter(e => {
    if (filterRead === 'unread' && e.read) return false;
    if (filterRead === 'read' && !e.read) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q)
        || e.email.toLowerCase().includes(q)
        || e.company.toLowerCase().includes(q)
        || e.service.toLowerCase().includes(q)
        || e.message.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = enquiries.filter(e => !e.read).length;

  if (loading) return <p className="text-gray-400 text-sm" style={{ fontFamily: PP }}>Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            Contact Enquiries
          </h1>
          <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: PP }}>
            {enquiries.length} total enquir{enquiries.length !== 1 ? 'ies' : 'y'}
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb' }}>
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {error && <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, service or message…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] px-4 py-2 rounded-xl border text-sm outline-none focus:border-[var(--primary)] transition-colors"
          style={{ fontFamily: PP, borderColor: '#e5e7eb' }}
        />
        <select value={filterRead} onChange={e => setFilterRead(e.target.value as typeof filterRead)}
          className="px-4 py-2 rounded-xl border text-sm outline-none"
          style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
          <option value="all">All Enquiries</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: PP }}>
            {enquiries.length === 0 ? 'No contact enquiries yet.' : 'No enquiries match your filters.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(enq => (
          <EnquiryCard
            key={enq._id}
            enq={enq}
            onDelete={handleDelete}
            onReadChange={handleReadChange}
          />
        ))}
      </div>
    </div>
  );
}
