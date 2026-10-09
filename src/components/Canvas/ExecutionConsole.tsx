import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Trash2
} from 'lucide-react';

interface ExecutionConsoleProps {
  isSimulating: boolean;
  recordsProcessed: number;
  runDuration: number;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  isSimulating,
  recordsProcessed,
  runDuration
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'telemetry' | 'quality'>('logs');

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const logs = [
    { time: '07:14:02.102', level: 'INFO', component: 'INGEST', msg: 'Ingesting partition from Object Storage bucket ... OK [14,200 rec/s]' },
    { time: '07:14:03.488', level: 'SECURITY', component: 'ENCLAVE', msg: 'Format-Preserving Tokenization engine initialized in hardware enclave ... zero memory dump leakage' },
    { time: '07:14:04.215', level: 'QUALITY', component: 'ASSERTION', msg: 'Assertion [Primary Key Completeness] evaluated on 22,600 batch records -> 100% compliant (0 nulls)' },
    { time: '07:14:05.110', level: 'TRANSFORM', component: 'JOIN', msg: 'Broadcast hash join with Reference Dataset metadata store completed in 42ms' },
    { time: '07:14:06.012', level: 'SINK', component: 'COMMIT', msg: 'Curated Analytics Repository staged transaction committed. Parquet snapshot created.' },
  ];

  return (
    <div className={`border-t border-slate-800 bg-slate-950 transition-all duration-300 flex flex-col shrink-0 select-none ${
      isExpanded ? 'h-64' : 'h-11'
    }`}>
      {/* Console Bar / Header */}
      <div className="h-11 px-4 flex items-center justify-between border-b border-slate-850 bg-slate-900/80 text-xs">
        {/* Left Status Indicators */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Execution Console</span>
          </button>

          <div className="h-3.5 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-slate-400">
              Run ID: <span className="text-slate-200">run-982741</span>
            </span>
            <span className="text-slate-400 hidden md:inline">
              Duration: <span className="text-slate-200">{formatDuration(runDuration)}</span>
            </span>
            <span className="text-slate-400">
              Processed: <span className="text-cyan-400 font-semibold">{recordsProcessed.toLocaleString()} rec</span>
            </span>
            <span className="text-slate-400 hidden lg:inline">
              Throughput: <span className="text-emerald-400">{isSimulating ? '22,600 rec/s' : '0 rec/s'}</span>
            </span>
            <span className="text-slate-400 hidden xl:inline">
              Quality: <span className="text-emerald-400">4/4 Assertions Passed</span>
            </span>
          </div>
        </div>

        {/* Right Tab Switchers & Actions */}
        <div className="flex items-center gap-2">
          {isExpanded && (
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'logs' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Logs
              </button>
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'telemetry' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeTab === 'quality' ? 'bg-slate-800 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Data Quality
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Console Body */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] bg-slate-950/90 text-slate-300">
          {activeTab === 'logs' && (
            <div className="space-y-1.5">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 py-0.5 border-b border-slate-900/50">
                  <span className="text-slate-400 shrink-0">{log.time}</span>
                  <span className={`px-1 rounded text-[10px] font-bold shrink-0 ${
                    log.level === 'SECURITY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                    log.level === 'QUALITY' ? 'bg-blue-950 text-blue-400 border border-blue-800/60' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-cyan-400 shrink-0">[{log.component}]</span>
                  <span className="text-slate-300 break-all">{log.msg}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Total Allocated vCPU</span>
                <span className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>26.0 vCPU</span>
                </span>
                <span className="text-[10px] text-emerald-400">42% current worker utilization</span>
              </div>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Total Allocated RAM</span>
                <span className="text-lg font-bold text-white">84.0 GiB</span>
                <span className="text-[10px] text-cyan-400">Zero disk spillage detected</span>
              </div>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Network Mesh Egress</span>
                <span className="text-lg font-bold text-white">18.4 MB/s</span>
                <span className="text-[10px] text-slate-400">Air-gapped private subnet</span>
              </div>
              <div className="p-3 rounded bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Dead-Letter Queue Count</span>
                <span className="text-lg font-bold text-emerald-400">0 records</span>
                <span className="text-[10px] text-slate-400">100% nominal dispatch</span>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-semibold block">Primary Key Completeness</span>
                    <span className="text-[10px] text-slate-400">Assertion: record_id IS NOT NULL AND LENGTH(record_id) &gt; 0</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">100% Pass (0 nulls)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-semibold block">Schema Drift Gate</span>
                    <span className="text-[10px] text-slate-400">Assertion: Unmapped fields &lt;= 0 across structured payloads</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">Compliant (0 drift)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-semibold block">Reference Dimension Hit Rate</span>
                    <span className="text-[10px] text-slate-400">Assertion: Enrichment reference match rate &gt;= 98.5%</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">99.82% Hit Rate</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
