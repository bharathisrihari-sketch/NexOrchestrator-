import React from 'react';
import { EnvironmentType, WorkspaceType } from '../types/architecture';
import { Server, FolderGit2, ShieldAlert, Play, Square, RotateCcw, Code } from 'lucide-react';

interface EnvironmentBarProps {
  environment: EnvironmentType;
  onEnvironmentChange: (env: EnvironmentType) => void;
  workspace: WorkspaceType;
  onWorkspaceChange: (ws: WorkspaceType) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onOpenAsciiModal: () => void;
}

export const EnvironmentBar: React.FC<EnvironmentBarProps> = ({
  environment,
  onEnvironmentChange,
  workspace,
  onWorkspaceChange,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onOpenAsciiModal
}) => {
  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between text-xs text-slate-300">
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
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAsciiModal}
          className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex items-center gap-1 text-[11px] transition-colors"
          title="View detailed ASCII wireframe"
        >
          <Code className="w-3 h-3 text-cyan-400" />
          <span>ASCII Wireframe</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
          title="Reset Pipeline Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

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
              <span>Halt Execution</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Pipeline</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
