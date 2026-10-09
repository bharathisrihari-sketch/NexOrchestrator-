import React, { useState, useMemo } from 'react';
import { DAGNode, DAGEdge } from '../../types/architecture';
import { 
  parseDAGLineage, 
  CANONICAL_COLUMN_LINEAGE, 
  calculateImpactAnalysis, 
  generateOpenLineageEvent 
} from '../../utils/lineageParser';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { 
  GitBranch, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  Layers, 
  Code2, 
  Copy, 
  Check, 
  Filter, 
  AlertTriangle,
  Database,
  Binary
} from 'lucide-react';

interface DataLineageViewProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export const DataLineageView: React.FC<DataLineageViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>(selectedNodeId || nodes[2]?.id || nodes[0]?.id);
  const [columnSearch, setColumnSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedJson, setCopiedJson] = useState(false);

  const lineageData = useMemo(() => {
    return parseDAGLineage(nodes, edges);
  }, [nodes, edges]);

  const activeProfile = lineageData.profiles[activeNodeId] || lineageData.profiles[nodes[0]?.id];
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  const impactAnalysis = useMemo(() => {
    return calculateImpactAnalysis(activeNodeId, nodes, edges);
  }, [activeNodeId, nodes, edges]);

  const openLineageEvent = useMemo(() => {
    return generateOpenLineageEvent(activeNodeId, nodes, edges);
  }, [activeNodeId, nodes, edges]);

  const handleCopyOpenLineage = () => {
    navigator.clipboard.writeText(JSON.stringify(openLineageEvent, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const filteredColumns = CANONICAL_COLUMN_LINEAGE.filter(c => {
    const matchesSearch = 
      c.sourceField.toLowerCase().includes(columnSearch.toLowerCase()) ||
      c.outputField.toLowerCase().includes(columnSearch.toLowerCase()) ||
      c.transformationLogic.toLowerCase().includes(columnSearch.toLowerCase());
    const matchesType = filterType === 'all' || c.transformationType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      {/* View Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
          Governance & Data Lineage Engine · OpenLineage Standard
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-purple-400" />
          <span>Data Lineage & Transformation Dependency Visualizer</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Automated DAG parsing that maps end-to-end data flow paths, upstream dataset provenance, downstream blast radius impact, and column-level cryptographic mutation contracts.
        </p>
      </div>

      {/* Node Selector Strip */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-medium text-slate-400 shrink-0 mr-1">Inspect Node:</span>
        {nodes.map(n => {
          const isSelected = activeNodeId === n.id;
          return (
            <button
              key={n.id}
              onClick={() => {
                setActiveNodeId(n.id);
                onSelectNode(n.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {n.name}
            </button>
          );
        })}
      </div>

      {/* COLLAPSIBLE 1: Flow Paths */}
      <CollapsibleSection
        title="End-to-End Ingestion-to-Sink Data Flow Paths"
        subtitle={`Computed ${lineageData.paths.length} distinct end-to-end pipeline routes from root sources to analytical repositories`}
        badge={`${lineageData.paths.length} Active Routes`}
        badgeColor="bg-cyan-950 text-cyan-400 border border-cyan-800/60"
        icon={Layers}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {lineageData.paths.map((p, idx) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Route 0{idx + 1}: {nodes.find(n => n.id === p.sourceId)?.name} → {nodes.find(n => n.id === p.sinkId)?.name}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {p.nodeSequence.length} Topological Stages
                </span>
              </div>

              {/* Node Sequence Chain */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                {p.nodeSequence.map((nodeId, sIdx) => {
                  const nodeObj = nodes.find(n => n.id === nodeId);
                  const isCurrent = nodeId === activeNodeId;
                  return (
                    <React.Fragment key={nodeId}>
                      <button
                        onClick={() => {
                          setActiveNodeId(nodeId);
                          onSelectNode(nodeId);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-left transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-purple-950/80 border-purple-500 text-purple-300 ring-1 ring-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block">Stage 0{sIdx + 1}</span>
                        <span className="font-semibold truncate max-w-[140px] block">{nodeObj?.name}</span>
                      </button>
                      {sIdx < p.nodeSequence.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE 2: Node Ancestry Explorer */}
      <CollapsibleSection
        title={`Node Lineage Context: ${activeNode.name}`}
        subtitle={`Topological Depth Level: ${activeProfile.depthFromSource} · ${activeProfile.upstreamNodes.length} Upstream Ancestors · ${activeProfile.downstreamNodes.length} Downstream Dependents`}
        badge={`Category: ${activeNode.category.toUpperCase()}`}
        badgeColor="bg-purple-950 text-purple-400 border border-purple-800/60"
        icon={GitBranch}
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upstream Ancestors */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upstream Provenance (Ancestors)</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeProfile.upstreamNodes.length} Ancestor Nodes
              </span>
            </div>

            {activeProfile.upstreamNodes.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-900/40 text-xs text-slate-400">
                Root source component — no upstream pipeline ancestors.
              </div>
            ) : (
              <div className="space-y-2">
                {activeProfile.upstreamNodes.map(up => (
                  <div
                    key={up.id}
                    onClick={() => { setActiveNodeId(up.id); onSelectNode(up.id); }}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 block">{up.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{up.typeLabel}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      Upstream
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Downstream Dependents */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                <span>Downstream Dependents (Blast Radius)</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                {activeProfile.downstreamNodes.length} Consumer Nodes
              </span>
            </div>

            {activeProfile.downstreamNodes.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-900/40 text-xs text-slate-400">
                Terminal sink destination — no downstream pipeline consumers.
              </div>
            ) : (
              <div className="space-y-2">
                {activeProfile.downstreamNodes.map(down => (
                  <div
                    key={down.id}
                    onClick={() => { setActiveNodeId(down.id); onSelectNode(down.id); }}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 block">{down.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{down.typeLabel}</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                      Downstream
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE 3: Blast Radius & Impact Analysis */}
      <CollapsibleSection
        title="Schema Drift & Change Impact Analysis (Blast Radius)"
        subtitle="Simulates downstream propagation if this node's schema contract or transformation rules are modified"
        badge={`Severity: ${impactAnalysis.severity}`}
        badgeColor={
          impactAnalysis.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
          impactAnalysis.severity === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800/60' :
          'bg-blue-950 text-blue-400 border border-blue-800/60'
        }
        icon={ShieldAlert}
        defaultOpen={true}
      >
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Evaluated Component</span>
              <h4 className="text-sm font-bold text-white">{impactAnalysis.targetNodeName}</h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Impacted Nodes: <strong className="text-white">{impactAnalysis.impactedDownstreamNodeCount}</strong></span>
              <span className="text-slate-400">Impacted Fields: <strong className="text-white">{impactAnalysis.impactedFields.length}</strong></span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Architectural Remediation Recommendation:</span>
              <p className="text-slate-300 text-[11px]">{impactAnalysis.remediationRecommendation}</p>
            </div>
          </div>

          {impactAnalysis.impactedDownstreamNodes.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Directly & Indirectly Impacted Downstream Nodes:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {impactAnalysis.impactedDownstreamNodes.map(imp => (
                  <div key={imp.id} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate">{imp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      +{imp.distance} hops
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE 4: Column-Level Transformation Lineage */}
      <CollapsibleSection
        title="Column-Level Lineage & Field Mutation Matrix"
        subtitle="Fine-grained mapping tracking sensitive data tokenization, schema projections, and dimensional rollups"
        badge="Field Lineage"
        badgeColor="bg-emerald-950 text-emerald-400 border border-emerald-800/60"
        icon={Binary}
        defaultOpen={true}
        headerRight={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search field or formula..."
              value={columnSearch}
              onChange={(e) => setColumnSearch(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Source Field & Node</th>
                  <th className="p-3">Transformation Type</th>
                  <th className="p-3">Cryptographic / Math Logic</th>
                  <th className="p-3">Target Field & Classification</th>
                  <th className="p-3">Risk Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredColumns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono">
                      <span className="text-white font-semibold block">{col.sourceField}</span>
                      <span className="text-[10px] text-slate-400 truncate block">{col.sourceNodeName}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                        {col.transformationType}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-amber-300 max-w-[260px] truncate">
                      {col.transformationLogic}
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-white font-semibold block">{col.outputField} ({col.outputType})</span>
                      <span className="text-[10px] text-emerald-400 block">{col.outputClassification}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        col.riskRating === 'Confidential' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
                        col.riskRating === 'Pseudonymized' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {col.riskRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE 5: OpenLineage JSON Event Inspector */}
      <CollapsibleSection
        title="OpenLineage Standard Event Specification (JSON)"
        subtitle="Standardized event schema emitted to enterprise data catalogs (e.g., Marquez, Collibra, DataHub)"
        badge="OpenLineage 1.0.5"
        badgeColor="bg-blue-950 text-blue-400 border border-blue-800/60"
        icon={Code2}
        defaultOpen={false}
        headerRight={
          <button
            onClick={handleCopyOpenLineage}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </button>
        }
      >
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-80 shadow-inner">
          <pre className="whitespace-pre">{JSON.stringify(openLineageEvent, null, 2)}</pre>
        </div>
      </CollapsibleSection>
    </div>
  );
};
