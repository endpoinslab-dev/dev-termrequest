import React, { useState, useRef, useEffect } from 'react';
import { wizardTracks as staticTracks, CommandEntry, WizardModule, WizardTrack } from '../data/wizard';
import { ShellInterpreter, ShellState } from '../utils/interpreter';

function initialPlaygroundState(): ShellState {
  return {
    cwd: '/home/user',
    env: {
      USER: 'user',
      HOME: '/home/user',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    },
    vfs: {
      '/home/user': '',
      '/home/user/documents': '',
      '/home/user/projects': '',
      '/etc': '',
      '/var': '',
      '/var/log': '',
      '/tmp': '',
      '/home/user/readme.txt': 'Welcome to TermQuest Wizard!\nPractice your commands here.\n',
      '/home/user/projects/app.log': 'INFO: Starting application\nINFO: Database connected\nERROR: Connection timeout\nINFO: Retry attempt 1\nERROR: Failed to connect\nINFO: Shutting down\n',
      '/home/user/projects/config.yml': 'server:\n  host: localhost\n  port: 8080\ndatabase:\n  url: postgres://localhost:5432/app\n  pool: 10\n',
      '/etc/hosts': '127.0.0.1 localhost\n::1 localhost\n192.168.1.10 web01\n192.168.1.20 db01\n',
      '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nalice:x:1001:1001:Alice:/home/alice:/bin/bash\nbob:x:1002:1002:Bob:/home/bob:/bin/bash\n',
    },
    history: [],
  };
}

interface WizardProps {
  trackId: 'linux' | 'powershell' | 'kql' | 'vim' | 'sql';
  onBack: () => void;
}

