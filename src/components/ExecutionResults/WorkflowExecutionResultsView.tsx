import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Clock, 
  Database, 
  ShieldCheck, 
  Zap, 
  Server, 
  ArrowRight, 
  GitBranch, 
  Activity, 
  Radio, 
  FileText,
  Filter,
  RefreshCw,
  Loader2,
  Trash2
} from 'lucide-react';
import { 
  WorkflowExecutionResult, 
  WorkflowCatalogItem, 
  WorkflowExecutionStepResult, 
  ConnectorExecutionResult 
} from '../../types/architecture';

interface WorkflowExecutionResultsViewProps {
  currentResult: WorkflowExecutionResult | null;
  workflows: WorkflowCatalogItem[];
  currentWorkflowId: string;
  onSelectWorkflow: (id: string) => void;
  onRunWorkflow: () => void;
  isWorkflowRunning: boolean;
  onNavigateToCanvas?: () => void;
  onDeleteWorkflow?: (id: string) => void;
}

export const WorkflowExecutionResultsView: React.FC<WorkflowExecutionResultsViewProps> = ({
  currentResult,
  workflows,
  currentWorkflowId,
  onSelectWorkflow,
  onRunWorkflow,
  isWorkflowRunning,
  onNavigateToCanvas,
  onDeleteWorkflow
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'nodes' | 'connectors' | 'payload'>('logs');
  const [logFilterLevel, setLogFilterLevel] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [copiedLog, setCopiedLog] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId) || workflows[0];

  // Auto-scroll logs to bottom if enabled
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentResult?.auditLogs, autoScroll]);

  // Filtered audit logs
  const filteredLogs = useMemo(() => {
    if (!currentResult?.auditLogs) return [];
    return currentResult.auditLogs.filter(log => {
      const matchesLevel = logFilterLevel === 'ALL' || log.level === logFilterLevel;
      const matchesSearch = !logSearchQuery || 
        log.message.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.component.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
        log.timestamp.includes(logSearchQuery);
      return matchesLevel && matchesSearch;
    });
  }, [currentResult?.auditLogs, logFilterLevel, logSearchQuery]);

  const handleCopyLogs = () => {
    if (!currentResult?.auditLogs) return;
    const text = currentResult.auditLogs
      .map(l => `[${l.timestamp}] [${l.level}] [${l.component}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handleDownloadLogs = () => {
    if (!currentResult?.auditLogs) return;
    const text = currentResult.auditLogs
      .map(l => `[${l.timestamp}] [${l.level}] [${l.component}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResult.runId || 'execution'}-audit.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyJson = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!currentResult) return;
    const blob = new Blob([JSON.stringify(currentResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResult.runId || 'execution'}-results.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header & Workflow Selector Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Workflow Execution Results &amp; Audit Logs
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-semibold">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Inspect millisecond-precision timestamps, step-by-step DAG node metrics, connector throughput, and egress payloads.
            </p>
          </div>
        </div>

        {/* Workflow Switcher & Run Controls */}
        <div className="flex items-center gap-2">
          {/* Workflow Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase hidden md:inline">Workflow:</span>
            <select
              value={currentWorkflowId}
              onChange={(e) => onSelectWorkflow(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {workflows.map(wf => (
                <option key={wf.id} value={wf.id} className="bg-slate-900 text-white">
                  {wf.name} ({wf.nodes.length} nodes)
                </option>
              ))}
            </select>
          </div>

          {/* Run Workflow Button */}
          <button
            onClick={onRunWorkflow}
            disabled={isWorkflowRunning}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              isWorkflowRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
            }`}
            title="Execute workflow and generate fresh execution results & logs"
          >
            {isWorkflowRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Executing DAG...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Workflow</span>
              </>
            )}
          </button>

          {onNavigateToCanvas && (
            <button
              onClick={onNavigateToCanvas}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Execution Summary Metrics Strip */}
      {currentResult ? (
        <div className="bg-slate-900/50 border-b border-slate-800 px-4 sm:px-6 py-3 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            {/* Status */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Execution Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400 tracking-wide text-xs">
                  {currentResult.status}
                </span>
              </div>
            </div>

            {/* Run ID */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Run ID</span>
              <span className="font-mono font-semibold text-slate-200 truncate block mt-0.5" title={currentResult.runId}>
                {currentResult.runId}
              </span>
            </div>

            {/* Execution Duration */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Duration</span>
              <span className="font-mono font-semibold text-cyan-300 block mt-0.5">
                {currentResult.durationSeconds}s
              </span>
            </div>

            {/* Records Processed */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Records Ingested</span>
              <span className="font-mono font-semibold text-white block mt-0.5">
                {currentResult.recordsProcessed.toLocaleString()} recs
              </span>
            </div>

            {/* Throughput */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Peak Throughput</span>
              <span className="font-mono font-semibold text-indigo-300 block mt-0.5">
                {currentResult.throughput}
              </span>
            </div>

            {/* Error Rate */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Error Rate</span>
              <span className="font-mono font-semibold text-emerald-400 block mt-0.5">
                {currentResult.errorRate} (0 faults)
              </span>
            </div>

            {/* Cost Estimate */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Cloud Cost</span>
              <span className="font-mono font-semibold text-slate-300 block mt-0.5">
                {currentResult.costEstimate}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/30 border-b border-slate-800 p-4 text-center text-xs text-slate-400">
          No execution runs recorded yet for this workflow. Click &ldquo;Run Workflow&rdquo; above to execute the pipeline DAG.
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Timestamped Audit Logs</span>
            {currentResult?.auditLogs && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {currentResult.auditLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'nodes'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DAG Node Breakdown</span>
            {currentResult?.stepResults && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {currentResult.stepResults.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'connectors'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Connector Telemetry</span>
            {currentResult?.connectorResults && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                {currentResult.connectorResults.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'payload'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Output Data Sample</span>
          </button>
        </div>

        {/* Global Export actions */}
        <div className="flex items-center gap-1.5 py-1.5">
          <button
            onClick={handleCopyJson}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
            title="Copy entire result object as JSON"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center gap-1 transition-colors"
            title="Download result file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        {/* SUB-TAB 1: TIMESTAMPED AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Log Controls & Filter Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Level Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Level:</span>
                {['ALL', 'INFO', 'METRIC', 'SECURITY', 'AUDIT', 'WARN', 'SUCCESS'].map(level => (
                  <button
                    key={level}
                    onClick={() => setLogFilterLevel(level)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                      logFilterLevel === level
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                  <input
                    type="text"
                    placeholder="Search logs by keyword..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="w-44 sm:w-56 bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
                    autoScroll
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                  title="Toggle automatic scrolling to latest log line"
                >
                  Auto-scroll
                </button>

                <button
                  onClick={handleCopyLogs}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLog ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadLogs}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.log</span>
                </button>
              </div>
            </div>

            {/* Terminal Window with Millisecond Timestamps */}
            <div 
              ref={logContainerRef}
              className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1.5 selection:bg-cyan-500/30 selection:text-white"
            >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => {
                  const levelColor = 
                    log.level === 'SUCCESS' ? 'text-emerald-400' :
                    log.level === 'INFO' ? 'text-cyan-400' :
                    log.level === 'METRIC' ? 'text-blue-400' :
                    log.level === 'SECURITY' ? 'text-purple-400' :
                    log.level === 'AUDIT' ? 'text-amber-400' :
                    log.level === 'WARN' ? 'text-orange-400' :
                    log.level === 'ERROR' ? 'text-rose-400' : 'text-slate-300';

                  return (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2.5 py-0.5 hover:bg-slate-900/60 px-2 rounded transition-colors group"
                    >
                      {/* Precise Timestamp */}
                      <span className="text-slate-500 text-[11px] select-all shrink-0">
                        [{log.timestamp}]
                      </span>

                      {/* Log Level */}
                      <span className={`font-bold text-[11px] shrink-0 w-16 ${levelColor}`}>
                        [{log.level}]
                      </span>

                      {/* Component */}
                      <span className="text-slate-400 text-[11px] shrink-0 font-semibold">
                        [{log.component}]
                      </span>

                      {/* Message Content */}
                      <span className="text-slate-200 flex-1 leading-relaxed">
                        {log.message}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>No audit logs matching query &ldquo;{logSearchQuery}&rdquo; and level &ldquo;{logFilterLevel}&rdquo;.</p>
                </div>
              )}
            </div>

            {/* Bottom Status Line */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Audit Stream Active</span>
                </span>
                <span>&bull;</span>
                <span>{filteredLogs.length} of {currentResult?.auditLogs?.length || 0} events displayed</span>
              </div>
              <span className="text-slate-500">Format: [YYYY-MM-DD HH:mm:ss.SSS] [LEVEL] [COMPONENT] MESSAGE</span>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: DAG NODE BREAKDOWN */}
        {activeTab === 'nodes' && (
          <div className="flex-1 overflow-y-auto space-y-3 h-full">
            {currentResult?.stepResults && currentResult.stepResults.length > 0 ? (
              currentResult.stepResults.map((step, idx) => (
                <div 
                  key={step.nodeId || idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/80 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{step.nodeName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                          {step.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{step.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {step.statusMessage}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Pills */}
                  <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                      <span className="font-bold text-cyan-300">{step.durationMs} ms</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Records Out</span>
                      <span className="font-bold text-white">{step.recordsOut.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Throughput</span>
                      <span className="font-bold text-indigo-300">{step.throughput}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                No step results generated yet.
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 3: CONNECTOR TELEMETRY */}
        {activeTab === 'connectors' && (
          <div className="flex-1 overflow-y-auto space-y-3 h-full">
            {currentResult?.connectorResults && currentResult.connectorResults.length > 0 ? (
              currentResult.connectorResults.map((conn, idx) => (
                <div 
                  key={conn.edgeId || idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 shrink-0">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{conn.connectorName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {conn.connectorType.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {conn.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-cyan-300">{conn.sourceNodeName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-cyan-300">{conn.targetNodeName}</span>
                        <span>&bull;</span>
                        <span className="text-slate-300">{conn.protocol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Numbers */}
                  <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Latency</span>
                      <span className="font-bold text-emerald-400">{conn.latencyMs} ms</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Data Volume</span>
                      <span className="font-bold text-white">{conn.bytesTransferred}</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Cipher</span>
                      <span className="font-mono text-[10px] text-slate-300 truncate max-w-[120px] block" title={conn.securityCipher}>
                        {conn.securityCipher}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                No connector results registered for this workflow.
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 4: OUTPUT DATA SAMPLE */}
        {activeTab === 'payload' && (
          <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Committed Target Payload Preview</span>
                <span className="text-[10px] font-mono text-slate-400">(Format: JSON Record Set)</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentResult?.outputPayloadSample || [], null, 2));
                  setCopiedJson(true);
                  setTimeout(() => setCopiedJson(false), 2000);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-slate-950 text-cyan-300 selection:bg-cyan-500/30">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(currentResult?.outputPayloadSample || [], null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
