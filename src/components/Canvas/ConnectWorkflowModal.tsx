import React, { useState } from 'react';
import { DAGNode } from '../../types/architecture';
import { 
  GitBranch, 
  Play, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Database, 
  HardDrive, 
  Radio, 
  CheckCircle2, 
  X,
  Server,
  Network,
  Cpu,
  Sparkles
} from 'lucide-react';

interface ConnectWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: DAGNode[];
  onConnectAndRun: (params: {
    newWorkflowName: string;
    category: 'sink' | 'transform' | 'guardrail' | 'source';
    sourceNodeId: string;
    connectionLabel: string;
    description: string;
    autoScale: boolean;
  }) => void;
}

export const ConnectWorkflowModal: React.FC<ConnectWorkflowModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onConnectAndRun
}) => {
  // Preset sub-workflows
  const presets = [
    {
      id: 'anomaly-detector',
      name: 'Real-Time Anomaly Detector & Quarantine Sink',
      category: 'guardrail' as const,
      desc: 'Deep packet inspection with statistical outlier scoring & isolated quarantine bucket.',
      defaultLabel: 'mTLS 1.3 Event Stream (22,600 rec/s)',
      icon: ShieldCheck,
      suggestedSource: 'node-6' // Curated Analytics Repo
    },
    {
      id: 'cross-region-sync',
      name: 'Cross-Cloud Warehouse Replication Sync',
      category: 'sink' as const,
      desc: 'Delta/Iceberg multi-region streaming synchronizer with Zero-Egress VPC peering.',
      defaultLabel: 'Iceberg Catalog Partitioned Sync',
      icon: Database,
      suggestedSource: 'node-6'
    },
    {
      id: 'fraud-scoring',
      name: 'Enterprise Fraud Scoring & Alerting Engine',
      category: 'transform' as const,
      desc: 'Sub-5ms low-latency feature join and machine learning inference pipeline.',
      defaultLabel: 'gRPC Protobuf Zero-Copy Pipe',
      icon: Zap,
      suggestedSource: 'node-5' // Business Metrics Aggregator
    },
    {
      id: 'compliance-archiver',
      name: 'Immutable Regulatory Audit & Cold Archiver',
      category: 'sink' as const,
      desc: 'WORM storage compliance archive with SHA-256 Merkle root notarization.',
      defaultLabel: 'WORM Encrypted Parquet Batch',
      icon: HardDrive,
      suggestedSource: 'node-6'
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState<string>('anomaly-detector');
  const [sourceNodeId, setSourceNodeId] = useState<string>(nodes[nodes.length - 1]?.id || 'node-6');
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'sink' | 'transform' | 'guardrail' | 'source'>('sink');
  const [connectionProtocol, setConnectionProtocol] = useState<string>('mTLS 1.3 Event Stream (22,600 rec/s)');
  const [autoScale, setAutoScale] = useState<boolean>(true);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPreset = presets.find(p => p.id === selectedPreset);
  const activeSourceNode = nodes.find(n => n.id === sourceNodeId);

  const workflowName = isCustom ? (customName || 'Custom Sub-Workflow') : (currentPreset?.name || 'New Workflow');
  const workflowCategory = isCustom ? customCategory : (currentPreset?.category || 'sink');
  const workflowDesc = isCustom 
    ? 'Custom enterprise pipeline node dynamically connected to existing DAG.'
    : (currentPreset?.desc || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectAndRun({
      newWorkflowName: workflowName,
      category: workflowCategory,
      sourceNodeId,
      connectionLabel: connectionProtocol,
      description: workflowDesc,
      autoScale
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Connect New Workflow to Existing Pipeline & Run
              </h2>
              <p className="text-xs text-slate-400">
                Establish an inter-workflow data bridge between existing DAG output and a new sub-pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Architecture Connection Diagram (ASCII) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center justify-between">
              <span>Inter-Workflow Topology Wire</span>
              <span className="text-emerald-400 text-[10px]">● Ready to Connect & Run</span>
            </div>
            <div className="text-slate-300 overflow-x-auto whitespace-pre leading-snug py-1">
{`┌──────────────────────────────────────┐     ${connectionProtocol.slice(0, 26)}...     ┌──────────────────────────────────────┐
│ UPSTREAM: [${activeSourceNode?.name.slice(0, 24) || 'Existing Node'}...] │──────────────────────────────────────▶│ NEW SUB-WORKFLOW: [${workflowName.slice(0, 20)}...] │
│ Output Port: [out-1] mTLS Handshake  │          Schema Contract: Verified   │ Input Port: [in-1] Auto-Scaling ON   │
└──────────────────────────────────────┘                                      └──────────────────────────────────────┘`}
            </div>
          </div>

          {/* STEP 1: Select Upstream Existing Node */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Select Upstream Connection Point (Existing Workflow Node)</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Exit Node Port</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nodes.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSourceNodeId(n.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    sourceNodeId === n.id
                      ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{n.name}</span>
                    <span className="text-[9px] font-mono uppercase text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                      {n.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 truncate">
                    Output: Port [out-1] · {n.config.cpuAllocation} / {n.config.memoryAllocation}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Choose New Workflow Template or Custom */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Choose New Workflow Sub-Pipeline to Create</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setIsCustom(false)}
                  className={`px-2 py-0.5 rounded transition-colors ${!isCustom ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Presets ({presets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`px-2 py-0.5 rounded transition-colors ${isCustom ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Custom
                </button>
              </div>
            </div>

            {!isCustom ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map(preset => {
                  const Icon = preset.icon;
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset.id);
                        setConnectionProtocol(preset.defaultLabel);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-white leading-tight">{preset.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Workflow Node Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Downstream Analytics Streamer"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">Node Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="sink">Target Sink (Analytics / Warehouse / Lake)</option>
                    <option value="transform">Transformation & Enrichment Engine</option>
                    <option value="guardrail">Security & Guardrail Enclave</option>
                    <option value="source">Secondary Ingestion Stream</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Connection Protocol & Auto-Scaling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Inter-Node Transit Protocol</span>
              </label>
              <select
                value={connectionProtocol}
                onChange={(e) => setConnectionProtocol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="mTLS 1.3 Event Stream (22,600 rec/s)">mTLS 1.3 Event Stream (22,600 rec/s)</option>
                <option value="gRPC Protobuf Zero-Copy Pipe">gRPC Protobuf Zero-Copy Pipe (&lt;2ms)</option>
                <option value="Iceberg Catalog Partitioned Sync">Iceberg Catalog Partitioned Sync</option>
                <option value="Managed Event Bus / PubSub Topic">Managed Event Bus / PubSub Topic</option>
                <option value="WORM Encrypted Parquet Batch">WORM Encrypted Parquet Batch</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Elastic Auto-Scaling</span>
              </label>
              <div 
                onClick={() => setAutoScale(!autoScale)}
                className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  autoScale
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">Auto-Scaling: {autoScale ? 'Enabled' : 'Disabled'}</span>
                  <span className="text-[10px] text-slate-400">Dynamic burst 2.0 to 8.0 vCPU on traffic</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${autoScale ? 'bg-amber-500' : 'bg-slate-800'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${autoScale ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Execution Note */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Simulate Pipeline Immediately:</strong> Submitting this connection will attach the new workflow to the upstream node, verify schema invariance, and start the live 22,600 rec/s packet simulation across the unified graph!
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Connect & Run Workflow</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
