import React, { useState } from 'react';
import { DAGNode, DAGEdge } from '../../types/architecture';
import { CONNECTOR_PRESETS, ConnectorPreset } from '../../data/workflowCatalog';
import { 
  GitBranch, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Database, 
  HardDrive, 
  Radio, 
  CheckCircle2, 
  X, 
  Server, 
  Layers, 
  Cpu, 
  Lock, 
  HelpCircle,
  Sparkles,
  Link2,
  Play
} from 'lucide-react';

interface AddConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: DAGNode[];
  edges: DAGEdge[];
  onAddConnector: (params: {
    sourceNodeId: string;
    targetNodeId: string;
    connectorPreset: ConnectorPreset;
    customLabel?: string;
    protocol: string;
    authMethod: string;
    throughput: string;
  }) => void;
  defaultSourceId?: string;
  onRunWorkflow?: () => void;
}

export const AddConnectorModal: React.FC<AddConnectorModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  onAddConnector,
  defaultSourceId,
  onRunWorkflow
}) => {
  const [activeTab, setActiveTab] = useState<'integrate' | 'guide'>('integrate');
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>('conn-kafka');
  const [sourceNodeId, setSourceNodeId] = useState<string>(
    defaultSourceId || nodes[0]?.id || ''
  );
  const [targetNodeId, setTargetNodeId] = useState<string>(
    nodes[nodes.length - 1]?.id || nodes[1]?.id || ''
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [customProtocol, setCustomProtocol] = useState<string>('');
  const [customThroughput, setCustomThroughput] = useState<string>('');

  if (!isOpen) return null;

  const currentPreset = CONNECTOR_PRESETS.find(p => p.id === selectedConnectorId) || CONNECTOR_PRESETS[0];

  const sourceNode = nodes.find(n => n.id === sourceNodeId);
  const targetNode = nodes.find(n => n.id === targetNodeId);

  // Check if edge already exists
  const existingEdge = edges.find(e => e.source === sourceNodeId && e.target === targetNodeId);

  const categories = ['All', 'Streaming & Event', 'Warehouse & Lakehouse', 'SaaS & Enterprise APIs', 'AI & Guardrails', 'Databases & CDC'];
  const filteredPresets = categoryFilter === 'All' 
    ? CONNECTOR_PRESETS 
    : CONNECTOR_PRESETS.filter(p => p.category === categoryFilter);

  const handleIntegrate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceNodeId || !targetNodeId) return;

    onAddConnector({
      sourceNodeId,
      targetNodeId,
      connectorPreset: currentPreset,
      customLabel: `${currentPreset.name} (${customThroughput || currentPreset.defaultThroughput})`,
      protocol: customProtocol || currentPreset.protocol,
      authMethod: currentPreset.authMethod,
      throughput: customThroughput || currentPreset.defaultThroughput
    });
    onClose();
  };

  const getConnectorIcon = (type: string) => {
    switch (type) {
      case 'kafka':
        return Radio;
      case 'snowflake':
      case 'postgres':
        return Database;
      case 's3':
      case 'databricks':
        return HardDrive;
      case 'gemini':
        return Sparkles;
      case 'salesforce':
      case 'rest':
        return Link2;
      case 'grpc':
        return Zap;
      default:
        return GitBranch;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Add Connector & Integrate Workflows</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Integration Studio
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Establish secure high-throughput data connectors between workflow nodes or external systems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('integrate')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'integrate' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Integrate
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>How to Connect</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'integrate' ? (
          <form onSubmit={handleIntegrate} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 1: Connector: Choose What is Source and What as Target */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold border border-cyan-500/40">1</span>
                    <span>Connector: Choose What is Source and What as Target</span>
                  </label>
                  <p className="text-[11px] text-slate-400 pl-7">
                    Define the upstream origin (Source) and downstream destination (Target), including Power BI Report sink.
                  </p>
                </div>
                {existingEdge && (
                  <span className="text-[11px] text-amber-400 font-mono">
                    ⚠️ Existing link will be updated with new connector
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Node Selector */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      SOURCE (Origin / Outflow)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Upstream Data</span>
                  </div>
                  <select
                    value={sourceNodeId}
                    onChange={(e) => setSourceNodeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.category.toUpperCase()} - {n.id})
                      </option>
                    ))}
                  </select>
                  {sourceNode && (
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {sourceNode.typeLabel}
                      </span>
                      <span>Output: {sourceNode.outputs.join(', ') || 'default stream'}</span>
                    </div>
                  )}
                </div>

                {/* Target Node Selector */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      TARGET (Destination / Inflow)
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Power BI &amp; Sinks</span>
                  </div>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id} disabled={n.id === sourceNodeId}>
                        {n.name} ({n.category.toUpperCase()} - {n.id}) {n.id === sourceNodeId ? '(Source)' : ''}
                      </option>
                    ))}
                  </select>
                  {targetNode && (
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {targetNode.typeLabel}
                      </span>
                      <span>Input: {targetNode.inputs.join(', ') || 'default port'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Connection Topology Ribbon */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-medium truncate max-w-[200px]">
                  {sourceNode?.name || 'Source Node'}
                </span>
                <div className="flex items-center gap-2 px-3 text-slate-400">
                  <span className="h-[1px] w-8 bg-cyan-500/50 hidden sm:block" />
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-semibold">
                    {currentPreset.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-indigo-400 font-medium truncate max-w-[200px]">
                  {targetNode?.name || 'Target Node'}
                </span>
              </div>
            </div>

            {/* Step 2: Choose Connector Type */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Choose Connector Integration Service</span>
                </label>
                <div className="flex items-center gap-1 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${
                        categoryFilter === cat
                          ? 'bg-slate-700 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredPresets.map(preset => {
                  const Icon = getConnectorIcon(preset.type);
                  const isSelected = selectedConnectorId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedConnectorId(preset.id);
                        setCustomProtocol('');
                        setCustomThroughput('');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight line-clamp-1">
                            {preset.name}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {preset.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Security & Protocol Configuration */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Connector Protocol, Security & Performance</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    Transport Protocol
                  </span>
                  <input
                    type="text"
                    value={customProtocol || currentPreset.protocol}
                    onChange={(e) => setCustomProtocol(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    e.g. mTLS 1.3 Strict, gRPC Zero-Copy
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    Authentication & Credential Method
                  </span>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentPreset.authMethod}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>In-memory CSI driver secret injection</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-slate-400 block mb-1">
                    Target Data Throughput
                  </span>
                  <input
                    type="text"
                    value={customThroughput || currentPreset.defaultThroughput}
                    onChange={(e) => setCustomThroughput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Default: {currentPreset.defaultThroughput}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Integrate Connector & Link Workflow</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* How to Connect Workflows Guide Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>How to Add Connectors & Integrate Workflows</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connectors enable multi-system streaming and batch data integration across upstream sources, confidential processing enclaves, and analytical sinks. Follow these steps to connect and run your pipeline:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Step 1: Open the Connector Integration Studio
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click the <strong>[+ Add Connector]</strong> button in the Workflow Canvas header or floating toolbar, or click the green <strong>[+]</strong> output port on any node card on the canvas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Step 2: Select Source and Target Nodes
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Choose the upstream node (e.g., PostgreSQL CDC, Kafka Ingest) as the <strong>Source</strong>, and the downstream receiving node (e.g., AI Guardrail, Snowflake Sink) as the <strong>Target</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Step 3: Select Connector Protocol & Credentials
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Choose from <strong>Kafka SASL</strong>, <strong>Snowflake Snowpipe</strong>, <strong>AWS S3 Iceberg</strong>, <strong>Salesforce PubSub</strong>, <strong>REST Webhook</strong>, or <strong>gRPC Zero-Copy</strong>. Security certificates and mutual TLS 1.3 are automatically provisioned.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">
                    Step 4: Integrate and Link
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click <strong>[Integrate Connector & Link Workflow]</strong>. The canvas creates the directed edge with a connector tag and starts real-time link validation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                  5
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-emerald-300">
                    Step 5: Run Workflow & View Results
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click the prominent <strong>[▶ Run Workflow]</strong> button at the top of the canvas. The engine simulates end-to-end packet traversal and opens the <strong>Workflow Execution Results</strong> panel with latency, record counts, and downloadable text logs.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('integrate')}
                className="px-4 py-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Back to Connector Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onRunWorkflow && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRunWorkflow();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Workflow Now</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
