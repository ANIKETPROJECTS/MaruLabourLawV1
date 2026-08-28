import { useEffect, useState } from 'react';
import { FileText, Trash2, ExternalLink, ChevronDown, ChevronUp, Loader2, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { api } from '../../lib/api';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const PP = 'Poppins, sans-serif';

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  coverNote: string;
  resumeUrl: string;
  resumeName: string;
  careerId: string | null;
  careerTitle: string;
  careerSlug: string;
  careerCategory: 'internal' | 'client';
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
}

const STATUS_STYLES: Record<Application['status'], { bg: string; color: string; label: string }> = {
  new:         { bg: 'rgba(59,130,246,0.1)',  color: '#2563eb', label: 'New' },
  reviewed:    { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', label: 'Reviewed' },
  shortlisted: { bg: 'rgba(22,163,74,0.1)',   color: '#16a34a', label: 'Shortlisted' },
  rejected:    { bg: 'rgba(220,38,38,0.1)',   color: '#dc2626', label: 'Rejected' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function ApplicationCard({ app, onDelete, onStatusChange }: {
  app: Application;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Application['status']) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const s = STATUS_STYLES[app.status];

  const handleDelete = () => setConfirmOpen(true);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/applications/${app._id}`).catch(() => {});
      onDelete(app._id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleStatus = async (status: Application['status']) => {
    setUpdating(true);
    try {
      await api.patch(`/applications/${app._id}`, { status });
      onStatusChange(app._id, status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--p-a09)' }}>
          <User size={16} style={{ color: 'var(--primary)' }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ fontFamily: PP, color: '#111' }}>{app.name}</p>
          <p className="text-xs text-gray-400 truncate" style={{ fontFamily: PP }}>{app.email} · {app.phone}</p>
        </div>

        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: s.bg, color: s.color, fontFamily: PP }}>
          {s.label}
        </span>

        <p className="shrink-0 text-xs text-gray-400 hidden md:block" style={{ fontFamily: PP }}>
          {fmtDate(app.createdAt)}
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
          {/* Contact row */}
          <div className="flex flex-wrap gap-4 text-sm" style={{ fontFamily: PP }}>
            <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-[var(--primary)] transition-colors">
              <Mail size={13} /> {app.email}
            </a>
            <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-[var(--primary)] transition-colors">
              <Phone size={13} /> {app.phone}
            </a>
          </div>

          {/* Resume */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily: PP, color: 'var(--primary)' }}>Resume</p>
            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ fontFamily: PP, color: 'var(--primary)' }}>
              <FileText size={14} /> {app.resumeName || 'View Resume'} <ExternalLink size={11} />
            </a>
          </div>

          {/* Cover note */}
          {app.coverNote && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily: PP, color: 'var(--primary)' }}>
                <MessageSquare size={12} className="inline mr-1" />Cover Note
              </p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line" style={{ fontFamily: PP }}>
                {app.coverNote}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <p className="text-xs text-gray-400 mr-1" style={{ fontFamily: PP }}>Update status:</p>
            {(['new', 'reviewed', 'shortlisted', 'rejected'] as Application['status'][]).map(st => (
              <button key={st}
                onClick={() => handleStatus(st)}
                disabled={updating || app.status === st}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all disabled:opacity-60"
                style={{
                  fontFamily: PP,
                  backgroundColor: app.status === st ? STATUS_STYLES[st].bg : '#f3f4f6',
                  color: app.status === st ? STATUS_STYLES[st].color : '#6b7280',
                }}>
                {updating && app.status !== st ? <Loader2 size={10} className="animate-spin inline" /> : null}
                {STATUS_STYLES[st].label}
              </button>
            ))}
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
        title="Delete application?"
        message={`Delete the application from “${app.name}”? This action cannot be undone.`}
        busy={deleting}
        onCancel={() => { if (!deleting) setConfirmOpen(false); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | 'internal' | 'client'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<Application[]>('/applications')
      .then(setApps)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => setApps(prev => prev.filter(a => a._id !== id));
  const handleStatusChange = (id: string, status: Application['status']) =>
    setApps(prev => prev.map(a => a._id === id ? { ...a, status } : a));

  // Group by job role
  const filtered = apps.filter(a => {
    if (filterCat !== 'all' && a.careerCategory !== filterCat) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q)
        || a.email.toLowerCase().includes(q)
        || a.careerTitle.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by careerTitle (or "Unspecified" if no job)
  const groups = filtered.reduce<Record<string, { category: string; apps: Application[] }>>((acc, a) => {
    const key = a.careerTitle || 'General / Unspecified';
    if (!acc[key]) acc[key] = { category: a.careerCategory, apps: [] };
    acc[key].apps.push(a);
    return acc;
  }, {});

  const newCount = apps.filter(a => a.status === 'new').length;

  if (loading) return <p className="text-gray-400 text-sm" style={{ fontFamily: PP }}>Loading…</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-bold" style={{ fontFamily: PP, fontSize: '1.5rem', color: '#111' }}>
            Job Applications
          </h1>
          <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: PP }}>
            {apps.length} total application{apps.length !== 1 ? 's' : ''}
            {newCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb' }}>
                {newCount} new
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
          placeholder="Search by name, email or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border text-sm outline-none focus:border-[var(--primary)] transition-colors"
          style={{ fontFamily: PP, borderColor: '#e5e7eb' }}
        />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value as typeof filterCat)}
          className="px-4 py-2 rounded-xl border text-sm outline-none"
          style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
          <option value="all">All Categories</option>
          <option value="internal">Maru (In-house)</option>
          <option value="client">Client Postings</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-2 rounded-xl border text-sm outline-none"
          style={{ fontFamily: PP, borderColor: '#e5e7eb' }}>
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: PP }}>
            {apps.length === 0 ? 'No applications received yet.' : 'No applications match your filters.'}
          </p>
        </div>
      )}

      {/* Grouped by role */}
      {Object.entries(groups).map(([roleTitle, { category, apps: roleApps }]) => {
        const isClient = category === 'client';
        const accent = isClient ? '#c07a00' : 'var(--primary)';
        const bg = isClient ? 'rgba(253,161,2,0.10)' : 'var(--p-a08)';
        return (
          <div key={roleTitle} className="mb-8">
            {/* Role header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: bg, color: accent, fontFamily: PP }}>
                {isClient ? 'Client Posting' : 'Maru In-house'}
              </span>
              <h2 className="font-semibold text-sm" style={{ fontFamily: PP, color: '#111' }}>{roleTitle}</h2>
              <span className="text-xs text-gray-400" style={{ fontFamily: PP }}>
                {roleApps.length} applicant{roleApps.length !== 1 ? 's' : ''}
              </span>
              <div className="flex-1 border-t border-gray-100" />
            </div>

            <div className="space-y-3">
              {roleApps.map(app => (
                <ApplicationCard
                  key={app._id}
                  app={app}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
