import React, { useState, useEffect } from 'react';
import { curriculum, Mission } from '../data/curriculum';
import Terminal from './Terminal';
import Wizard from './Wizard';
import { useAuth } from './Auth';

type ViewMode = 'missions' | 'sql-missions' | 'wizard-linux' | 'wizard-powershell' | 'wizard-kql' | 'wizard-vim' | 'wizard-sql';

const LogoutBtn: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <button onClick={logout} className="text-xs text-cyber-accent border border-cyber-accent/30 bg-cyber-accent/10 px-3 py-1 rounded font-medium hover:bg-cyber-accent/20 transition-colors" title="Logout">
      {user?.name} (Logout)
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('missions');

  const storageKey = `progress_${user?.email}`;

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedMissions(data.completed || []);
      setXp(data.xp || 0);
    }
    setLoaded(true);
  }, [user?.email]);

  useEffect(() => {
    if (!user || !loaded) return;
    localStorage.setItem(storageKey, JSON.stringify({ completed: completedMissions, xp }));
  }, [completedMissions, xp, loaded]);

  const levelInfo = curriculum[currentLevel];

  const isMissionAvailable = (mission: Mission) => {
    const idx = levelInfo.missions.findIndex(m => m.id === mission.id);
    if (idx === 0) return true;
    return completedMissions.includes(levelInfo.missions[idx - 1].id);
  };

  const levelProgress = () => {
    const total = levelInfo.missions.length;
    const done = levelInfo.missions.filter(m => completedMissions.includes(m.id)).length;
    return total > 0 ? (done / total) * 100 : 0;
  };

  return (
    <div className="flex h-screen bg-cyber-bg">
      <aside className="w-64 bg-cyber-card border-r border-cyber-border flex flex-col">
        <div className="p-4 border-b border-cyber-border">
          <h1 className="text-2xl font-bold text-cyber-primary">TermQuest</h1>
          <p className="text-xs text-cyber-muted">Interactive Shell RPG</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
            <h2 className="text-xs font-bold text-cyber-muted uppercase tracking-widest px-2 mb-2">Wizards</h2>
            <button
              onClick={() => { setViewMode('wizard-linux'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'wizard-linux'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">Linux Wizard</div>
              <div className="text-xs text-cyber-muted">Bash command reference</div>
            </button>
            <button
              onClick={() => { setViewMode('wizard-powershell'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'wizard-powershell'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">PowerShell Wizard</div>
              <div className="text-xs text-cyber-muted">Cmdlet & pipeline reference</div>
            </button>
            <button
              onClick={() => { setViewMode('wizard-kql'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'wizard-kql'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">KQL Query Wizard</div>
              <div className="text-xs text-cyber-muted">Kusto query language reference</div>
            </button>
            <button
              onClick={() => { setViewMode('wizard-vim'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'wizard-vim'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">VIM Wizard</div>
              <div className="text-xs text-cyber-muted">Modal editor command reference</div>
            </button>
            <button
              onClick={() => { setViewMode('wizard-sql'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'wizard-sql'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">SQL Query Wizard</div>
              <div className="text-xs text-cyber-muted">Relational database query reference</div>
            </button>
            <button
              onClick={() => { setViewMode('missions'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'missions'
                  ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">Missions</div>
              <div className="text-xs text-cyber-muted">Level-based challenges</div>
            </button>
            <div className="border-t border-cyber-border/30 my-2" />
            <h2 className="text-xs font-bold text-cyber-muted uppercase tracking-widest px-2 mb-2">Missions</h2>
            <button
              onClick={() => { setViewMode('sql-missions'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'sql-missions'
                  ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">SQL Missions</div>
              <div className="text-xs text-cyber-muted">16 SQL challenges across all levels</div>
            </button>
            <div className="border-t border-cyber-border/30 my-2" />
            <h2 className="text-xs font-bold text-cyber-muted uppercase tracking-widest px-2 mb-2">Levels</h2>
            {curriculum.map((level, i) => (
              <button
                key={i}
                onClick={() => { setCurrentLevel(i); setSelectedMission(null); setViewMode('missions'); }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  viewMode === 'missions' && currentLevel === i
                    ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                    : 'text-cyber-text hover:bg-cyber-border/30'
                }`}
              >
                <div className="font-medium">{level.rank}</div>
                <div className="text-xs text-cyber-muted">Level {i} - {level.name}</div>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-cyber-border">
          <div className="text-xs text-cyber-muted mb-1">Total XP: {xp}</div>
          <div className="text-xs text-cyber-muted mb-1">Current: {levelInfo.rank}</div>
          <div className="h-2 bg-cyber-border/30 rounded overflow-hidden">
            <div className="h-full bg-cyber-primary rounded transition-all duration-500" style={{ width: `${levelProgress()}%` }} />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-end p-3 pr-4 bg-cyber-bg">
          <LogoutBtn />
        </div>

        {viewMode === 'wizard-linux' ? (
          <Wizard trackId="linux" onBack={() => setViewMode('missions')} />
        ) : viewMode === 'wizard-powershell' ? (
          <Wizard trackId="powershell" onBack={() => setViewMode('missions')} />
        ) : viewMode === 'wizard-kql' ? (
          <Wizard trackId="kql" onBack={() => setViewMode('missions')} />
        ) : viewMode === 'wizard-vim' ? (
          <Wizard trackId="vim" onBack={() => setViewMode('missions')} />
        ) : viewMode === 'wizard-sql' ? (
          <Wizard trackId="sql" onBack={() => setViewMode('missions')} />
        ) : viewMode === 'sql-missions' ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-cyber-primary">SQL Missions</h1>
              <p className="text-sm text-cyber-muted mt-1">Real-world SQL challenges from beginner to advanced</p>
            </div>
            <div className="space-y-3">
              {curriculum.flatMap(l => l.missions.filter(m => m.category === 'SQL')).map(m => (
                <div key={m.id} className={`p-4 rounded border transition-colors ${
                  completedMissions.includes(m.id)
                    ? 'border-cyber-primary/30 bg-cyber-primary/10'
                    : 'border-cyber-border hover:border-cyber-primary/50 bg-cyber-card/50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-cyber-text">{m.title}</h3>
                        <span className="text-xs text-cyber-muted">Level {m.levelNum}</span>
                      </div>
                      <p className="text-sm text-cyber-muted mt-1">{m.subtitle}</p>
                      <p className="text-xs text-cyber-muted mt-2 line-clamp-2">{m.story.slice(0, 120)}...</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="text-xs bg-cyber-primary/20 text-cyber-primary px-2 py-0.5 rounded font-medium">{m.xpReward} XP</span>
                      {completedMissions.includes(m.id) ? (
                        <span className="text-xs text-cyber-primary font-medium">✓ Completed</span>
                      ) : (
                        <button onClick={() => { setCurrentLevel(m.levelNum); setSelectedMission(m); setViewMode('missions'); }} className="bg-cyber-primary text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-cyber-primary/80 transition-colors">Start</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !selectedMission ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-cyber-primary">{levelInfo.name}</h1>
              <p className="text-sm text-cyber-muted mt-1">{levelInfo.description}</p>
              <p className="text-xs text-cyber-muted mt-1">Rank: <span className="text-cyber-accent">{levelInfo.rank}</span> — {levelInfo.missions.length} missions</p>
            </div>
            <div className="space-y-3">
              {levelInfo.missions.map(m => {
                const available = isMissionAvailable(m);
                const completed = completedMissions.includes(m.id);
                return (
                  <div key={m.id} className={`p-4 rounded border transition-colors ${
                    completed
                      ? 'border-cyber-primary/30 bg-cyber-primary/10'
                      : available
                        ? 'border-cyber-border hover:border-cyber-primary/50 bg-cyber-card/50'
                        : 'border-cyber-border/30 bg-cyber-bg/50 opacity-60'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-cyber-text">{m.title}</h3>
                          <span className="text-xs text-cyber-muted">{m.category}</span>
                        </div>
                        <p className="text-sm text-cyber-muted mt-1">{m.subtitle}</p>
                        <p className="text-xs text-cyber-muted mt-2 line-clamp-2">{m.story.slice(0, 120)}...</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className="text-xs bg-cyber-primary/20 text-cyber-primary px-2 py-0.5 rounded font-medium">{m.xpReward} XP</span>
                        {completed ? (
                          <span className="text-xs text-cyber-primary font-medium">✓ Completed</span>
                        ) : available ? (
                          <button onClick={() => setSelectedMission(m)} className="bg-cyber-primary text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-cyber-primary/80 transition-colors">Start</button>
                        ) : (
                          <span className="text-xs text-cyber-muted">🔒 Complete previous mission</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {currentLevel > 0 && (
              <div className="mt-6 text-xs text-cyber-muted text-center">
                Showing Level {currentLevel}. Previous levels contained {curriculum.slice(0, currentLevel).reduce((a, l) => a + l.missions.length, 0)} completed missions.
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <header className="p-4 border-b border-cyber-border flex justify-between items-center bg-cyber-card/80">
              <div>
                <h2 className="text-lg font-bold text-cyber-text">{selectedMission.title}</h2>
                <p className="text-xs text-cyber-muted">{selectedMission.subtitle} · {selectedMission.xpReward} XP</p>
              </div>
              <button onClick={() => setSelectedMission(null)} className="text-sm text-cyber-muted hover:text-cyber-text border border-cyber-border px-3 py-1 rounded">← Back</button>
            </header>
            <div className="flex-1 flex flex-col min-h-0">
              <Terminal mission={selectedMission} onMissionComplete={() => {
                setCompletedMissions(p => [...p, selectedMission.id]);
                setXp(p => p + selectedMission.xpReward);
                setSelectedMission(null);
              }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
