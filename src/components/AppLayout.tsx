import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: '/orders',
    label: 'Đơn hàng',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    to: '/matches',
    label: 'Khớp lệnh',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    to: '/messages',
    label: 'Tin nhắn',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-56 lg:flex-col bg-white border-r border-gray-200 z-10">
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-gray-100 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">UEB Trading</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 px-4 py-4">
          <p className="truncate text-xs font-medium text-gray-800">
            {user?.displayName ?? 'Người dùng'}
          </p>
          <p className="truncate text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-3 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Đăng xuất →
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">UEB Trading</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            Đăng xuất
          </button>
        </div>

        {/* Mobile nav tabs */}
        <div className="overflow-x-auto border-t border-gray-100">
          <div className="flex w-max min-w-full px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 text-xs border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-700 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="lg:pl-56">
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
