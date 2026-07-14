import { BookOpen, ChevronDown, LayoutDashboard, LogOut, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { getAuthUser } from '../features/auth/authToken';

type AppHeaderProps = {
  onLogout: () => void;
};

function AppHeader({ onLogout }: AppHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const authUser = getAuthUser();
  const username = authUser?.username ?? 'Player';
  const userInitial = username.charAt(0).toUpperCase();

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="app-header">
      <Link className="app-brand" to="/app">
        <span className="app-brand-icon">
          <Zap size={20} strokeWidth={2.6} />
        </span>

        <h1>Poker Dashboard</h1>
      </Link>

      <div className="app-user-area">
        <div className="app-user-menu" ref={userMenuRef}>
          <button
            className="app-user-pill"
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            <span className="app-user-avatar">{userInitial}</span>
            <span>{username}</span>
            <ChevronDown size={15} strokeWidth={2.4} />
          </button>

          {isUserMenuOpen && (
            <div className="app-user-dropdown" role="menu">
              <Link
                className={[
                  'app-user-dropdown-item',
                  location.pathname === '/app' ? 'active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                to="/app"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <LayoutDashboard size={15} strokeWidth={2.4} />
                Dashboard
              </Link>

              <Link
                className={[
                  'app-user-dropdown-item',
                  location.pathname === '/learning' ? 'active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                to="/learning"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <BookOpen size={15} strokeWidth={2.4} />
                Learning library
              </Link>
            </div>
          )}
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={onLogout}
          aria-label="Logout"
        >
          <LogOut size={17} strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
}

export default AppHeader;