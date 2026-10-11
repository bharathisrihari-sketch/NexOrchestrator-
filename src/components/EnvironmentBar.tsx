import React, { useState } from 'react';
import { EnvironmentType, WorkspaceType } from '../types/architecture';
import { Server, FolderGit2, ShieldAlert, Play, Square, RotateCcw, Code, EyeOff, Maximize2, Loader2, BarChart2, Archive } from 'lucide-react';
import { exportProjectZip } from '../utils/projectZipExporter';

interface EnvironmentBarProps {
  environment: EnvironmentType;
  onEnvironmentChange: (env: EnvironmentType) => void;
  workspace: WorkspaceType;
  onWorkspaceChange: (ws: WorkspaceType) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onOpenAsciiModal: () => void;
  onHideHeader?: () => void;
  onToggleAllHeaders?: () => void;
  areAllHeadersHidden?: boolean;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  onRunWorkflow?: () => void;
  isWorkflowRunning?: boolean;
  onOpenResults?: () => void;
  hasResults?: boolean;
}

export const EnvironmentBar: React.FC<EnvironmentBarProps> = ({
  environment,
  onEnvironmentChange,
  workspace,
  onWorkspaceChange,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onOpenAsciiModal,
  onHideHeader,
  onToggleAllHeaders,
  areAllHeadersHidden = false,
  isZenMode,
  onToggleZenMode,
  onRunWorkflow,
  isWorkflowRunning = false,
  onOpenResults,
  hasResults = false
}) => {
  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-300 shrink-0">
      {/* Left Selectors */}
      <div className="flex items-center gap-4 divide-x divide-slate-800">
        {/* Environment Selector */}
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Environment:</span>
          <select
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value as EnvironmentType)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="Development">Development (Sandbox)</option>
            <option value="Staging">Staging (Pre-Prod Staging)</option>
            <option value="Production">Production (Multi-AZ Enterprise)</option>
          </select>
        </div>

        {/* Workspace Selector */}
        <div className="flex items-center gap-2 pl-4">
          <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Workspace:</span>
          <select
            value={workspace}
            onChange={(e) => onWorkspaceChange(e.target.value as WorkspaceType)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
          >
            <option value="Enterprise Data Integration">Enterprise Data Integration Mesh</option>
            <option value="Analytical Mesh Core">Analytical Core & Warehousing</option>
            <option value="Governance & Compliance Hub">Governance & Compliance Hub</option>
          </select>
        </div>

        {/* Execution Role Placeholder */}
        <div className="hidden xl:flex items-center gap-1.5 pl-4 text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Role:</span>
          <span className="font-mono text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px]">
            Enterprise-Execution-Role-Principal
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onToggleAllHeaders && (
          <button
            onClick={onToggleAllHeaders}
            className="px-2.5 py-1 text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800 rounded flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-sm"
            title="Hide all headers (Top Header, Sidebar & Bottom Console) so canvas is 100% visible [Keyboard shortcut: H]"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Hide All Headers</span>
            <kbd className="hidden md:inline font-mono text-[9px] bg-slate-900 px-1 py-0.2 rounded border border-cyan-900/80 text-cyan-300">H</kbd>
          </button>
        )}

        {onHideHeader && (
          <button
            onClick={onHideHeader}
            className="px-2 py-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded flex items-center gap-1 text-[11px] transition-colors"
            title="Hide only this top bar"
          >
            <span className="hidden sm:inline">Hide Top Bar</span>
          </button>
        )}

        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`px-2.5 py-1 rounded flex items-center gap-1 text-[11px] transition-colors border ${
              isZenMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
            title="Zen Mode: Hide all headers, sidebar and surrounding chrome"
          >
            <Maximize2 className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Zen Canvas</span>
          </button>
        )}

        <button
          onClick={onOpenAsciiModal}
          className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center gap-1 text-[11px] transition-colors"
          title="View detailed ASCII wireframe"
        >
          <Code className="w-3 h-3 text-cyan-400" />
          <span className="hidden lg:inline">ASCII</span>
        </button>

        {/* Download All Code & Details as ZIP Button */}
        <button
          onClick={() => exportProjectZip({ appName: 'NxtGenOrchestrator' })}
          className="px-2.5 py-1 text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 rounded flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-sm"
          title="Download all code, components and details into one stand-alone ZIP file to generate the same app under another user login"
        >
          <Archive className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
          title="Reset Pipeline Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Results Button */}
        {onOpenResults && (
          <button
            onClick={onOpenResults}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded flex items-center gap-1.5 transition-colors border ${
              hasResults
                ? 'bg-indigo-950 text-indigo-300 hover:text-white border-indigo-700/80 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Open workflow execution results report"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Results</span>
            {hasResults && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
        )}

        {/* Run Workflow Button */}
        {onRunWorkflow ? (
          <button
            onClick={onRunWorkflow}
            disabled={isWorkflowRunning}
            className={`px-3 py-1 rounded font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isWorkflowRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
            }`}
            title="Run active workflow pipeline"
          >
            {isWorkflowRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Workflow</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
              isSimulating
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>Halt</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
