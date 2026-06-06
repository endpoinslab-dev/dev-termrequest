import React, { useState, useEffect } from 'react';

interface LiveIncidentMonitorProps {
  // In a full app, we would pass incident data or subscribe to a stream
}

const LiveIncidentMonitor: React.FC<LiveIncidentMonitorProps> = () => {
  const [incidents, setIncidents] = useState<Array<{
    id: string;
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    timestamp: string;
  }>>([]);

  useEffect(() => {
    const sampleIncident = {
      id: 'inc_001',
      title: 'High CPU Usage on Web-01',
      description: 'CPU usage has exceeded 90% for the last 5 minutes',
      severity: 'HIGH' as const,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setIncidents(prev => [sampleIncident, ...prev.slice(0, 4)]);

    const interval = setInterval(() => {
      if (incidents.length > 0) {
        const updated = [...incidents];
        const first = updated[0];
        const severityCycle: Array<'CRITICAL' | 'HIGH' | 'MEDIUM'> = ['CRITICAL', 'HIGH', 'MEDIUM'];
        const currentIdx = severityCycle.indexOf(first.severity);
        const newSeverity = severityCycle[(currentIdx + 1) % severityCycle.length];
        updated[0] = { ...first, severity: newSeverity };
        setIncidents(updated);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [incidents]);

  return (
    <div className="border-l-4 border-cyber-danger pl-4">
      <h3 className="font-semibold text-cyber-text mb-2">Live Incidents</h3>
      {incidents.length === 0 ? (
        <p className="text-cyber-muted">No active incidents</p>
      ) : (
        <ul className="space-y-2">
          {incidents.map(incident => (
            <li key={incident.id} className="flex items-start space-x-3 p-3 bg-cyber-border/20 rounded">
              <div className={`flex-shrink-0 h-3 w-3 
                ${incident.severity === 'CRITICAL' ? 'bg-cyber-danger' : ''}
                ${incident.severity === 'HIGH' ? 'bg-cyber-warning' : ''}
                ${incident.severity === 'MEDIUM' ? 'bg-cyber-accent' : ''}
              `}></div>
              <div className="flex-1">
                <h4 className="font-semibold text-cyber-text">{incident.title}</h4>
                <p className="text-cyber-muted text-sm">{incident.description}</p>
                <span className="text-xs text-cyber-muted">{incident.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveIncidentMonitor;