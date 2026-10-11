import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  PanelRight, 
  PanelLeft, 
  Terminal, 
  MapPin, 
  Maximize2, 
  Sliders, 
  GitBranch, 
  Play, 
  Check, 
  Layers,
  Sparkles,
  Info,
  Link2,
  FileText,
  BarChart2,
  Loader2,
  CheckCircle2,
  Trash2,
  Server,
  FolderGit2,
  ShieldAlert,
  Code,
  Archive,
  RotateCcw,
  Square,
  Workflow,
  Plus,
  ArrowRight,
  Radio,
  Minimize2,
  Bot,
  Download
} from 'lucide-react';
import { EnvironmentType, WorkspaceType, WorkflowCatalogItem } from '../../types/architecture';
import { exportProjectZip, downloadClaudeMarkdownFile } from '../../utils/projectZipExporter';

interface WorkflowDetailsHeaderProps {
  onOpenExportModal?: () => void;
  environment?: EnvironmentType;
  onEnvironmentChange?: (env: EnvironmentType) => void;
  workspace?: WorkspaceType;
  onWorkspaceChange?: (ws: WorkspaceType) => void;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
  onResetSimulation?: () => void;
  onOpenAsciiModal?: () => void;
  
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  isInspectorVisible: boolean;
  onToggleInspector: () => void;
  isToolboxVisible: boolean;
  onToggleToolbox: () => void;
  isBottomConsoleVisible: boolean;
  onToggleBottomConsole: () => void;
  isMiniMapVisible?: boolean;
  onToggleMiniMap?: () => void;
  onToggleAllHeaders?: () => void;
  areAllHeadersHidden?: boolean;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  
  nodesCount: number;
  edgesCount: number;
  selectedNodeName?: string | null;
  
  workflows?: WorkflowCatalogItem[];
  currentWorkflowId?: string;
  onSelectWorkflow?: (workflowId: string) => void;
  onRunWorkflow?: () => void;
  isWorkflowRunning?: boolean;
  
  onOpenAddConnector?: () => void;
  onOpenConnectModal?: () => void;
  onOpenMultiWorkflowModal?: () => void;
  onOpenResults?: () => void;
  hasResults?: boolean;
  
  onDeleteWorkflow?: (workflowId: string) => void;
  selectedEdgeId?: string | null;
  onDeleteConnector?: (edgeId: string) => void;
  selectedNodeId?: string | null;
  onDeleteNode?: (nodeId: string) => void;
  
  onAddStartGateway?: () => void;
  onAddTargetGateway?: () => void;
  showSequenceFlow?: boolean;
  onToggleSequenceFlow?: () => void;
}

