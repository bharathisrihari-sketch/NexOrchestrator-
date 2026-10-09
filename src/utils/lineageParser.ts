import { DAGNode, DAGEdge } from '../types/architecture';

export interface LineagePath {
  id: string;
  sourceId: string;
  sinkId: string;
  nodeSequence: string[];
  edgeSequence: string[];
  description: string;
}

export interface ColumnLineageMapping {
  outputField: string;
  outputType: string;
  outputClassification: string;
  targetNodeId: string;
  targetNodeName: string;
  sourceField: string;
  sourceNodeId: string;
  sourceNodeName: string;
  transformationType: 'Direct Ingest' | 'Hash Tokenization' | 'Format-Preserving Encryption' | 'Dimension Lookup' | 'Window Aggregation' | 'ACID Commit';
  transformationLogic: string;
  riskRating: 'Confidential' | 'Pseudonymized' | 'Public' | 'Metric';
}

export interface NodeLineageProfile {
  nodeId: string;
  nodeName: string;
  category: string;
  upstreamNodes: DAGNode[];
  downstreamNodes: DAGNode[];
  directInputs: DAGNode[];
  directOutputs: DAGNode[];
  isSource: boolean;
  isSink: boolean;
  depthFromSource: number;
}

export interface ImpactAnalysisResult {
  targetNodeId: string;
  targetNodeName: string;
  impactedDownstreamNodeCount: number;
  impactedDownstreamNodes: Array<{ id: string; name: string; distance: number }>;
  impactedFields: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  remediationRecommendation: string;
}

/**
 * Parses DAG nodes and edges to resolve full graph topology and flow paths
 */
export function parseDAGLineage(nodes: DAGNode[], edges: DAGEdge[]) {
  // Build adjacency maps
  const outgoingMap: Record<string, string[]> = {};
  const incomingMap: Record<string, string[]> = {};

  nodes.forEach(n => {
    outgoingMap[n.id] = [];
    incomingMap[n.id] = [];
  });

  edges.forEach(e => {
    if (outgoingMap[e.source]) outgoingMap[e.source].push(e.target);
    if (incomingMap[e.target]) incomingMap[e.target].push(e.source);
  });

  // Helper to find all upstream nodes recursively
  const getUpstream = (nodeId: string, visited = new Set<string>()): string[] => {
    const directParents = incomingMap[nodeId] || [];
    directParents.forEach(p => {
      if (!visited.has(p)) {
        visited.add(p);
        getUpstream(p, visited);
      }
    });
    return Array.from(visited);
  };

  // Helper to find all downstream nodes recursively
  const getDownstream = (nodeId: string, visited = new Set<string>()): string[] => {
    const directChildren = outgoingMap[nodeId] || [];
    directChildren.forEach(c => {
      if (!visited.has(c)) {
        visited.add(c);
        getDownstream(c, visited);
      }
    });
    return Array.from(visited);
  };

  // Calculate topological depth
  const getDepth = (nodeId: string, visited = new Set<string>()): number => {
    const parents = incomingMap[nodeId] || [];
    if (parents.length === 0) return 0;
    let maxParentDepth = 0;
    parents.forEach(p => {
      if (!visited.has(p)) {
        visited.add(p);
        maxParentDepth = Math.max(maxParentDepth, getDepth(p, visited));
      }
    });
    return maxParentDepth + 1;
  };

  // Build node profiles
  const profiles: Record<string, NodeLineageProfile> = {};
  nodes.forEach(n => {
    const upstreamIds = getUpstream(n.id);
    const downstreamIds = getDownstream(n.id);
    const directInputIds = incomingMap[n.id] || [];
    const directOutputIds = outgoingMap[n.id] || [];

    profiles[n.id] = {
      nodeId: n.id,
      nodeName: n.name,
      category: n.category,
      upstreamNodes: nodes.filter(node => upstreamIds.includes(node.id)),
      downstreamNodes: nodes.filter(node => downstreamIds.includes(node.id)),
      directInputs: nodes.filter(node => directInputIds.includes(node.id)),
      directOutputs: nodes.filter(node => directOutputIds.includes(node.id)),
      isSource: directInputIds.length === 0,
      isSink: directOutputIds.length === 0,
      depthFromSource: getDepth(n.id)
    };
  });

  // Calculate all end-to-end paths from sources to sinks
  const paths: LineagePath[] = [];
  const sources = nodes.filter(n => (incomingMap[n.id] || []).length === 0);
  const sinks = nodes.filter(n => (outgoingMap[n.id] || []).length === 0);

  const dfsPaths = (currId: string, currentPath: string[], currentEdges: string[]) => {
    const children = outgoingMap[currId] || [];
    if (children.length === 0) {
      // Reached a sink
      const sourceId = currentPath[0];
      const sinkId = currId;
      paths.push({
        id: `path-${sourceId}-${sinkId}-${paths.length + 1}`,
        sourceId,
        sinkId,
        nodeSequence: [...currentPath],
        edgeSequence: [...currentEdges],
        description: `Ingestion from ${nodes.find(n => n.id === sourceId)?.name || sourceId} traversing through ${currentPath.length - 2} transformation steps to ${nodes.find(n => n.id === sinkId)?.name || sinkId}`
      });
      return;
    }

    children.forEach(childId => {
      const edge = edges.find(e => e.source === currId && e.target === childId);
      dfsPaths(childId, [...currentPath, childId], edge ? [...currentEdges, edge.id] : currentEdges);
    });
  };

  sources.forEach(source => {
    dfsPaths(source.id, [source.id], []);
  });

  return {
    profiles,
    paths,
    sources,
    sinks
  };
}

