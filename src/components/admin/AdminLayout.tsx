import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, LogOut, ExternalLink, ChevronLeft, ChevronRight, BookOpen, Info, Users, Phone, Inbox, MessageSquare, GraduationCap, Scale } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const PP = 'Poppins, sans-serif';

const navItems = [
  { to: '/admin/home',      label: 'Home',      icon: LayoutDashboard },
  { to: '/admin/about',     label: 'About',     icon: Info },
  { to: '/admin/services',  label: 'Services',  icon: Briefcase },
  { to: '/admin/industries', label: 'Industries', icon: Users },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen },
  { to: '/admin/careers',      label: 'Careers',      icon: FileText },
  { to: '/admin/contact',      label: 'Contact',      icon: Phone },
  { to: '/admin/knowledge-centre', label: 'Knowledge Centre', icon: GraduationCap },
  { to: '/admin/labour-codes',     label: 'Labour Codes',     icon: Scale },
  { to: '/admin/applications', label: 'Applications', icon: Inbox },
  { to: '/admin/enquiries',    label: 'Enquiries',    icon: MessageSquare },
];

export default function AdminLayout() {
  const { username, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: PP, backgroundColor: '#f8fafb' }}>

      {/* Sidebar */}
      <aside
        className="shrink-0 flex flex-col border-r border-gray-100 bg-white transition-all duration-200 relative"
        style={{ width: collapsed ? '64px' : '256px' }}
      >
        {/* Header */}
        <div
          className="flex items-center border-b border-gray-100 shrink-0"
          style={{ height: '64px', padding: collapsed ? '0 14px' : '0 24px' }}
        >
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: 'var(--primary)' }}>Maru Consultancy</p>
              <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors shrink-0"
            style={{ width: '32px', height: '32px', marginLeft: collapsed ? 0 : '8px' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav — scrollable if many items */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                padding: collapsed ? '10px 14px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sticky footer — always visible */}
        <div className="shrink-0 border-t border-gray-100">
          <div className="px-2 py-3 space-y-1">
            <Link
              to="/"
              target="_blank"
              title={collapsed ? 'View Site' : undefined}
              className="flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{
                padding: collapsed ? '10px 14px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <ExternalLink size={16} className="shrink-0" />
              {!collapsed && 'View Site'}
            </Link>
            <button
              onClick={handleLogout}
              title={collapsed ? 'Logout' : undefined}
              className="w-full flex items-center gap-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{
                padding: collapsed ? '10px 14px' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <LogOut size={16} className="shrink-0" />
              {!collapsed && 'Logout'}
            </button>
          </div>

          {username && !collapsed && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 truncate">
              Signed in as <span className="font-semibold text-gray-600">{username}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Content — independently scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