export const WorkflowDetailsHeader: React.FC<WorkflowDetailsHeaderProps> = ({
  onOpenExportModal,
  environment = 'Production',
  onEnvironmentChange,
  workspace = 'Enterprise Data Integration',
  onWorkspaceChange,
  isSimulating = false,
  onToggleSimulation,
  onResetSimulation,
  onOpenAsciiModal,
  
  isSidebarVisible = true,
  onToggleSidebar,
  isInspectorVisible,
  onToggleInspector,
  isToolboxVisible,
  onToggleToolbox,
  isBottomConsoleVisible,
  onToggleBottomConsole,
  isMiniMapVisible = true,
  onToggleMiniMap,
  onToggleAllHeaders,
  areAllHeadersHidden = false,
  isZenMode = false,
  onToggleZenMode,
  
  nodesCount,
  edgesCount,
  selectedNodeName,
  
  workflows = [],
  currentWorkflowId,
  onSelectWorkflow,
  onRunWorkflow,
  isWorkflowRunning = false,
  
  onOpenAddConnector,
  onOpenConnectModal,
  onOpenMultiWorkflowModal,
  onOpenResults,
  hasResults = false,
  
  onDeleteWorkflow,
  selectedEdgeId,
  onDeleteConnector,
  selectedNodeId,
  onDeleteNode,
  
  onAddStartGateway,
  onAddTargetGateway,
  showSequenceFlow = false,
  onToggleSequenceFlow
}) => {
  // Dropdown open states
  const [isWfOpen, setIsWfOpen] = useState(false);
  const [isConnectMenuOpen, setIsConnectMenuOpen] = useState(false);
  const [isEnvMenuOpen, setIsEnvMenuOpen] = useState(false);
  const [isPanesMenuOpen, setIsPanesMenuOpen] = useState(false);

  const wfRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wfRef.current && !wfRef.current.contains(target)) setIsWfOpen(false);
      if (connectRef.current && !connectRef.current.contains(target)) setIsConnectMenuOpen(false);
      if (envRef.current && !envRef.current.contains(target)) setIsEnvMenuOpen(false);
      if (panesRef.current && !panesRef.current.contains(target)) setIsPanesMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId) || workflows[0];

  return (
    <div className="h-11 bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between text-xs shrink-0 select-none backdrop-blur-md z-30 gap-2 overflow-x-auto no-scrollbar">
      {/* Left Section: Brand & All Horizontal Dropdown Menus */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Brand Icon & Name */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[11px] font-black text-slate-950 shadow-sm shadow-cyan-500/30 shrink-0">
            N
          </span>
          <span className="font-bold text-white text-xs tracking-tight hidden lg:inline">
            NxtGenOrchestrator
          </span>
        </div>

        {/* DROPDOWN 1: WORKFLOW SELECTOR */}
        {workflows.length > 0 && onSelectWorkflow && (
          <div className="relative" ref={wfRef}>
            <button
              onClick={() => {
                setIsWfOpen(!isWfOpen);
                setIsConnectMenuOpen(false);
                setIsEnvMenuOpen(false);
                setIsPanesMenuOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
              title="Select workflow to load into canvas"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[190px] md:max-w-[240px] text-left">
                {currentWorkflow?.name || 'Select Workflow'}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden xl:inline">
                {nodesCount} Nodes
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Workflow List Popup */}
            {isWfOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Workflows Catalog
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {workflows.length} Pre-configured DAGs
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 p-1">
                  {workflows.map((wf) => {
                    const isSelected = wf.id === currentWorkflowId;
                    return (
                      <div
                        key={wf.id}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all group ${
                          isSelected
                            ? 'bg-cyan-950/70 border border-cyan-500/80 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectWorkflow(wf.id);
                            setIsWfOpen(false);
                          }}
                          className="flex-1 min-w-0 pr-2 text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate block">
                              {wf.name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span className="bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                              {wf.category}
                            </span>
                            <span>{wf.nodes.length} nodes</span>
                            <span>·</span>
                            <span>{wf.edges.length} edges</span>
                          </div>
                        </button>

                        {/* Delete this workflow */}
                        {onDeleteWorkflow && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete workflow "${wf.name}"?`)) {
                                onDeleteWorkflow(wf.id);
                              }
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/60 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            title={`Delete "${wf.name}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer action */}
                {onDeleteWorkflow && currentWorkflow && (
                  <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between px-2">
                    <span className="text-[10px] text-slate-400">Current Active</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete current workflow "${currentWorkflow.name}"?`)) {
                          onDeleteWorkflow(currentWorkflow.id);
                          setIsWfOpen(false);
                        }
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Current Workflow</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DROPDOWN 2: CONNECT WORKFLOWS & NODES */}
        <div className="relative" ref={connectRef}>
          <button
            onClick={() => {
              setIsConnectMenuOpen(!isConnectMenuOpen);
              setIsWfOpen(false);
              setIsEnvMenuOpen(false);
              setIsPanesMenuOpen(false);
            }}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors shadow-sm"
            title="Options to connect workflows, sequence and node flow"
          >
            <Workflow className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Connect</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isConnectMenuOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
              <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Workflow &amp; Connector Options
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Sequence &amp; Flow</span>
              </div>

              <div className="space-y-1 p-1">
                {/* 1. Connect 2+ Workflows */}
                {onOpenMultiWorkflowModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenMultiWorkflowModal();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-slate-800 text-slate-200 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>Connect 2+ Workflows in Sequence</span>
                        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">New</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Link multiple workflows together with execution order triggers.
                      </div>
                    </div>
                  </button>
                )}

                {/* 2. Add Node Connector */}
                {onOpenAddConnector && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAddConnector();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-slate-800 text-slate-200 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-indigo-950/80 border border-indigo-800 text-indigo-400 group-hover:scale-105 transition-transform">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Add Node-to-Node Connector
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Connect any 2 nodes using Kafka, S3, gRPC, or Snowflake.
                      </div>
                    </div>
                  </button>
                )}

                {/* 3. Connect Sub-Workflow Modal */}
                {onOpenConnectModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenConnectModal();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left hover:bg-slate-800 text-slate-200 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-purple-950/80 border border-purple-800 text-purple-400 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Attach Sub-Workflow to Node
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Append new sub-pipeline from current exit port.
                      </div>
                    </div>
                  </button>
                )}

                <div className="h-[1px] bg-slate-800 my-1" />

                {/* 4. Add Draggable Start Gateway */}
                {onAddStartGateway && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddStartGateway();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-1.5 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                  >
                    <span className="text-emerald-400 font-bold">🚩</span>
                    <span className="truncate">Add Draggable Start Workflow Gateway</span>
                  </button>
                )}

                {/* 5. Add Draggable Target Gateway */}
                {onAddTargetGateway && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddTargetGateway();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-1.5 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                  >
                    <span className="text-indigo-400 font-bold">🏁</span>
                    <span className="truncate">Add Draggable Target Workflow Linker</span>
                  </button>
                )}

                {/* 6. Toggle Sequence Flow Numbers */}
                {onToggleSequenceFlow && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSequenceFlow();
                      setIsConnectMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Show Sequence Flow Order (1, 2, 3...)</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      showSequenceFlow
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {showSequenceFlow ? 'Active' : 'Off'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DROPDOWN 3: ENVIRONMENT & WORKSPACE */}
        <div className="relative" ref={envRef}>
          <button
            onClick={() => {
              setIsEnvMenuOpen(!isEnvMenuOpen);
              setIsWfOpen(false);
              setIsConnectMenuOpen(false);
              setIsPanesMenuOpen(false);
            }}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm"
            title="Configure Environment, Workspace, and Pipeline simulation"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden md:inline text-slate-400">Env:</span>
            <span>{environment}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isEnvMenuOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Environment &amp; Infrastructure
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Zero Trust Mesh</span>
              </div>

              {/* Environment Selector */}
              {onEnvironmentChange && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Server className="w-3 h-3 text-cyan-400" />
                    <span>Deployment Environment:</span>
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => onEnvironmentChange(e.target.value as EnvironmentType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="Production">Production (Multi-AZ Enterprise Mesh)</option>
                    <option value="Staging">Staging (Pre-Prod Staging Cluster)</option>
                    <option value="Development">Development (Isolated Sandbox)</option>
                  </select>
                </div>
              )}

              {/* Workspace Selector */}
              {onWorkspaceChange && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-indigo-400" />
                    <span>Data Mesh Workspace:</span>
                  </label>
                  <select
                    value={workspace}
                    onChange={(e) => onWorkspaceChange(e.target.value as WorkspaceType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    <option value="Enterprise Data Integration">Enterprise Data Integration Mesh</option>
                    <option value="Analytical Mesh Core">Analytical Core &amp; Warehousing</option>
                    <option value="Governance & Compliance Hub">Governance &amp; Compliance Hub</option>
                  </select>
                </div>
              )}

              {/* Execution Role Info */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldAlert className="w-3 h-3 text-emerald-400" />
                  Role:
                </span>
                <span className="text-slate-200 truncate">Enterprise-Execution-Role-Principal</span>
              </div>

              {/* Simulation Controls & Tools */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                {onToggleSimulation && (
                  <button
                    type="button"
                    onClick={onToggleSimulation}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                      isSimulating
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {isSimulating ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isSimulating ? 'Halt Simulation' : 'Simulate'}</span>
                  </button>
                )}

                {onResetSimulation && (
                  <button
                    type="button"
                    onClick={onResetSimulation}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Reset Simulation Metrics"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => exportProjectZip({ appName: 'NxtGenOrchestrator' })}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                  title="Download all code and details in 1 ZIP file"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>ZIP</span>
                </button>

                {onOpenAsciiModal && (
                  <button
                    type="button"
                    onClick={onOpenAsciiModal}
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs"
                    title="View ASCII Wireframe"
                  >
                    <Code className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DROPDOWN 4: PANES, MENUS & DISPLAY TOGGLES */}
        <div className="relative" ref={panesRef}>
          <button
            onClick={() => {
              setIsPanesMenuOpen(!isPanesMenuOpen);
              setIsWfOpen(false);
              setIsConnectMenuOpen(false);
              setIsEnvMenuOpen(false);
            }}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm"
            title="Toggle panes, menus, sidebars, and execution console"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden md:inline">Panes &amp; Menus</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isPanesMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl space-y-1">
              <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Collapsible Panes &amp; Menus
                </span>
                <span className="text-[10px] font-mono text-cyan-400">View Controls</span>
              </div>

              {/* Sidebar toggle */}
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <PanelLeft className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Left Navigation Sidebar</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSidebarVisible
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {isSidebarVisible ? 'Visible' : 'Hidden'}
                  </span>
                </button>
              )}

              {/* Toolbox toggle */}
              <button
                type="button"
                onClick={onToggleToolbox}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Left Nodes Toolbox</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isToolboxVisible
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}>
                  {isToolboxVisible ? 'Visible' : 'Hidden'}
                </span>
              </button>

              {/* Inspector Details toggle */}
              <button
                type="button"
                onClick={onToggleInspector}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <PanelRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Right Details Inspector [D]</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isInspectorVisible
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}>
                  {isInspectorVisible ? 'Visible' : 'Hidden'}
                </span>
              </button>

              {/* Execution Console toggle */}
              <button
                type="button"
                onClick={onToggleBottomConsole}
                className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bottom Execution Console</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isBottomConsoleVisible
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}>
                  {isBottomConsoleVisible ? 'Visible' : 'Hidden'}
                </span>
              </button>

              {/* MiniMap toggle */}
              {onToggleMiniMap && (
                <button
                  type="button"
                  onClick={onToggleMiniMap}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Radar Mini-Map</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isMiniMapVisible
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {isMiniMapVisible ? 'Visible' : 'Hidden'}
                  </span>
                </button>
              )}

              {/* Zen Mode toggle */}
              {onToggleZenMode && (
                <button
                  type="button"
                  onClick={onToggleZenMode}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Zen Full Canvas Mode</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isZenMode
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {isZenMode ? 'Active' : 'Off'}
                  </span>
                </button>
              )}

              <div className="h-[1px] bg-slate-800 my-1" />

              {/* Master toggle */}
              {onToggleAllHeaders && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleAllHeaders();
                    setIsPanesMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-200 border border-cyan-800/80 transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    {areAllHeadersHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{areAllHeadersHidden ? 'Show All Chrome & Headers' : 'Hide All Chrome & Headers'}</span>
                  </div>
                  <kbd className="font-mono text-[9px] bg-slate-950 px-1 py-0.2 rounded border border-cyan-800 text-cyan-300">H</kbd>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Actions, Results, Delete Controls & Collapsible Hide/Show All Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* RUN WORKFLOW BUTTON */}
        {onRunWorkflow && (
          <button
            onClick={onRunWorkflow}
            disabled={isWorkflowRunning}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 text-xs transition-all shadow-md shrink-0 ${
              isWorkflowRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02]'
            }`}
            title="Execute and simulate this workflow pipeline to view real-time execution results"
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
        )}

        {/* SHOW RESULTS BUTTON */}
        {onOpenResults && (
          <button
            onClick={onOpenResults}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-sm shrink-0 ${
              hasResults
                ? 'bg-indigo-950/90 text-indigo-200 hover:text-white border-indigo-500/80 shadow-indigo-950/50 hover:bg-indigo-900/90'
                : 'bg-slate-950 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Show workflow execution results, DAG metrics, and timestamped audit logs"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Show Results</span>
            {hasResults && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        )}

        {/* DOWNLOAD CODE FOR CLAUDE BUTTON */}
        <button
          onClick={() => {
            if (onOpenExportModal) {
              onOpenExportModal();
            } else {
              exportProjectZip({ appName: 'NxtGenOrchestrator' });
            }
          }}
          className="px-2.5 sm:px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
          title="Download complete code package & prompt file to check in Claude"
        >
          <Bot className="w-3.5 h-3.5 text-amber-400" />
          <span>Claude Code</span>
          <span className="text-[9px] font-mono bg-amber-950 px-1 py-0.2 rounded border border-amber-800 text-amber-300 hidden sm:inline">.ZIP</span>
        </button>

        {/* Delete Selected Connector Button */}
        {selectedEdgeId && onDeleteConnector && (
          <button
            onClick={() => onDeleteConnector(selectedEdgeId)}
            className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
            title="Delete the currently selected connector"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Connector</span>
          </button>
        )}

        {/* Delete Selected Node Button */}
        {selectedNodeId && onDeleteNode && !selectedEdgeId && (
          <button
            onClick={() => onDeleteNode(selectedNodeId)}
            className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
            title="Delete selected node from workflow"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Node</span>
          </button>
        )}

        {/* Delete Active Workflow Button (Header button) */}
        {onDeleteWorkflow && currentWorkflow && (
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete workflow "${currentWorkflow.name}"?`)) {
                onDeleteWorkflow(currentWorkflow.id);
              }
            }}
            className="p-1.5 bg-slate-950 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-700/80 text-slate-400 hover:text-rose-300 rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
            title={`Delete current workflow "${currentWorkflow.name}"`}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline text-[11px] font-semibold text-rose-300">Delete Workflow</span>
          </button>
        )}

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5 hidden sm:block shrink-0" />

        {/* COLLAPSIBLE HIDE/SHOW ALL TOGGLE FOR ALL MENUS AND HEADERS */}
        {onToggleAllHeaders && (
          <button
            onClick={onToggleAllHeaders}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all shadow-sm shrink-0 ${
              areAllHeadersHidden
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/80 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title={areAllHeadersHidden ? "Restore all headers & menus [H]" : "Collapse all headers, menus and surrounding chrome [H]"}
          >
            {areAllHeadersHidden ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Show All</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Collapse Headers</span>
              </>
            )}
            <kbd className="font-mono text-[9px] bg-slate-900 px-1 py-0.2 rounded border border-slate-800 text-slate-400 hidden lg:inline">H</kbd>
          </button>
        )}
      </div>
    </div>
  );
};