/**
 * Pre-defined detailed column-level lineage mappings across the canonical pipeline
 */
export const CANONICAL_COLUMN_LINEAGE: ColumnLineageMapping[] = [
  {
    sourceNodeId: 'node-2',
    sourceNodeName: 'Source Dataset B (Semi-Structured)',
    sourceField: 'session_ip_raw',
    targetNodeId: 'node-3',
    targetNodeName: 'Sensitive Data Masking & Tokenization',
    outputField: 'session_ip_masked',
    outputType: 'VARCHAR(45)',
    outputClassification: 'Masked Hash (SHA-256)',
    transformationType: 'Hash Tokenization',
    transformationLogic: 'HMAC_SHA256(session_ip_raw, KMS_SECRET_SALT)',
    riskRating: 'Pseudonymized'
  },
  {
    sourceNodeId: 'node-2',
    sourceNodeName: 'Source Dataset B (Semi-Structured)',
    sourceField: 'account_identifier',
    targetNodeId: 'node-3',
    targetNodeName: 'Sensitive Data Masking & Tokenization',
    outputField: 'account_token',
    outputType: 'VARCHAR(64)',
    outputClassification: 'Format-Preserving Token',
    transformationType: 'Format-Preserving Encryption',
    transformationLogic: 'FF3_1_ENCRYPT(account_identifier, HSM_CMEK_KEY)',
    riskRating: 'Pseudonymized'
  },
  {
    sourceNodeId: 'node-1',
    sourceNodeName: 'Source Dataset A (Structured)',
    sourceField: 'entity_code',
    targetNodeId: 'node-4',
    targetNodeName: 'Reference Dataset Enrichment',
    outputField: 'entity_region_name',
    outputType: 'VARCHAR(64)',
    outputClassification: 'Reference Dimension',
    transformationType: 'Dimension Lookup',
    transformationLogic: 'BROADCAST_JOIN(entity_code, Metadata_Store.dim_region)',
    riskRating: 'Public'
  },
  {
    sourceNodeId: 'node-1',
    sourceNodeName: 'Source Dataset A (Structured)',
    sourceField: 'transaction_amt',
    targetNodeId: 'node-5',
    targetNodeName: 'Business Metric Aggregator',
    outputField: 'total_volume_sum',
    outputType: 'DECIMAL(20,4)',
    outputClassification: 'Curated Metric',
    transformationType: 'Window Aggregation',
    transformationLogic: 'SUM(transaction_amt) OVER (PARTITION BY entity_region_name, TUMBLING_WINDOW(1H))',
    riskRating: 'Metric'
  },
  {
    sourceNodeId: 'node-5',
    sourceNodeName: 'Business Metric Aggregator',
    sourceField: 'total_volume_sum',
    targetNodeId: 'node-6',
    targetNodeName: 'Curated Analytics Repository',
    outputField: 'total_volume_sum',
    outputType: 'DECIMAL(20,4)',
    outputClassification: 'Curated Metric',
    transformationType: 'ACID Commit',
    transformationLogic: 'DELTA_MERGE_INTO(Curated_Analytics_Warehouse.fct_metrics)',
    riskRating: 'Metric'
  }
];

