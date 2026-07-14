import { ChevronDown, LogOut, Zap } from 'lucide-react';

type AppHeaderProps = {
  onLogout: () => void;
};

function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <span className="app-brand-icon">
          <Zap size={20} strokeWidth={2.6} />
        </span>

        <h1>Poker Dashboard</h1>
      </div>

      <div className="app-user-area">
        <button className="app-user-pill" type="button">
          <span className="app-user-avatar">P</span>
          <span>Player</span>
          <ChevronDown size={15} strokeWidth={2.4} />
        </button>

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