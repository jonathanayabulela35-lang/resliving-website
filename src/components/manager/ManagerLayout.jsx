import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Users,
  MessageSquare,
  Newspaper,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
  { label: 'Maintenance', path: '/manager/maintenance', icon: Wrench },
  { label: 'Visitors', path: '/manager/visitors', icon: Users },
  { label: 'Messages', path: '/manager/messages', icon: MessageSquare },
  { label: 'Community', path: '/manager/community', icon: Newspaper },
  { label: 'Settings', path: '/manager/settings', icon: SettingsIcon },
];

export default function ManagerLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] min-h-[calc(100vh-5rem)]">
        <aside className="hidden lg:block bg-[#D2042D] text-white lg:min-h-[calc(100vh-5rem)] lg:sticky lg:top-20">
          <div className="flex h-full flex-col px-6 py-8">
            <div className="pb-6 border-b border-white/15">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Manager Area
              </p>
              <p className="text-lg font-semibold mt-3 text-white">
                {user?.user_metadata?.full_name || user?.email || 'Manager'}
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#4169E1] text-white shadow-sm'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/15">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-background">
          <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