/**
 * Computes Blast Radius & Impact Analysis for any node
 */
export function calculateImpactAnalysis(nodeId: string, nodes: DAGNode[], edges: DAGEdge[]): ImpactAnalysisResult {
  const { profiles } = parseDAGLineage(nodes, edges);
  const targetNode = nodes.find(n => n.id === nodeId);
  const profile = profiles[nodeId];

  if (!targetNode || !profile) {
    return {
      targetNodeId: nodeId,
      targetNodeName: 'Unknown Node',
      impactedDownstreamNodeCount: 0,
      impactedDownstreamNodes: [],
      impactedFields: [],
      severity: 'Low',
      remediationRecommendation: 'No impact detected.'
    };
  }

  const downstreamList = profile.downstreamNodes.map(d => ({
    id: d.id,
    name: d.name,
    distance: (profiles[d.id]?.depthFromSource || 1) - profile.depthFromSource
  })).sort((a, b) => a.distance - b.distance);

  const isUpstreamRoot = profile.isSource;
  const isSecurityEnclave = targetNode.category === 'guardrail';

  let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
  if (isSecurityEnclave) severity = 'Critical';
  else if (isUpstreamRoot || downstreamList.length >= 3) severity = 'High';
  else if (downstreamList.length > 0) severity = 'Medium';

  const impactedFields = targetNode.config.schemaContract?.outputSchema.map(s => s.field) || [];

  let recommendation = `Modifications to ${targetNode.name} require executing regression assertion suites across ${downstreamList.length} downstream components.`;
  if (isSecurityEnclave) {
    recommendation = `CRITICAL: Modifying this node affects cryptographic compliance. Must re-verify zero-leakage tokenization invariants in hardware enclave.`;
  } else if (isUpstreamRoot) {
    recommendation = `Root source schema modification requires updating schema registry contract and checking downstream transform typecasts.`;
  }

  return {
    targetNodeId: nodeId,
    targetNodeName: targetNode.name,
    impactedDownstreamNodeCount: downstreamList.length,
    impactedDownstreamNodes: downstreamList,
    impactedFields,
    severity,
    remediationRecommendation: recommendation
  };
}

/**
 * Generates OpenLineage compliant JSON Event
 */
export function generateOpenLineageEvent(nodeId: string, nodes: DAGNode[], edges: DAGEdge[]) {
  const node = nodes.find(n => n.id === nodeId) || nodes[0];
  const { profiles } = parseDAGLineage(nodes, edges);
  const profile = profiles[node.id];

  return {
    eventType: "START",
    eventTime: new Date().toISOString(),
    producer: "https://nexorchestrator.internal/api/v1/lineage/emitter",
    schemaURL: "https://openlineage.io/spec/1-0-5/OpenLineage.json#/definitions/RunEvent",
    job: {
      namespace: "nexorchestrator.enterprise.pipeline",
      name: `job_${node.id}_${node.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      facets: {
        sourceCodeLocation: {
          type: "git",
          repoUrl: "git@internal.enterprise/data-pipelines/nexorchestrator-core.git",
          path: `jobs/${node.id}.yaml`
        }
      }
    },
    inputs: profile?.directInputs.map(p => ({
      namespace: "nexorchestrator.datasets",
      name: `dataset_${p.id}`,
      facets: {
        schema: {
          fields: p.config.schemaContract?.outputSchema.map(f => ({
            name: f.field,
            type: f.type,
            description: f.classification
          })) || []
        }
      }
    })) || [],
    outputs: [
      {
        namespace: "nexorchestrator.datasets",
        name: `dataset_${node.id}`,
        facets: {
          schema: {
            fields: node.config.schemaContract?.outputSchema.map(f => ({
              name: f.field,
              type: f.type,
              description: f.classification
            })) || []
          }
        }
      }
    ]
  };
}
