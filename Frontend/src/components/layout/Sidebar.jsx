import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/auth';

const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard / Notices', path: '/', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' },
    { name: 'Resources', path: '/resources', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>' },
    { name: 'Upload', path: '/upload', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>' },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>' },
    { name: 'Manage Resources', path: '/admin/resources', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>' },
    { name: 'Manage Metadata', path: '/admin/metadata', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>' },
    { name: 'Manage Notices', path: '/admin/notifications', icon: '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>' },
  ];

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden bg-brand-maroon text-brand-light flex items-center justify-between p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="JK Connect Logo" className="w-6 h-6 object-contain" />
          <span className="font-bold text-lg">JK Connect</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out bg-brand-light border-r border-brand-peach/30 shadow-lg
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:h-screen flex flex-col
        ${isExpanded ? 'w-64' : 'w-20'}
      `}>
        {/* Header / Brand */}
        <div className="flex items-center justify-between p-4 bg-brand-maroon text-brand-light">
          {isExpanded ? (
            <Link to="/" className="flex items-center gap-2 text-xl font-bold truncate">
              <img src="/logo.png" alt="JK Connect Logo" className="w-6 h-6 object-contain" />
              JK Connect
            </Link>
          ) : (
            <Link to="/" className="flex justify-center mx-auto">
              <img src="/logo.png" alt="JKC Logo" className="w-8 h-8 object-contain" />
            </Link>
          )}
          <button className="hidden md:block text-brand-light hover:text-brand-peach" onClick={() => setIsExpanded(!isExpanded)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && (
          <div className="p-4 border-b border-brand-peach/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-brand-dark truncate">{user?.name}</p>
                <p className="text-xs text-brand-maroon/70 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive ? 'bg-brand-maroon text-brand-light shadow-md' : 'text-brand-dark hover:bg-brand-peach/40'
                    }`}
                  >
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" dangerouslySetInnerHTML={{ __html: link.icon }} />
                    <span className={`ml-3 font-medium ${!isExpanded && 'hidden md:hidden'}`}>{link.name}</span>
                  </Link>
                );
              })}

              {isAdmin() && (
                <div className="mt-6">
                  {isExpanded && <p className="px-6 text-xs font-bold text-brand-maroon/50 uppercase tracking-wider mb-2">Admin Tools</p>}
                  {adminLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                          isActive ? 'bg-brand-orange text-white shadow-md' : 'text-brand-maroon hover:bg-brand-peach/40'
                        }`}
                      >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" dangerouslySetInnerHTML={{ __html: link.icon }} />
                        <span className={`ml-3 font-medium ${!isExpanded && 'hidden md:hidden'}`}>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center px-4 py-3 mx-2 rounded-lg text-brand-dark hover:bg-brand-peach/40 transition-colors">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                <span className={`ml-3 font-medium ${!isExpanded && 'hidden md:hidden'}`}>Login</span>
              </Link>
              <Link to="/register" className="flex items-center px-4 py-3 mx-2 rounded-lg bg-brand-orange text-white shadow-md hover:bg-brand-orange/90 transition-colors">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                <span className={`ml-3 font-medium ${!isExpanded && 'hidden md:hidden'}`}>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Footer actions */}
        {isAuthenticated && (
          <div className="p-4 border-t border-brand-peach/30">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2 ${isExpanded ? 'bg-brand-dark/10' : ''} text-brand-maroon rounded-lg hover:bg-brand-maroon hover:text-white transition-colors`}
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span className={`ml-3 font-medium ${!isExpanded && 'hidden md:hidden'}`}>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
