import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DAGNode, DAGEdge, EnvironmentType, WorkspaceType, WorkflowCatalogItem } from '../../types/architecture';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Activity, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  ArrowRightLeft, 
  Calculator, 
  Archive,
  Cpu,
  Eye,
  EyeOff,
  PanelLeft,
  PanelRight,
  Zap,
  GitBranch,
  Sliders,
  Plus,
  Play,
  Loader2,
  Link2,
  BarChart2,
  BarChart3,
  Radio,
  Sparkles,
  Trash2,
  GripVertical,
  Workflow,
  CheckCircle2,
  Layers,
  ArrowRight,
  Server,
  FolderGit2,
  ChevronDown,
  Bot,
  Lock,
  FileSpreadsheet
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  selectedEdgeId?: string | null;
  onSelectEdge?: (id: string | null) => void;
  onDeleteConnector?: (id: string) => void;
  onDeleteNode?: (id: string) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  isSimulating: boolean;
  areAllHeadersHidden?: boolean;
  onToggleAllHeaders?: () => void;
  isHeaderVisible?: boolean;
  onToggleHeader?: () => void;
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
  isBottomConsoleVisible?: boolean;
  onToggleBottomConsole?: () => void;
  isToolboxVisible?: boolean;
  onToggleToolbox?: () => void;
  isInspectorVisible?: boolean;
  onToggleInspector?: () => void;
  onHideDetails?: () => void;
  onOpenConnectModal?: (sourceNodeId?: string) => void;
  onOpenAddConnector?: (sourceNodeId?: string) => void;
  onRunWorkflow?: () => void;
  isWorkflowRunning?: boolean;
  onOpenResults?: () => void;
  hasResults?: boolean;
  isMiniMapVisible?: boolean;
  onToggleMiniMap?: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  onAddDirectEdge?: (sourceNodeId: string, targetNodeId: string) => void;
  showSequenceFlow?: boolean;
  onToggleSequenceFlow?: () => void;
  onAddStartGateway?: () => void;
  onAddTargetGateway?: () => void;
  workflows?: WorkflowCatalogItem[];
  currentWorkflowId?: string;
  onSelectWorkflow?: (workflowId: string) => void;
  onDeleteWorkflow?: (workflowId: string) => void;
  environment?: EnvironmentType;
  onEnvironmentChange?: (env: EnvironmentType) => void;
  workspace?: WorkspaceType;
  onWorkspaceChange?: (ws: WorkspaceType) => void;
  onOpenMultiWorkflowModal?: () => void;
  onOpenExportModal?: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  selectedEdgeId,
  onSelectEdge,
  onDeleteConnector,
  onDeleteNode,
  onUpdateNodePosition,
  isSimulating,
  areAllHeadersHidden = false,
  onToggleAllHeaders,
  isHeaderVisible = true,
  onToggleHeader,
  isSidebarVisible = true,
  onToggleSidebar,
  isBottomConsoleVisible = true,
  onToggleBottomConsole,
  isToolboxVisible = true,
  onToggleToolbox,
  isInspectorVisible = false,
  onToggleInspector,
  onHideDetails,
  onOpenConnectModal,
  onOpenAddConnector,
  onRunWorkflow,
  isWorkflowRunning = false,
  onOpenResults,
  hasResults = false,
  isMiniMapVisible = true,
  onToggleMiniMap,
  isZenMode = false,
  onToggleZenMode,
  onAddDirectEdge,
  showSequenceFlow: initialShowSequenceFlow = true,
  onToggleSequenceFlow,
  onAddStartGateway,
  onAddTargetGateway,
  workflows = [],
  currentWorkflowId,
  onSelectWorkflow,
  onDeleteWorkflow,
  environment = 'Production',
  onEnvironmentChange,
  workspace = 'Enterprise Data Integration',
  onWorkspaceChange,
  onOpenMultiWorkflowModal,
  onOpenExportModal
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<{ id: string; startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sequence Flow visibility state
  const [localShowSequenceFlow, setLocalShowSequenceFlow] = useState<boolean>(initialShowSequenceFlow);
  const isSequenceFlowActive = onToggleSequenceFlow ? initialShowSequenceFlow : localShowSequenceFlow;
  const toggleSequenceFlow = () => {
    if (onToggleSequenceFlow) {
      onToggleSequenceFlow();
    } else {
      setLocalShowSequenceFlow(prev => !prev);
    }
  };

  // DROPDOWN OPEN STATES FOR CANVAS TOOLBAR
  const [isWfDropdownOpen, setIsWfDropdownOpen] = useState(false);
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [isPanesDropdownOpen, setIsPanesDropdownOpen] = useState(false);

  const wfDropdownRef = useRef<HTMLDivElement>(null);
  const envDropdownRef = useRef<HTMLDivElement>(null);
  const panesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wfDropdownRef.current && !wfDropdownRef.current.contains(target)) setIsWfDropdownOpen(false);
      if (envDropdownRef.current && !envDropdownRef.current.contains(target)) setIsEnvDropdownOpen(false);
      if (panesDropdownRef.current && !panesDropdownRef.current.contains(target)) setIsPanesDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId) || workflows[0];

  // FLOATING & DRAGGABLE "HIDE ALL PARAMETERS" PILL STATE
  const [pillPos, setPillPos] = useState<{ x: number; y: number }>(() => ({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 380) : 620,
    y: 68
  }));
  const [isDraggingPill, setIsDraggingPill] = useState(false);
  const pillDragRef = useRef<{ startMouseX: number; startMouseY: number; startPillX: number; startPillY: number; hasMoved: boolean }>({
    startMouseX: 0,
    startMouseY: 0,
    startPillX: 0,
    startPillY: 0,
    hasMoved: false
  });

  // DRAG-TO-CONNECT INTERACTIVE CANVAS STATE
  const [connectingWire, setConnectingWire] = useState<{
    sourceNodeId: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [hoveredDropNodeId, setHoveredDropNodeId] = useState<string | null>(null);

  // Node dimensions for curve calculations
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 100;

  // Topological / Sequence Index Calculation
  const nodeSequenceMap = useMemo(() => {
    const map: Record<string, number> = {};
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};

    nodes.forEach(n => {
      inDegree[n.id] = 0;
      adj[n.id] = [];
    });

    edges.forEach(e => {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (inDegree[e.target] !== undefined) inDegree[e.target]++;
    });

    // BFS Queue starting from inDegree 0
    let step = 1;
    let queue: string[] = nodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
    if (queue.length === 0 && nodes.length > 0) {
      queue = [nodes[0].id];
    }

    const visited = new Set<string>();

    while (queue.length > 0) {
      const nextQueue: string[] = [];
      queue.forEach(id => {
        if (!visited.has(id)) {
          visited.add(id);
          map[id] = step;
          (adj[id] || []).forEach(nextId => {
            if (!visited.has(nextId)) nextQueue.push(nextId);
          });
        }
      });
      step++;
      queue = nextQueue;
    }

    // Default remaining unvisited nodes
    nodes.forEach(n => {
      if (!map[n.id]) map[n.id] = step;
    });

    return map;
  }, [nodes, edges]);

  // Keyboard shortcut listener: Delete or Backspace to delete selected connector or node
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedEdgeId && onDeleteConnector) {
          e.preventDefault();
          onDeleteConnector(selectedEdgeId);
        } else if (selectedNodeId && onDeleteNode) {
          e.preventDefault();
          onDeleteNode(selectedNodeId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdgeId, selectedNodeId, onDeleteConnector, onDeleteNode]);

  // DRAGGABLE PILL MOUSE & TOUCH HANDLERS
  const handlePillStart = (clientX: number, clientY: number) => {
    setIsDraggingPill(true);
    pillDragRef.current = {
      startMouseX: clientX,
      startMouseY: clientY,
      startPillX: pillPos.x,
      startPillY: pillPos.y,
      hasMoved: false
    };

    const handleMouseMoveWindow = (e: MouseEvent) => {
      const dx = e.clientX - pillDragRef.current.startMouseX;
      const dy = e.clientY - pillDragRef.current.startMouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        pillDragRef.current.hasMoved = true;
      }
      const newX = Math.max(10, Math.min(window.innerWidth - 240, pillDragRef.current.startPillX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 60, pillDragRef.current.startPillY + dy));
      setPillPos({ x: newX, y: newY });
    };

    const handleMouseUpWindow = () => {
      setIsDraggingPill(false);
      window.removeEventListener('mousemove', handleMouseMoveWindow);
      window.removeEventListener('mouseup', handleMouseUpWindow);
    };

    window.addEventListener('mousemove', handleMouseMoveWindow);
    window.addEventListener('mouseup', handleMouseUpWindow);
  };

  const handlePillClick = () => {
    if (!pillDragRef.current.hasMoved && onToggleAllHeaders) {
      onToggleAllHeaders();
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      if (onHideDetails) onHideDetails();
      if (onSelectEdge) onSelectEdge(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      if (onHideDetails) onHideDetails();
      if (onSelectEdge) onSelectEdge(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
    } else if (draggedNode) {
      const dx = (e.clientX - draggedNode.startX) / zoom;
      const dy = (e.clientY - draggedNode.startY) / zoom;
      const newX = Math.max(20, Math.round(draggedNode.nodeStartX + dx));
      const newY = Math.max(20, Math.round(draggedNode.nodeStartY + dy));
      onUpdateNodePosition(draggedNode.id, newX, newY);
    } else if (connectingWire) {
      // Update interactive dragging wire
      const bounds = canvasRef.current?.getBoundingClientRect();
      if (bounds) {
        const mouseCanvasX = (e.clientX - bounds.left - pan.x) / zoom;
        const mouseCanvasY = (e.clientY - bounds.top - pan.y) / zoom;
        setConnectingWire(prev => prev ? { ...prev, currentX: mouseCanvasX, currentY: mouseCanvasY } : null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);

    // If releasing connection wire over a target node, create edge!
    if (connectingWire) {
      if (hoveredDropNodeId && hoveredDropNodeId !== connectingWire.sourceNodeId) {
        if (onAddDirectEdge) {
          onAddDirectEdge(connectingWire.sourceNodeId, hoveredDropNodeId);
        } else if (onOpenAddConnector) {
          onOpenAddConnector(connectingWire.sourceNodeId);
        }
      }
      setConnectingWire(null);
      setHoveredDropNodeId(null);
    }
  };

  // Start drag-to-connect from node output port
  const handleStartConnectWire = (nodeId: string, nodeX: number, nodeY: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = nodeX + NODE_WIDTH;
    const startY = nodeY + NODE_HEIGHT / 2;
    setConnectingWire({
      sourceNodeId: nodeId,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  };

  const getNodeIcon = (category: string, name: string) => {
    const lower = name.toLowerCase();
    // Reporting & BI Dashboards
    if (lower.includes('power bi') || lower.includes('report') || lower.includes('dashboard') || lower.includes('tableau') || lower.includes('chart') || lower.includes('bi')) {
      return BarChart3;
    }
    // Sensitive Data Masking, PII, Redaction, Anonymization, Tokenization
    if (lower.includes('mask') || lower.includes('sensitive') || lower.includes('pii') || lower.includes('tokeniz') || lower.includes('anonymiz') || lower.includes('redact') || lower.includes('dlp')) {
      return EyeOff;
    }
    // Security, Confidential Enclaves, Encryption, Secrets
    if (lower.includes('enclave') || lower.includes('encrypt') || lower.includes('secret') || lower.includes('key')) {
      return Lock;
    }
    // Quality & Contract Gates
    if (lower.includes('contract') || lower.includes('quality') || category === 'guardrail') {
      return ShieldCheck;
    }
    // Streaming & Kafka
    if (lower.includes('kafka') || lower.includes('stream') || lower.includes('event') || lower.includes('kinesis') || lower.includes('queue') || lower.includes('rabbit')) {
      return Radio;
    }
    // AI & LLM / Embeddings
    if (lower.includes('ai') || lower.includes('gemini') || lower.includes('embed') || lower.includes('llm') || lower.includes('copilot') || lower.includes('synthes')) {
      return Sparkles;
    }
    // Files & Spreadsheets
    if (lower.includes('excel') || lower.includes('csv') || lower.includes('sftp') || lower.includes('sheet') || lower.includes('file')) {
      return FileSpreadsheet;
    }
    // Object Storage & Lakes
    if (lower.includes('s3') || lower.includes('lake') || lower.includes('storage') || lower.includes('blob') || lower.includes('iceberg') || lower.includes('delta')) {
      return HardDrive;
    }
    // Gateway & Linker
    if (lower.includes('gateway') || lower.includes('link') || lower.includes('chain') || category === 'control') {
      return GitBranch;
    }
    // Relational Databases / CDC
    if (category === 'source' || lower.includes('postgres') || lower.includes('sql') || lower.includes('db') || lower.includes('cdc') || lower.includes('mysql') || lower.includes('oracle')) {
      return Database;
    }
    if (category === 'sink') return Archive;
    if (lower.includes('join') || lower.includes('enrich') || lower.includes('lookup')) return ArrowRightLeft;
    if (lower.includes('agg') || lower.includes('kpi') || lower.includes('metric') || lower.includes('calc')) return Calculator;
    return Activity;
  };

  return (
    <div 
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex-1 h-full overflow-hidden bg-slate-950 canvas-grid cursor-grab active:cursor-grabbing select-none"
    >
      {/* 1. FLOATING & DRAGGABLE "HIDE ALL PARAMETERS" PILL */}
      <div 
        style={{
          transform: `translate(${pillPos.x}px, ${pillPos.y}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 40
        }}
        className="touch-none select-none"
      >
        <div className={`flex items-center gap-1 rounded-full p-1 border shadow-2xl backdrop-blur-xl transition-shadow ${
          isDraggingPill ? 'ring-2 ring-cyan-400 shadow-cyan-500/40 cursor-grabbing' : 'shadow-slate-950/80 cursor-grab'
        } ${
          areAllHeadersHidden
            ? 'bg-cyan-950/95 border-cyan-400/90 text-cyan-200'
            : 'bg-slate-900/95 border-slate-700/80 text-slate-200 hover:border-cyan-500/60'
        }`}>
          {/* Drag Handle */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              handlePillStart(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              const touch = e.touches[0];
              if (touch) handlePillStart(touch.clientX, touch.clientY);
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing"
            title="Drag to reposition anywhere on screen"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Toggle Button */}
          <button
            onClick={handlePillClick}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full hover:bg-slate-800/80 transition-colors"
            title={areAllHeadersHidden ? "Show All Parameters & Headers [H] • Drag anywhere" : "Hide All Parameters & Headers [H] • Drag anywhere"}
          >
            {areAllHeadersHidden ? (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Show All Parameters</span>
                <kbd className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-cyan-800 text-cyan-300">H</kbd>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hide All Parameters</span>
                <kbd className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">H</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. UNIFIED CANVAS CONTROL TOOLBAR (Moved down from first line) */}
      {!areAllHeadersHidden && (
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md text-xs select-none pointer-events-auto">
          {/* Left Section: Workflow Selector, Connect, Add Connector, Environment, Panes */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-sm shadow-cyan-500/30 shrink-0">
                N
              </span>
              <span className="font-bold text-white text-xs tracking-tight hidden sm:inline">
                NxtGenOrchestrator
              </span>
            </div>

            {/* Workflow Selector Dropdown */}
            {workflows && workflows.length > 0 && onSelectWorkflow && (
              <div className="relative" ref={wfDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsWfDropdownOpen(!isWfDropdownOpen);
                    setIsEnvDropdownOpen(false);
                    setIsPanesDropdownOpen(false);
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
                  title="Switch between workflows"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="max-w-[130px] sm:max-w-[180px] truncate">{currentWorkflow?.name || 'Workflow'}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                    {nodes.length} Nodes
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {isWfDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl">
                    <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Select Pipeline Workflow
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">{workflows.length} Available</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {workflows.map((wf) => {
                        const isCurrent = wf.id === currentWorkflowId;
                        return (
                          <div
                            key={wf.id}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors group ${
                              isCurrent ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-800/80' : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onSelectWorkflow(wf.id);
                                setIsWfDropdownOpen(false);
                              }}
                              className="flex-1 min-w-0 text-left"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs truncate text-white">{wf.name}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">Active</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                {wf.nodes.length} nodes · {wf.edges.length} connections
                              </div>
                            </button>
                            {workflows.length > 1 && onDeleteWorkflow && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteWorkflow(wf.id);
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors ml-1.5 shrink-0"
                                title={`Delete "${wf.name}"`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Direct Connect Workflows (Opens 2-workflow selector modal) */}
            {onOpenMultiWorkflowModal && (
              <button
                type="button"
                onClick={onOpenMultiWorkflowModal}
                className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
                title="Connect 2+ workflows in sequence: Choose Source & Target workflows"
              >
                <Workflow className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Connect Workflows</span>
              </button>
            )}

            {/* Direct Add Connector (Opens Node-to-Node connector modal) */}
            {onOpenAddConnector && (
              <button
                type="button"
                onClick={() => onOpenAddConnector()}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 text-cyan-300 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
                title="Add node-to-node connector: select Source and Target nodes"
              >
                <Link2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>+ Add Connector</span>
              </button>
            )}

            {/* Environment Dropdown (Consistent: only Environment, NO Env) */}
            <div className="relative" ref={envDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsEnvDropdownOpen(!isEnvDropdownOpen);
                  setIsWfDropdownOpen(false);
                  setIsPanesDropdownOpen(false);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm shrink-0"
                title="Configure Environment and Workspace"
              >
                <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-400 hidden sm:inline">Environment:</span>
                <span className="text-white">{environment}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isEnvDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Environment &amp; Infrastructure
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Zero Trust Mesh</span>
                  </div>

                  {onEnvironmentChange && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <Server className="w-3 h-3 text-cyan-400" />
                        <span>Environment:</span>
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

                  {onWorkspaceChange && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3 text-indigo-400" />
                        <span>Workspace:</span>
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
                </div>
              )}
            </div>

            {/* Panes & Menus Dropdown */}
            <div className="relative" ref={panesDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsPanesDropdownOpen(!isPanesDropdownOpen);
                  setIsWfDropdownOpen(false);
                  setIsEnvDropdownOpen(false);
                }}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors shadow-sm shrink-0"
                title="Toggle UI Panes, Toolboxes and Windows"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden md:inline">Panes &amp; Menus</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isPanesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl space-y-1">
                  <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Panes &amp; Display Controls
                    </span>
                  </div>

                  {onToggleSidebar && (
                    <button
                      type="button"
                      onClick={onToggleSidebar}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <PanelLeft className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Left Sidebar</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSidebarVisible ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isSidebarVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  )}

                  {onToggleToolbox && (
                    <button
                      type="button"
                      onClick={onToggleToolbox}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        <span>ETL Toolbox Panel</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isToolboxVisible ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isToolboxVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  )}

                  {onToggleInspector && (
                    <button
                      type="button"
                      onClick={onToggleInspector}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <PanelRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Node Config Inspector</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isInspectorVisible ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isInspectorVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  )}

                  {onToggleBottomConsole && (
                    <button
                      type="button"
                      onClick={onToggleBottomConsole}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bottom Execution Console</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isBottomConsoleVisible ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isBottomConsoleVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  )}

                  {onToggleMiniMap && (
                    <button
                      type="button"
                      onClick={onToggleMiniMap}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Radar Mini-Map</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isMiniMapVisible ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isMiniMapVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </button>
                  )}

                  {onToggleZenMode && (
                    <button
                      type="button"
                      onClick={onToggleZenMode}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Zen Full Canvas</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isZenMode ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {isZenMode ? 'Active' : 'Off'}
                      </span>
                    </button>
                  )}

                  {onToggleAllHeaders && (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleAllHeaders();
                        setIsPanesDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left bg-cyan-950/40 hover:bg-cyan-950/70 text-cyan-200 border border-cyan-800/80 transition-colors text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide All Parameters &amp; Controls</span>
                      </div>
                      <kbd className="font-mono text-[9px] bg-slate-950 px-1 py-0.2 rounded border border-cyan-800 text-cyan-300">H</kbd>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Middle Section: Sequence Flow, Start/Link Gateways, Zoom Controls */}
          <div className="flex items-center gap-1.5">
            {/* Sequence Flow Numbers Toggle */}
            <button
              type="button"
              onClick={toggleSequenceFlow}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isSequenceFlowActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-700/80'
              }`}
              title="Toggle Sequence Flow numbers [Step 1, Step 2...] across all nodes"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Sequence Flow</span>
              <span className="font-mono text-[9px] px-1 rounded bg-slate-900 border border-slate-800 text-slate-300">1→2→3</span>
            </button>

            {/* Add Draggable Start Gateway Action */}
            {onAddStartGateway && (
              <button
                type="button"
                onClick={onAddStartGateway}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Mark start node on canvas"
              >
                <span>🚩</span>
                <span className="hidden xl:inline">Start Gate</span>
              </button>
            )}

            {/* Add Draggable Target Gateway Action */}
            {onAddTargetGateway && (
              <button
                type="button"
                onClick={onAddTargetGateway}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Mark chained workflow gateway on canvas"
              >
                <span>🏁</span>
                <span className="hidden xl:inline">Link Workflow</span>
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Reset Canvas View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Section: Run Workflow, Show Results, Claude Code, Delete controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Delete Selected Connector */}
            {selectedEdgeId && onDeleteConnector && (
              <button
                type="button"
                onClick={() => onDeleteConnector(selectedEdgeId)}
                className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
                title="Delete selected connector"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Connector</span>
              </button>
            )}

            {/* Delete Selected Node */}
            {selectedNodeId && onDeleteNode && !selectedEdgeId && (
              <button
                type="button"
                onClick={() => onDeleteNode(selectedNodeId)}
                className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-700/80 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
                title="Delete selected node"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Node</span>
              </button>
            )}

            {/* Run Workflow */}
            {onRunWorkflow && (
              <button
                type="button"
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

            {/* Show Results */}
            {onOpenResults && (
              <button
                type="button"
                onClick={onOpenResults}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-sm shrink-0 ${
                  hasResults
                    ? 'bg-indigo-950/90 text-indigo-200 hover:text-white border-indigo-500/80 shadow-indigo-950/50 hover:bg-indigo-900/90'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                }`}
                title="Show workflow execution results, DAG metrics, and timestamped audit logs"
              >
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Show Results</span>
                {hasResults && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </button>
            )}

            {/* Claude Code */}
            {onOpenExportModal && (
              <button
                type="button"
                onClick={onOpenExportModal}
                className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all shrink-0"
                title="Download complete code package & prompt file to check in Claude"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Claude Code</span>
                <span className="text-[9px] font-mono bg-amber-950 px-1 py-0.2 rounded border border-amber-800 text-amber-300 hidden xl:inline">.ZIP</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Drag-to-Connect Floating Helper Prompt */}
      {connectingWire && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-cyan-950/95 border border-cyan-400/90 text-cyan-200 text-xs px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Link2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">
            Dragging Connector: Release over any node to link sequence and flow!
          </span>
        </div>
      )}

      {/* 4. Canvas Viewport with Pan & Zoom Transform */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="w-[3000px] h-[1800px] relative pointer-events-auto"
      >
        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Render Existing DAG Edges */}
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const startX = sourceNode.position.x + NODE_WIDTH;
            const startY = sourceNode.position.y + NODE_HEIGHT / 2;
            const endX = targetNode.position.x;
            const endY = targetNode.position.y + NODE_HEIGHT / 2;

            const deltaX = Math.abs(endX - startX) * 0.5;
            const pathData = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            const isSelectedEdge = selectedEdgeId === edge.id;

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Background Shadow line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Click target helper for selecting edge */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="22"
                  className="cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectEdge) onSelectEdge(edge.id);
                  }}
                />
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSelectedEdge ? "#f43f5e" : isSimulating ? "url(#edge-grad)" : "#334155"}
                  strokeWidth={isSelectedEdge ? "3.5" : isSimulating ? "2.5" : "1.8"}
                  strokeDasharray={isSelectedEdge ? "none" : isSimulating ? "6 4" : "none"}
                  className={isSimulating && !isSelectedEdge ? "animate-[dash_1.5s_linear_infinite]" : ""}
                  filter={isSelectedEdge || isSimulating ? "url(#glow)" : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectEdge) onSelectEdge(edge.id);
                  }}
                  style={{ cursor: 'pointer' }}
                />

                {/* Flow Rate / Connector Tag with Delete control */}
                {(edge.label || edge.connectorType) && (
                  <foreignObject
                    x={midX - 85}
                    y={midY - 14}
                    width="170"
                    height="28"
                    className="overflow-visible pointer-events-auto"
                  >
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectEdge) onSelectEdge(edge.id);
                      }}
                      className={`rounded px-2 py-0.5 text-[10px] font-mono text-center shadow-lg backdrop-blur-md whitespace-nowrap flex items-center justify-between gap-1 cursor-pointer transition-all border ${
                        isSelectedEdge
                          ? 'bg-rose-950/95 text-rose-200 border-rose-500 ring-2 ring-rose-500/40 shadow-rose-950/60'
                          : edge.connectorType === 'kafka' ? 'bg-amber-950/90 text-amber-300 border-amber-700 hover:border-amber-400'
                          : edge.connectorType === 'snowflake' ? 'bg-cyan-950/90 text-cyan-200 border-cyan-700 hover:border-cyan-400'
                          : edge.connectorType === 's3' ? 'bg-blue-950/90 text-blue-200 border-blue-700 hover:border-blue-400'
                          : edge.connectorType === 'postgres' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700 hover:border-emerald-400'
                          : 'bg-slate-900/90 border-slate-700/80 text-cyan-300'
                      }`}
                      title={`${edge.connectorName || edge.label || 'Connector'} - Click to select, Del to delete`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelectedEdge ? 'bg-rose-400' : 'bg-cyan-400 animate-pulse'}`} />
                        <span className="truncate max-w-[105px]">
                          {edge.connectorName || edge.label}
                        </span>
                      </div>

                      {/* Inline Delete Connector Button */}
                      {onDeleteConnector && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConnector(edge.id);
                          }}
                          className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-rose-900/80 transition-colors shrink-0"
                          title="Delete this connector"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        </button>
                      )}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Render Active Drag-to-Connect Wire */}
          {connectingWire && (
            <g className="pointer-events-none">
              <path
                d={`M ${connectingWire.startX} ${connectingWire.startY} C ${connectingWire.startX + 80} ${connectingWire.startY}, ${connectingWire.currentX - 80} ${connectingWire.currentY}, ${connectingWire.currentX} ${connectingWire.currentY}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-[dash_1s_linear_infinite]"
                filter="url(#glow)"
              />
              <circle
                cx={connectingWire.currentX}
                cy={connectingWire.currentY}
                r="6"
                fill="#22d3ee"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* HTML Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const Icon = getNodeIcon(node.category, node.name);
          const sequenceStep = nodeSequenceMap[node.id] || 1;
          const isHoveredTarget = hoveredDropNodeId === node.id;
          const isGateway = node.name.toLowerCase().includes('gateway') || node.name.toLowerCase().includes('workflow') || node.category === 'control';

          let categoryBorder = 'border-slate-800';
          let categoryBadgeColor = 'text-slate-400 bg-slate-800/80';
          if (node.category === 'source') {
            categoryBorder = isSelected ? 'border-blue-500' : 'border-blue-900/40 hover:border-blue-700';
            categoryBadgeColor = 'text-blue-400 bg-blue-950/60';
          } else if (node.category === 'guardrail') {
            categoryBorder = isSelected ? 'border-emerald-500' : 'border-emerald-900/40 hover:border-emerald-700';
            categoryBadgeColor = 'text-emerald-400 bg-emerald-950/60';
          } else if (node.category === 'sink') {
            categoryBorder = isSelected ? 'border-purple-500' : 'border-purple-900/40 hover:border-purple-700';
            categoryBadgeColor = 'text-purple-400 bg-purple-950/60';
          } else {
            categoryBorder = isSelected ? 'border-cyan-500' : 'border-cyan-900/40 hover:border-cyan-700';
            categoryBadgeColor = 'text-cyan-400 bg-cyan-950/60';
          }

          if (isHoveredTarget) {
            categoryBorder = 'border-cyan-400 ring-4 ring-cyan-400/50 scale-[1.02] shadow-2xl shadow-cyan-500/50';
          }

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
              }}
              onMouseEnter={() => {
                if (connectingWire && connectingWire.sourceNodeId !== node.id) {
                  setHoveredDropNodeId(node.id);
                }
              }}
              onMouseLeave={() => {
                if (hoveredDropNodeId === node.id) {
                  setHoveredDropNodeId(null);
                }
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggedNode({
                  id: node.id,
                  startX: e.clientX,
                  startY: e.clientY,
                  nodeStartX: node.position.x,
                  nodeStartY: node.position.y
                });
              }}
              style={{
                transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                width: `${NODE_WIDTH}px`
              }}
              className={`absolute rounded-xl bg-slate-900/95 border backdrop-blur-md p-3 cursor-move transition-all z-10 ${categoryBorder} ${
                isSelected ? 'ring-2 ring-cyan-500/50 shadow-xl shadow-cyan-950/50' : 'shadow-md'
              }`}
            >
              {/* Sequence Flow Step Badge (Top-Right) */}
              {isSequenceFlowActive && (
                <div className="absolute -top-3 right-3 z-20 flex items-center gap-1 bg-slate-950 border border-cyan-500/60 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>STEP {sequenceStep}</span>
                </div>
              )}

              {/* Start Node Indicator Badge */}
              {sequenceStep === 1 && (
                <div className="absolute -top-3 left-3 z-20 bg-emerald-950 border border-emerald-500/80 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 shadow-lg flex items-center gap-1">
                  <span>🚩</span>
                  <span>START</span>
                </div>
              )}

              {/* Workflow Gateway Link Indicator */}
              {isGateway && (
                <div className="absolute -top-3 left-3 z-20 bg-purple-950 border border-purple-500/80 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold text-purple-300 shadow-lg flex items-center gap-1">
                  <span>🔗</span>
                  <span>WORKFLOW LINK</span>
                </div>
              )}

              {/* Input Port (Left) - Drop Target */}
              <div 
                className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 transition-all flex items-center justify-center ${
                  isHoveredTarget ? 'border-cyan-300 bg-cyan-500 ring-4 ring-cyan-400/50 scale-125' : 'border-slate-500 hover:border-cyan-400'
                }`}
                title="Input Port (Drop connector here)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>

              {/* Output Port (Right) - Draggable Interactive Connector */}
              <div 
                onMouseDown={(e) => handleStartConnectWire(node.id, node.position.x, node.position.y, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenAddConnector) onOpenAddConnector(node.id);
                  else if (onOpenConnectModal) onOpenConnectModal(node.id);
                }}
                className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 hover:border-white hover:bg-cyan-500 hover:scale-125 transition-all shadow-md flex items-center justify-center cursor-crosshair group/port z-20"
                title={`Drag to connect ${node.name} to another node, or click to open connector menu`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover/port:bg-white animate-pulse" />
              </div>

              {/* Node Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`p-1 rounded ${categoryBadgeColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                    {node.typeLabel.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {node.status === 'completed' && <span className="text-emerald-400 font-medium">Synced</span>}
                  {node.status === 'running' && <span className="text-amber-400 font-medium">Running</span>}
                  {node.status === 'idle' && <span className="text-slate-400">Ready</span>}
                </span>
              </div>

              {/* Node Title */}
              <h4 className="text-xs font-semibold text-slate-100 truncate mb-1">
                {node.name}
              </h4>

              {/* Node Summary / Specs */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1">
                  {node.config.autoScaling?.enabled ? (
                    <span className="flex items-center gap-1 text-amber-300 font-semibold" title="Auto-Scaling Active">
                      <Zap className={`w-3 h-3 text-amber-400 ${isSimulating ? 'animate-pulse' : ''}`} />
                      <span>{node.config.autoScaling.currentScaledCpu || node.config.cpuAllocation}</span>
                    </span>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span>{node.config.cpuAllocation}</span>
                    </>
                  )}
                </div>
                <span className="font-mono text-slate-400">
                  {node.config.autoScaling?.enabled
                    ? `${(node.config.autoScaling.currentScaledMemory || node.config.memoryAllocation).split(' ')[0]} GB (Auto)`
                    : `${node.config.memoryAllocation.split(' ')[0]} GB`}
                </span>
              </div>

              {/* Interactive Quick Actions on Selected Node */}
              {isSelected && (
                <div className="flex items-center justify-between gap-1.5 pt-2 mt-1.5 border-t border-cyan-500/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleInspector) onToggleInspector();
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                    title="Toggle details inspector"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>{isInspectorVisible ? 'Hide Details' : 'Details'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenAddConnector) onOpenAddConnector(node.id);
                    }}
                    className="flex-1 py-1 px-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-[10px] text-cyan-200 flex items-center justify-center gap-1 transition-colors font-medium"
                    title="Connect this node"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Connect</span>
                  </button>
                  {onDeleteNode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(node.id);
                      }}
                      className="py-1 px-1.5 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-[10px] text-rose-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
                      title="Delete this node"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