const Wizard: React.FC<WizardProps> = ({ trackId, onBack }) => {
  const [track, setTrack] = useState<WizardTrack | null>(() => {
    return staticTracks.find(t => t.id === trackId) ?? null;
  });
  const [loading, setLoading] = useState(track === null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrack() {
      try {
        const { fetchWizardTracks } = await import('../lib/data');
        const fetched = await fetchWizardTracks();
        if (cancelled) return;
        const found = fetched.find(t => t.id === trackId);
        if (found) setTrack(found);
      } catch {
        if (!cancelled) {
          const fallback = staticTracks.find(t => t.id === trackId) ?? null;
          setTrack(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTrack();
    return () => { cancelled = true; };
  }, [trackId]);

  const [selectedModule, setSelectedModule] = useState<WizardModule | null>(null);
  const [selectedCommandIdx, setSelectedCommandIdx] = useState(0);

  useEffect(() => {
    if (track && track.modules.length > 0) {
      setSelectedModule(track.modules[0]);
      setSelectedCommandIdx(0);
    }
  }, [track]);

  const handleModuleChange = (mod: WizardModule) => {
    setSelectedModule(mod);
    setSelectedCommandIdx(0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin text-cyber-primary text-4xl">⟳</div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-cyber-danger">Track not found</p>
      </div>
    );
  }

  if (!selectedModule && track.modules.length > 0) {
    return null;
  }

  if (track.modules.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <header className="p-4 border-b border-cyber-border flex justify-between items-center bg-cyber-card/80">
          <div>
            <h2 className="text-lg font-bold text-cyber-primary">{track.title}</h2>
            <p className="text-xs text-cyber-muted">{track.description}</p>
          </div>
          <button onClick={onBack} className="text-sm text-cyber-muted hover:text-cyber-text border border-cyber-border px-3 py-1 rounded">← Back to Missions</button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-cyber-muted">No modules available for this track.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="p-4 border-b border-cyber-border flex justify-between items-center bg-cyber-card/80">
        <div>
          <h2 className="text-lg font-bold text-cyber-primary">{track.title}</h2>
          <p className="text-xs text-cyber-muted">{track.description}</p>
        </div>
        <button onClick={onBack} className="text-sm text-cyber-muted hover:text-cyber-text border border-cyber-border px-3 py-1 rounded">← Back to Missions</button>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="w-56 border-r border-cyber-border overflow-y-auto bg-cyber-card/40">
          <div className="p-3 space-y-1">
            <h3 className="text-xs font-bold text-cyber-muted uppercase tracking-widest px-2 mb-2">Modules</h3>
            {track.modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => handleModuleChange(mod)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedModule?.id === mod.id
                    ? 'bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/30'
                    : 'text-cyber-text hover:bg-cyber-border/30'
                }`}
              >
                <div className="font-medium text-sm">{mod.title}</div>
                <div className="text-xs text-cyber-muted">{mod.commands.length} commands</div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-0">
          {selectedModule && (
            <CommandView
              key={selectedModule.id + '-' + selectedCommandIdx}
              command={selectedModule.commands[selectedCommandIdx] || selectedModule.commands[0]}
              moduleCommands={selectedModule.commands}
              selectedIdx={selectedCommandIdx}
              onSelectCommand={setSelectedCommandIdx}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface CommandViewProps {
  command: CommandEntry;
  moduleCommands: CommandEntry[];
  selectedIdx: number;
  onSelectCommand: (idx: number) => void;
}

const CommandView: React.FC<CommandViewProps> = ({ command, moduleCommands, selectedIdx, onSelectCommand }) => {
  const [shellState, setShellState] = useState<ShellState>(initialPlaygroundState);
  const [tryInput, setTryInput] = useState('');
  const [tryOutput, setTryOutput] = useState<Array<{ text: string; type: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [tryOutput]);

  const handleTrySubmit = () => {
    const cmd = tryInput.trim();
    if (!cmd || isRunning) return;
    setIsRunning(true);

    try {
      const interpreter = new ShellInterpreter(shellState);
      const { output, newState } = interpreter.execute(cmd);
      setShellState({ ...newState });
      setTryOutput(prev => [
        ...prev,
        { text: `$ ${cmd}`, type: 'input' },
        ...output.map(o => ({ text: o.text, type: o.type })),
      ]);
    } catch (err) {
      setTryOutput(prev => [...prev, { text: `Error: ${err instanceof Error ? err.message : String(err)}`, type: 'stderr' }]);
    }

    setTryInput('');
    setIsRunning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTrySubmit();
    }
  };

  const handleResetPlayground = () => {
    setShellState(initialPlaygroundState());
    setTryOutput([]);
    setTryInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-1 flex-wrap border-b border-cyber-border pb-2">
          {moduleCommands.map((cmd, i) => (
            <button
              key={cmd.command}
              onClick={() => onSelectCommand(i)}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                i === selectedIdx
                  ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                  : 'text-cyber-muted hover:text-cyber-text'
              }`}
            >
              {cmd.command}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-bold text-cyber-text mb-1">{command.command}</h3>
          <p className="text-sm text-cyber-muted mb-4">{command.description}</p>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-widest mb-1">Syntax</h4>
            <div className="bg-cyber-bg/80 rounded p-3 font-mono text-sm space-x-1">
              {command.syntaxParts.map((part, i) => (
                <span key={i} className={part.color}>{part.value}</span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-widest mb-1">Example</h4>
            <pre className="bg-cyber-bg/80 rounded p-3 text-sm text-cyber-text overflow-x-auto whitespace-pre-wrap">{command.example}</pre>
            {command.exampleOutput && (
              <pre className="bg-cyber-bg/50 rounded p-3 text-sm text-cyber-muted mt-1 overflow-x-auto whitespace-pre-wrap border-t border-cyber-border/30">{command.exampleOutput}</pre>
            )}
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-widest mb-1">Step by Step</h4>
            <ol className="list-decimal list-inside space-y-1">
              {command.stepByStep.map((step, i) => (
                <li key={i} className="text-sm text-cyber-text">{step}</li>
              ))}
            </ol>
          </div>

          {command.commonFlags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-widest mb-1">Common Flags</h4>
              <div className="bg-cyber-bg/80 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyber-border">
                      <th className="text-left px-3 py-2 text-cyber-accent font-mono">Flag</th>
                      <th className="text-left px-3 py-2 text-cyber-muted">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {command.commonFlags.map((f, i) => (
                      <tr key={i} className="border-b border-cyber-border/30 last:border-0">
                        <td className="px-3 py-2 font-mono text-cyber-warning">{f.flag}</td>
                        <td className="px-3 py-2 text-cyber-text">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-cyber-border bg-cyber-card/60">
        <div className="flex items-center justify-between px-4 py-2">
          <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-widest">Try It Yourself</h4>
          <button
            onClick={handleResetPlayground}
            className="text-xs text-cyber-muted hover:text-cyber-warning transition-colors"
          >
            Reset Playground
          </button>
        </div>
        <div
          ref={outputRef}
          className="overflow-y-auto max-h-48 px-4 py-2 space-y-1 font-mono text-sm"
        >
          <div className="text-cyber-accent text-xs"># {command.tryIt}</div>
          {tryOutput.map((line, i) => (
            <div key={i} className={`whitespace-pre-wrap ${line.type === 'input' ? 'text-cyber-green-glow font-bold' : line.type === 'stderr' ? 'text-cyber-danger' : 'text-cyber-text'}`}>
              {line.text}
            </div>
          ))}
        </div>
        <div className="flex items-center px-4 py-2 border-t border-cyber-border/50">
          <span className="text-cyber-accent text-sm">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={tryInput}
            onChange={e => setTryInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            className="flex-1 ml-2 bg-transparent border-none text-cyber-text focus:outline-none focus:ring-0 placeholder-cyber-muted text-sm"
            placeholder="Try the command here..."
          />
          {isRunning && (
            <span className="ml-2 animate-pulse text-cyber-warning text-xs">Processing...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
