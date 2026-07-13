type AppHeaderProps = {
  onLogout: () => void;
};

function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <h1>Poker Dashboard</h1>
      <button className="logout-button" type="button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}

export default AppHeader;