import React, { useState, useEffect, useCallback } from 'react';
import { curriculum as staticCurriculum, Mission, Level } from '../data/curriculum';
import Terminal from './Terminal';
import Wizard from './Wizard';
import { useAuth } from './Auth';
import { supabase } from '../lib/supabase';
import { fetchLevels } from '../lib/data';
import { seedDatabase, checkDataExists } from '../lib/seed';

type ViewMode = 'missions' | 'sql-missions' | 'wizard-linux' | 'wizard-powershell' | 'wizard-kql' | 'wizard-vim' | 'wizard-sql';

const LogoutBtn: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <button onClick={logout} className="text-xs text-cyber-accent border border-cyber-accent/30 bg-cyber-accent/10 px-3 py-1 rounded font-medium hover:bg-cyber-accent/20 transition-colors" title="Logout">
      {user?.email} (Logout)
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>(staticCurriculum);
  const [dataLoading, setDataLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [showSeedPrompt, setShowSeedPrompt] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('missions');

  const levelInfo = levels[currentLevel];

  useEffect(() => {
    if (!user) return;
    setLoaded(false);
    supabase
      .from('user_progress')
      .select('completed_missions, xp')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          setCompletedMissions(data.completed_missions || []);
          setXp(data.xp || 0);
        } else if (error && error.code === 'PGRST116') {
          setCompletedMissions([]);
          setXp(0);
        }
        setLoaded(true);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadData() {
      try {
        const fetchedLevels = await fetchLevels();
        if (cancelled) return;

        if (fetchedLevels.length > 0) {
          setLevels(fetchedLevels);
          setShowSeedPrompt(false);
        } else {
          setLevels(staticCurriculum);
          const exists = await checkDataExists();
          if (!exists.levels || !exists.tracks) {
            setShowSeedPrompt(true);
          }
        }
      } catch {
        if (!cancelled) {
          setLevels(staticCurriculum);
          setShowSeedPrompt(false);
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage('Seeding database...');
    try {
      const msgs = await seedDatabase();
      setSeedMessage(msgs.join(', '));
      setShowSeedPrompt(false);
      const fetchedLevels = await fetchLevels();
      if (fetchedLevels.length > 0) setLevels(fetchedLevels);
    } catch (err) {
      setSeedMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSeeding(false);
    }
  };

  const saveProgress = useCallback(async (missions: string[], totalXp: number) => {
    if (!user || !loaded) return;
    setSaving(true);
    await supabase.from('user_progress').upsert({
      user_id: user.id,
      completed_missions: missions,
      xp: totalXp,
    }, { onConflict: 'user_id' });
    setSaving(false);
  }, [user?.id, loaded]);

  useEffect(() => {
    if (!user || !loaded) return;
    const timer = setTimeout(() => saveProgress(completedMissions, xp), 500);
    return () => clearTimeout(timer);
  }, [completedMissions, xp, loaded, saveProgress]);

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

  const handleMissionComplete = (mission: Mission) => {
    setCompletedMissions(p => [...p, mission.id]);
    setXp(p => p + mission.xpReward);
    setSelectedMission(null);
  };

  if (dataLoading) {
    return (
      <div className="flex h-screen bg-cyber-bg items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-cyber-primary text-4xl mb-4">⟳</div>
          <p className="text-cyber-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cyber-bg">
      <aside className="w-64 bg-cyber-card border-r border-cyber-border flex flex-col">
        <div className="p-4 border-b border-cyber-border">
          <h1 className="text-2xl font-bold text-cyber-primary">TermQuest</h1>
          <p className="text-xs text-cyber-muted">Interactive Shell RPG</p>
          {showSeedPrompt && !seeding && (
            <button
              onClick={handleSeed}
              className="mt-2 w-full text-xs bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30 px-2 py-1 rounded hover:bg-cyber-warning/30 transition-colors"
            >
              Initialize Database
            </button>
          )}
          {seeding && (
            <p className="mt-2 text-xs text-cyber-accent animate-pulse">{seedMessage}</p>
          )}
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
            <h2 className="text-xs font-bold text-cyber-muted uppercase tracking-widest px-2 mb-2">Levels</h2>
            <button
              onClick={() => { setViewMode('sql-missions'); setSelectedMission(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'sql-missions'
                  ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                  : 'text-cyber-text hover:bg-cyber-border/30'
              }`}
            >
              <div className="font-medium">SQL Missions</div>
              <div className="text-xs text-cyber-muted">SQL challenges across all levels</div>
            </button>
            {levels.map((level, i) => (
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
                <div className="text-xs text-cyber-muted">Level {level.num} - {level.name}</div>
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
          {saving && <div className="text-xs text-cyber-muted mt-1 animate-pulse">Saving...</div>}
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
              {levels.flatMap(l => l.missions.filter(m => m.category === 'SQL')).map(m => (
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
                        <button onClick={() => { setCurrentLevel(levels.findIndex(l => l.num === m.levelNum)); setSelectedMission(m); setViewMode('missions'); }} className="bg-cyber-primary text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-cyber-primary/80 transition-colors">Start</button>
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
                Showing Level {levels[currentLevel].num}. Previous levels contained {levels.slice(0, currentLevel).reduce((a, l) => a + l.missions.length, 0)} completed missions.
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
              <Terminal mission={selectedMission} onMissionComplete={() => handleMissionComplete(selectedMission)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
