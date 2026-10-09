import React, { useState, useRef } from 'react';
import { DAGNode, DAGEdge } from '../../types/architecture';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Activity, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  ArrowRightLeft, 
  Calculator, 
  Archive,
  Cpu
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  isSimulating: boolean;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  isSimulating
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<{ id: string; startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

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
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  const getNodeIcon = (category: string, name: string) => {
    if (category === 'source') {
      return name.includes('Object') ? HardDrive : Database;
    }
    if (category === 'guardrail') return ShieldCheck;
    if (category === 'sink') return Archive;
    if (name.includes('Enrichment')) return ArrowRightLeft;
    if (name.includes('Aggregator')) return Calculator;
    return Activity;
  };

  // Node dimensions for curve calculations
  const NODE_WIDTH = 240;
  const NODE_HEIGHT = 100;

  return (
    <div 
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative flex-1 h-full overflow-hidden bg-slate-950 canvas-grid cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />
        <button
          onClick={handleResetZoom}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset Canvas View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Canvas Viewport with Pan & Zoom Transform */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="w-[2800px] h-[1600px] relative pointer-events-auto"
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
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isSimulating ? "url(#edge-grad)" : "#334155"}
                  strokeWidth={isSimulating ? "2.5" : "1.8"}
                  strokeDasharray={isSimulating ? "6 4" : "none"}
                  className={isSimulating ? "animate-[dash_1.5s_linear_infinite]" : ""}
                  filter={isSimulating ? "url(#glow)" : undefined}
                />
                {/* Flow Rate Tag */}
                {edge.label && (
                  <foreignObject
                    x={midX - 45}
                    y={midY - 12}
                    width="90"
                    height="24"
                    className="overflow-visible"
                  >
                    <div className="bg-slate-900/90 border border-slate-700/80 rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 text-center shadow-md backdrop-blur-sm whitespace-nowrap">
                      {edge.label}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const Icon = getNodeIcon(node.category, node.name);

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

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
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
              className={`absolute rounded-lg bg-slate-900/95 border backdrop-blur-md p-3 cursor-move transition-shadow z-10 ${categoryBorder} ${
                isSelected ? 'ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-950/40' : 'shadow-md'
              }`}
            >
              {/* Input Port (Left) */}
              <div 
                className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-500 hover:border-cyan-400 transition-colors shadow-sm"
                title="Input Port"
              />

              {/* Output Port (Right) */}
              <div 
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-500 hover:border-cyan-400 transition-colors shadow-sm"
                title="Output Port"
              />

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
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>{node.config.cpuAllocation}</span>
                </div>
                <span className="font-mono text-slate-400">
                  {node.config.memoryAllocation.split(' ')[0]} GB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini-map Overlay (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-20 w-44 h-28 bg-slate-900/90 border border-slate-800 rounded-lg p-2 shadow-xl backdrop-blur-md hidden sm:block pointer-events-none">
        <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
          <span>DAG Topology Map</span>
          <span>{nodes.length} nodes</span>
        </div>
        <div className="relative w-full h-20 bg-slate-950/70 rounded border border-slate-800/60 overflow-hidden">
          {nodes.map(n => (
            <div
              key={n.id}
              style={{
                left: `${(n.position.x / 1800) * 100}%`,
                top: `${(n.position.y / 600) * 100}%`
              }}
              className={`absolute w-3 h-1.5 rounded-sm ${
                selectedNodeId === n.id ? 'bg-cyan-400 ring-1 ring-cyan-300' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
