import React, { useState, useRef, useEffect } from 'react';
import { ShellInterpreter, initialShellState } from '../utils/interpreter';
import MissionValidator from '../utils/validator';
import { Mission } from '../data/curriculum';

interface TerminalProps {
  mission: Mission;
  onMissionComplete: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ mission, onMissionComplete }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<Array<{text: string; type: 'input' | 'stdout' | 'stderr' | 'success' | 'warning' | 'system'; timestamp: string}>>([]);
  const [shellState, setShellState] = useState(() => {
    const base = initialShellState();
    if (mission.initialVfsState) {
      base.vfs = { ...base.vfs, ...mission.initialVfsState };
    }
    return base;
  });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const interpreter = new ShellInterpreter(shellState);

  // Show welcome message on mount
  useEffect(() => {
    const t = new Date().toLocaleTimeString();
    setOutput([
      { text: `╔══════════════════════════════════════════════════╗`, type: 'system', timestamp: t },
      { text: `║  TERMQUEST — Mission: ${mission.title.padEnd(37)}║`, type: 'system', timestamp: t },
      { text: `╠══════════════════════════════════════════════════╣`, type: 'system', timestamp: t },
      { text: `║ ${mission.objective.padEnd(56)}║`, type: 'system', timestamp: t },
      { text: `╠══════════════════════════════════════════════════╣`, type: 'system', timestamp: t },
      { text: `║  Type 'help' for available commands             ║`, type: 'system', timestamp: t },
      { text: `╚══════════════════════════════════════════════════╝`, type: 'system', timestamp: t },
      { text: ``, type: 'stdout', timestamp: t },
      { text: `🔍 ${mission.story}`, type: 'warning', timestamp: t },
      { text: ``, type: 'stdout', timestamp: t },
      { text: `🎯 Objective: ${mission.objective}`, type: 'success', timestamp: t },
      { text: ``, type: 'stdout', timestamp: t },
    ]);
  }, []);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Handle key down for history navigation and submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(history[history.length - 1 - newIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(history[history.length - 1 - newIdx] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Submit command
  const submitCommand = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const command = input;

    try {
      setInput('');

      const timestamp = new Date().toLocaleTimeString();
      setOutput(prev => [
        ...prev,
        { text: `user@apex:${shellState.cwd}$ ${command}`, type: 'input', timestamp }
      ]);

      const { output: newOutput, newState } = interpreter.execute(command);

      const updatedHistory = [...shellState.history, command];
      shellState.history = updatedHistory;

      setShellState({ ...newState });

      const outputLines = newOutput.map(line => ({
        ...line,
        timestamp: new Date().toLocaleTimeString()
      }));
      setOutput(prev => [...prev, ...outputLines]);

      setHistory(prev => [...prev, command]);
      setHistoryIndex(-1);

      const validationResult = MissionValidator.validateMission(mission, newState, updatedHistory);
      if (validationResult.isValid) {
        setOutput(prev => [
          ...prev,
          { text: `✅ Mission Complete! ${validationResult.feedback}`, type: 'success', timestamp: new Date().toLocaleTimeString() }
        ]);
        setTimeout(() => {
          onMissionComplete();
        }, 1500);
      } else if (newOutput.some(line => line.type === 'stderr')) {
        setOutput(prev => [
          ...prev,
          { text: `❌ ${validationResult.feedback}`, type: 'warning', timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      setOutput(prev => [
        ...prev,
        { text: `⚠️ Error: ${err instanceof Error ? err.message : String(err)}`, type: 'stderr', timestamp: new Date().toLocaleTimeString() }
      ]);
    }

    setIsSubmitting(false);
  };

  // Render
  return (
    <div className="flex flex-col flex-1 w-full scanlines min-h-0">
      <div className="flex-1 overflow-auto p-4 space-y-2 min-h-0" ref={terminalRef}>
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-all">
            <span 
              className={`
                ${line.type === 'stdout' ? 'text-cyber-text' : ''}
                ${line.type === 'stderr' ? 'text-cyber-danger' : ''}
                ${line.type === 'success' ? 'text-cyber-primary' : ''}
                ${line.type === 'warning' ? 'text-cyber-warning' : ''}
                ${line.type === 'system' ? 'text-cyber-accent' : ''}
                ${line.type === 'input' ? 'font-bold text-cyber-green-glow' : ''}
              `}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center px-4 py-2 bg-cyber-card border-t border-cyber-border">
        <span className="text-cyber-accent">user@apex:</span>
        <span className="text-cyber-text">{shellState.cwd}</span>
        <span className="text-cyber-accent">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className="flex-1 ml-2 bg-transparent border-none text-cyber-text focus:outline-focus focus:ring-0 placeholder-cyber-muted"
          placeholder="Type a command..."
        />
        {isSubmitting && (
          <span className="ml-2 animate-pulse text-cyber-warning">Processing...</span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
