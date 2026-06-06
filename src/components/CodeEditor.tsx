import React, { useState } from 'react';

interface CodeEditorProps {
  onCodeSubmit: (code: string) => void;
  initialCode?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  onCodeSubmit, 
  initialCode = "" 
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('bash'); // bash or powershell
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onCodeSubmit(code);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-cyber-text">Code Editor</h3>
        <div className="flex items-center space-x-2">
          <label className="text-cyber-muted">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-cyber-border bg-cyber-card text-cyber-text rounded px-2 py-1"
          >
            <option value="bash">Bash</option>
            <option value="powershell">PowerShell</option>
          </select>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[200px] p-3 font-mono text-cyber-text bg-cyber-card border border-cyber-border rounded resize-y focus:ring-2 focus:ring-cyber-primary focus:border-transparent"
          placeholder="Write your script here..."
        />
        {language === 'bash' && (
          <div className="absolute top-2 right-2 text-cyber-muted text-xs">
            #!/bin/bash
          </div>
        )}
        {language === 'powershell' && (
          <div className="absolute top-2 right-2 text-cyber-muted text-xs">
            #PowerShell
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded 
            ${isSubmitting ? 'bg-cyber-muted cursor-not-allowed' : 'bg-cyber-primary text-cyber-bg hover:bg-cyber-primary/80'}
            transition-colors`}
        >
          {isSubmitting ? 'Submitting...' : 'Run Script'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;