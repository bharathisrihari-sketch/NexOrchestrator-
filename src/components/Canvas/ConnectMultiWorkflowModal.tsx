import React, { useState } from 'react';
import { WorkflowCatalogItem, DAGNode, DAGEdge } from '../../types/architecture';
import { 
  GitBranch, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  X,
  Server,
  Network,
  Cpu,
  Plus,
  Trash2,
  Workflow,
  Sparkles,
  Radio,
  Play
} from 'lucide-react';

interface ConnectMultiWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: WorkflowCatalogItem[];
  currentWorkflowId: string;
  onConnectWorkflowsInSequence: (params: {
    sourceWorkflowId: string;
    targetWorkflowIds: string[];
    sequenceMode: 'sequential' | 'parallel' | 'streaming';
    connectorProtocol: string;
    triggerCondition: string;
    createGatewayNodes: boolean;
  }) => void;
}

export const ConnectMultiWorkflowModal: React.FC<ConnectMultiWorkflowModalProps> = ({
  isOpen,
  onClose,
  workflows,
  currentWorkflowId,
  onConnectWorkflowsInSequence
}) => {
  const [sourceWfId, setSourceWfId] = useState<string>(currentWorkflowId || workflows[0]?.id || '');
  const [targetWfId1, setTargetWfId1] = useState<string>(
    workflows.find(w => w.id !== currentWorkflowId)?.id || workflows[1]?.id || ''
  );
  const [targetWfId2, setTargetWfId2] = useState<string>('');
  const [hasThirdWorkflow, setHasThirdWorkflow] = useState<boolean>(false);
  
  const [sequenceMode, setSequenceMode] = useState<'sequential' | 'parallel' | 'streaming'>('sequential');
  const [connectorProtocol, setConnectorProtocol] = useState<string>('Kafka Cross-Mesh Bridge (mTLS 1.3 Strict)');
  const [triggerCondition, setTriggerCondition] = useState<string>('On Step 1 Pipeline Success (Exit Code 0)');
  const [createGatewayNodes, setCreateGatewayNodes] = useState<boolean>(true);

  if (!isOpen) return null;

  const sourceWf = workflows.find(w => w.id === sourceWfId) || workflows[0];
  const targetWf1 = workflows.find(w => w.id === targetWfId1) || workflows[1] || workflows[0];
  const targetWf2 = hasThirdWorkflow ? workflows.find(w => w.id === targetWfId2) : null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const targets = [targetWfId1];
    if (hasThirdWorkflow && targetWfId2 && targetWfId2 !== targetWfId1) {
      targets.push(targetWfId2);
    }
    
    onConnectWorkflowsInSequence({
      sourceWorkflowId: sourceWfId,
      targetWorkflowIds: targets,
      sequenceMode,
      connectorProtocol,
      triggerCondition,
      createGatewayNodes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Connect 2+ Workflows in Sequence & Flow
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  MULTI-DAG ORCHESTRATION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Establish inter-pipeline contracts, sequence execution triggers, and cross-mesh data flow bridges.
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

        {/* Scrollable Form */}
        <form onSubmit={handleConnect} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Visual Sequence Pipeline Flow Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Inter-Workflow Sequence & Flow Topology
              </span>
              <span className="text-emerald-400 font-semibold">Sequence Chaining: Active</span>
            </div>

            {/* Interactive Sequence Chain Cards */}
            <div className="flex flex-col md:flex-row items-center gap-2 pt-1">
              {/* Step 1 Card */}
              <div className="flex-1 w-full bg-slate-900/90 border border-cyan-500/50 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold mb-1">
                  <span>STEP 1 · SOURCE WORKFLOW</span>
                  <span className="bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">Primary</span>
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {sourceWf?.name || 'Source Pipeline'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{sourceWf?.nodes.length || 0} Nodes</span>
                  <span className="text-cyan-400 font-mono">Exit Port [out-seq-1]</span>
                </div>
              </div>

              {/* Sequence Flow Connector Arrow */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1 py-0.5 text-cyan-400 font-mono text-[10px]">
                <span className="text-[9px] text-slate-400 font-sans hidden md:block">Handshake</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-mono">{sequenceMode}</span>
              </div>

              {/* Step 2 Card */}
              <div className="flex-1 w-full bg-slate-900/90 border border-indigo-500/50 rounded-lg p-2.5">
                <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold mb-1">
                  <span>STEP 2 · TARGET WORKFLOW</span>
                  <span className="bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-800">Downstream</span>
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {targetWf1?.name || 'Target Pipeline'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{targetWf1?.nodes.length || 0} Nodes</span>
                  <span className="text-indigo-400 font-mono">Entry Port [in-seq-2]</span>
                </div>
              </div>

              {/* Optional Step 3 Card */}
              {hasThirdWorkflow && targetWf2 && (
                <>
                  <div className="flex flex-col items-center justify-center shrink-0 px-1 py-0.5 text-purple-400 font-mono text-[10px]">
                    <span className="text-[9px] text-slate-400 font-sans hidden md:block">Then</span>
                    <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-[9px] text-purple-400 font-mono">Step 3</span>
                  </div>

                  <div className="flex-1 w-full bg-slate-900/90 border border-purple-500/50 rounded-lg p-2.5">
                    <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold mb-1">
                      <span>STEP 3 · CHAINED WORKFLOW</span>
                      <span className="bg-purple-950 px-1.5 py-0.2 rounded border border-purple-800">Sink</span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {targetWf2.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{targetWf2.nodes.length} Nodes</span>
                      <span className="text-purple-400 font-mono">Entry Port [in-seq-3]</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Workflow Selection Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] flex items-center justify-center font-bold">1</span>
              <span>Connector: Choose What is Source and What as Target (2 or More Workflows)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Source Workflow Picker */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-cyan-300 block">
                  Workflow 1 (Start / Source):
                </label>
                <select
                  value={sourceWfId}
                  onChange={(e) => setSourceWfId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {workflows.map(wf => (
                    <option key={wf.id} value={wf.id}>
                      {wf.name} ({wf.nodes.length} nodes · {wf.category})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Executes first. When its nodes reach the exit gate, triggers Workflow 2.
                </span>
              </div>

              {/* Target Workflow Picker */}
              <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-indigo-300 block">
                  Workflow 2 (Downstream Target):
                </label>
                <select
                  value={targetWfId1}
                  onChange={(e) => setTargetWfId1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {workflows.filter(wf => wf.id !== sourceWfId).map(wf => (
                    <option key={wf.id} value={wf.id}>
                      {wf.name} ({wf.nodes.length} nodes · {wf.category})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Receives output records and state payload from Workflow 1.
                </span>
              </div>
            </div>

            {/* Optional 3rd Workflow Toggle */}
            <div className="pt-1">
              {!hasThirdWorkflow ? (
                <button
                  type="button"
                  onClick={() => {
                    const remaining = workflows.find(w => w.id !== sourceWfId && w.id !== targetWfId1);
                    if (remaining) setTargetWfId2(remaining.id);
                    setHasThirdWorkflow(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-cyan-800/80 bg-cyan-950/20 hover:bg-cyan-950/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Chain a 3rd Workflow in Pipeline Sequence</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-purple-800/60">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-purple-300 block">
                      Workflow 3 (Chain Next Step):
                    </label>
                    <select
                      value={targetWfId2}
                      onChange={(e) => setTargetWfId2(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {workflows.map(wf => (
                        <option key={wf.id} value={wf.id}>
                          {wf.name} ({wf.nodes.length} nodes · {wf.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasThirdWorkflow(false)}
                    className="p-2 text-rose-400 hover:text-rose-200 hover:bg-rose-950 rounded-lg self-end"
                    title="Remove 3rd workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sequence Execution & Trigger Controls */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Sequence Mode & Trigger Handshake</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSequenceMode('sequential')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sequenceMode === 'sequential'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sequential Flow</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Step 1 finishes completely, then triggers Step 2 in strict order.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSequenceMode('parallel')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sequenceMode === 'parallel'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Parallel Fan-Out</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Step 1 forks and dispatches records simultaneously to target pipelines.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSequenceMode('streaming')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  sequenceMode === 'streaming'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold mb-1 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Continuous Stream</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Sub-5ms persistent streaming queue between both running workflows.
                </p>
              </button>
            </div>
          </div>

          {/* Connector Protocol & Trigger Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Inter-Workflow Connector Protocol:
              </label>
              <select
                value={connectorProtocol}
                onChange={(e) => setConnectorProtocol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Kafka Cross-Mesh Bridge (mTLS 1.3 Strict)">Kafka Cross-Mesh Bridge (mTLS 1.3 Strict)</option>
                <option value="gRPC Streaming Pipe with Protobuf Contracts">gRPC Streaming Pipe with Protobuf Contracts</option>
                <option value="Zero-Copy Apache Arrow Flight Peering">Zero-Copy Apache Arrow Flight Peering</option>
                <option value="EventBridge / CloudEvents 1.0 Webhook Push">EventBridge / CloudEvents 1.0 Webhook Push</option>
                <option value="Iceberg Catalog Multi-Region Partition Peering">Iceberg Catalog Multi-Region Peering</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Trigger & Dependency Condition:
              </label>
              <select
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="On Step 1 Pipeline Success (Exit Code 0)">On Step 1 Pipeline Success (Exit Code 0)</option>
                <option value="On Every 1,000 Ingested Records (Micro-Batch)">On Every 1,000 Records (Micro-Batch)</option>
                <option value="On Data Quality Gate Verification Verified">On Quality Gate Verification Passed</option>
                <option value="Continuous Real-Time Bidirectional Event Sync">Continuous Real-Time Event Sync</option>
              </select>
            </div>
          </div>

          {/* Checkbox: Add Draggable Gateway Nodes on Canvas */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="createGatewayNodes"
                checked={createGatewayNodes}
                onChange={(e) => setCreateGatewayNodes(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="createGatewayNodes" className="text-xs text-slate-200 cursor-pointer">
                <strong>Mark Draggable Workflow Gateways directly in Canvas</strong>
                <span className="block text-[11px] text-slate-400">
                  Adds visual gateway nodes with sequence order tags [Step 1, Step 2] and links to sequence and flow.
                </span>
              </label>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0 hidden sm:inline">
              Recommended
            </span>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConnect}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Workflow className="w-4 h-4 fill-current" />
            <span>Connect Workflows &amp; Link Sequence Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
