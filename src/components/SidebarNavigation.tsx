import React, { useState } from 'react';
import { 
  Layers, 
  GitBranch, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Network, 
  CalendarRange, 
  FileText, 
  CheckCircle2, 
  Download, 
  Presentation, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronDown, 
  ChevronRight,
  Server,
  FolderGit2
} from 'lucide-react';
import { EnvironmentType, WorkspaceType } from '../types/architecture';

export type ActiveTab = 
  | 'canvas'
  | 'lineage'
  | 'copilot'
  | 'inspector'
  | 'readiness'
  | 'reference'
  | 'roadmap'
  | 'tests'
  | 'dossier';

interface SidebarNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  environment: EnvironmentType;
  onEnvironmentChange: (env: EnvironmentType) => void;
  workspace: WorkspaceType;
  onWorkspaceChange: (ws: WorkspaceType) => void;
  onOpenExportModal: () => void;
  onOpenPresentation: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  environment,
  onEnvironmentChange,
  workspace,
  onWorkspaceChange,
  onOpenExportModal,
  onOpenPresentation
}) => {
  const [navGroupsCollapsed, setNavGroupsCollapsed] = useState<Record<string, boolean>>({
    studio: false,
    architecture: false,
    governance: false
  });

  const toggleGroup = (group: string) => {
    setNavGroupsCollapsed(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const navGroups = [
    {
      id: 'studio',
      title: 'Studio & Engineering',
      items: [
        { id: 'canvas', label: 'Workflow Canvas', icon: Layers, badge: 'DAG' },
        { id: 'lineage', label: 'Data Lineage', icon: GitBranch, badge: 'Parser' },
        { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'NL' },
        { id: 'inspector', label: 'Secure Execution', icon: ShieldCheck, badge: 'Sandbox' },
      ]
    },
    {
      id: 'architecture',
      title: 'Architecture Blueprint',
      items: [
        { id: 'readiness', label: 'Readiness Scorecard', icon: BarChart3, badge: 'CMMI' },
        { id: 'reference', label: 'Reference Architecture', icon: Network, badge: 'ASCII' },
        { id: 'roadmap', label: '90-Day Roadmap', icon: CalendarRange, badge: '12-Wk' },
      ]
    },
    {
      id: 'governance',
      title: 'Testing & Specifications',
      items: [
        { id: 'tests', label: 'Test Suites & Docs', icon: CheckCircle2, badge: 'Pass' },
        { id: 'dossier', label: 'ARB Blueprint Dossier', icon: FileText, badge: 'Spec' },
      ]
    }
  ];

  return (
    <aside className={`h-screen border-r border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col transition-all duration-300 z-40 shrink-0 select-none ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Brand & Collapse Header */}
      <div className="h-14 border-b border-slate-800 px-3.5 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-slate-950 shadow-sm shadow-cyan-500/30 shrink-0">
              N
            </span>
            <div className="min-w-0">
              <span className="text-sm font-bold tracking-tight text-white block truncate">
                NexOrchestrator Studio
              </span>
              <span className="text-[10px] font-mono text-cyan-400 block truncate">
                Enterprise Blueprint
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-slate-950 shadow-sm shadow-cyan-500/30">
              N
            </span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Environment & Workspace Mini Selectors (Expanded mode only) */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-850 space-y-2 bg-slate-900/40">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" />
                <span>Environment:</span>
              </span>
            </div>
            <select
              value={environment}
              onChange={(e) => onEnvironmentChange(e.target.value as EnvironmentType)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="Production">Production (Multi-AZ)</option>
              <option value="Staging">Staging (Pre-Prod)</option>
              <option value="Development">Development (Sandbox)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <FolderGit2 className="w-3 h-3 text-indigo-400" />
                <span>Workspace:</span>
              </span>
            </div>
            <select
              value={workspace}
              onChange={(e) => onWorkspaceChange(e.target.value as WorkspaceType)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="Enterprise Data Integration">Data Integration Mesh</option>
              <option value="Analytical Mesh Core">Analytical Core</option>
              <option value="Governance & Compliance Hub">Governance Hub</option>
            </select>
          </div>
        </div>
      )}

      {/* Nav Groups & Links */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {navGroups.map((group) => {
          const isGroupCollapsed = !!navGroupsCollapsed[group.id];

          return (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider"
                >
                  <span>{group.title}</span>
                  {isGroupCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}

              {(!isGroupCollapsed || isCollapsed) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id as ActiveTab)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/70 border border-transparent'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        {!isCollapsed && (
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className="truncate">{item.label}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/90 space-y-1.5">
        <button
          onClick={onOpenPresentation}
          className={`w-full py-1.5 px-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg flex items-center gap-2 transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Executive Presentation Mode"
        >
          <Presentation className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span>Executive Deck</span>}
        </button>

        <button
          onClick={onOpenExportModal}
          className={`w-full py-1.5 px-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-cyan-500/20 ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Export Architecture Blueprint"
        >
          <Download className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Export Blueprint</span>}
        </button>
      </div>
    </aside>
  );
};
