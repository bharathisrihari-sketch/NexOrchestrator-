/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  EnvironmentType, 
  WorkspaceType, 
  DAGNode, 
  DAGEdge, 
  CopilotAnalysisResult 
} from './types/architecture';
import { 
  INITIAL_NODES, 
  INITIAL_EDGES 
} from './data/blueprintData';
import { SidebarNavigation, ActiveTab } from './components/SidebarNavigation';
import { EnvironmentBar } from './components/EnvironmentBar';
import { ToolboxPanel } from './components/Canvas/ToolboxPanel';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodeInspector } from './components/Canvas/NodeInspector';
import { ExecutionConsole } from './components/Canvas/ExecutionConsole';
import { DataLineageView } from './components/Lineage/DataLineageView';
import { TestCasesView } from './components/Testing/TestCasesView';
import { CopilotView } from './components/AICopilot/CopilotView';
import { ReadinessDashboard } from './components/ReadinessDashboard/ReadinessDashboard';
import { ReferenceArchitectureView } from './components/ReferenceArchitecture/ReferenceArchitectureView';
import { RoadmapView } from './components/Roadmap/RoadmapView';
import { GovernanceAuditLogsView } from './components/Governance/GovernanceAuditLogsView';
import { FullBlueprintDoc } from './components/Documentation/FullBlueprintDoc';
import { MasterDocumentationView } from './components/Documentation/MasterDocumentationView';
import { WorkflowExecutionResultsView } from './components/ExecutionResults/WorkflowExecutionResultsView';
import { AsciiWireframeModal } from './components/Modals/AsciiWireframeModal';
import { ExportBlueprintModal } from './components/Modals/ExportBlueprintModal';
import { ExecutiveDeck } from './components/Presentation/ExecutiveDeck';
import { WorkflowDetailsHeader } from './components/Canvas/WorkflowDetailsHeader';
import { ConnectWorkflowModal } from './components/Canvas/ConnectWorkflowModal';
import { ConnectMultiWorkflowModal } from './components/Canvas/ConnectMultiWorkflowModal';
import { AddConnectorModal } from './components/Canvas/AddConnectorModal';
import { WorkflowResultsModal } from './components/Canvas/WorkflowResultsModal';
import { WORKFLOW_CATALOG, ConnectorPreset } from './data/workflowCatalog';
import { WorkflowCatalogItem, WorkflowExecutionResult } from './types/architecture';
import { exportProjectZip } from './utils/projectZipExporter';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<EnvironmentType>('Production');
  const [workspace, setWorkspace] = useState<WorkspaceType>('Enterprise Data Integration');

  // Canvas View Visibility States
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState<boolean>(true);
  const [isBottomConsoleVisible, setIsBottomConsoleVisible] = useState<boolean>(true);
  const [isToolboxVisible, setIsToolboxVisible] = useState<boolean>(true);
  const [isInspectorVisible, setIsInspectorVisible] = useState<boolean>(false); // Details section starts hidden by default
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(true);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isMultiWorkflowModalOpen, setIsMultiWorkflowModalOpen] = useState<boolean>(false);
  const [showSequenceFlow, setShowSequenceFlow] = useState<boolean>(true);
  const [connectPresetSourceId, setConnectPresetSourceId] = useState<string | undefined>(undefined);
  const [canvasNotification, setCanvasNotification] = useState<string | null>(null);

  // Selectable Workflows & Execution Results State
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string>('wf-enterprise-mesh');
  const [workflowsList, setWorkflowsList] = useState<WorkflowCatalogItem[]>(WORKFLOW_CATALOG);
  const [isAddConnectorModalOpen, setIsAddConnectorModalOpen] = useState<boolean>(false);
  const [connectorPresetSourceId, setConnectorPresetSourceId] = useState<string | undefined>(undefined);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState<boolean>(false);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);
  const [executionResultsMap, setExecutionResultsMap] = useState<Record<string, WorkflowExecutionResult>>(() => {
    const map: Record<string, WorkflowExecutionResult> = {};
    WORKFLOW_CATALOG.forEach(wf => {
      if (wf.defaultResults) map[wf.id] = wf.defaultResults;
    });
    return map;
  });

  const areAllHeadersHidden = !isTopHeaderVisible && !isSidebarVisible && !isBottomConsoleVisible;

  const handleToggleAllHeaders = () => {
    if (isTopHeaderVisible || isSidebarVisible || isBottomConsoleVisible) {
      // Hide all headers so the canvas is 100% visible
      setIsTopHeaderVisible(false);
      setIsSidebarVisible(false);
      setIsBottomConsoleVisible(false);
    } else {
      // Restore all headers and surrounding chrome
      setIsTopHeaderVisible(true);
      setIsSidebarVisible(true);
      setIsBottomConsoleVisible(true);
      setIsToolboxVisible(true);
      setIsInspectorVisible(false); // keep details section hidden unless explicitly opened
    }
  };

  // Canvas State
  const [nodes, setNodes] = useState<DAGNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<DAGEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-3');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [recordsProcessed, setRecordsProcessed] = useState<number>(1420800);
  const [runDuration, setRunDuration] = useState<number>(252);

  // Modals
  const [isAsciiModalOpen, setIsAsciiModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // Simulation timer effect
  useEffect(() => {
    let interval: any = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setRunDuration(prev => prev + 1);
        setRecordsProcessed(prev => prev + Math.floor(Math.random() * 2000 + 20000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  // Global keyboard shortcut (Press 'H' or 'h' to toggle all headers on the canvas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        if (activeTab === 'canvas') {
          e.preventDefault();
          handleToggleAllHeaders();
        }
      } else if (e.key === 'd' || e.key === 'D') {
        if (activeTab === 'canvas') {
          e.preventDefault();
          setIsInspectorVisible(prev => !prev);
        }
      } else if (e.key === 'Escape') {
        if (areAllHeadersHidden || isZenMode) {
          setIsTopHeaderVisible(true);
          setIsSidebarVisible(true);
          setIsBottomConsoleVisible(true);
          setIsZenMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTopHeaderVisible, isSidebarVisible, isBottomConsoleVisible, isInspectorVisible, activeTab, isZenMode]);

  const handleConnectNewWorkflowAndRun = (params: {
    newWorkflowName: string;
    category: 'sink' | 'transform' | 'guardrail' | 'source';
    sourceNodeId: string;
    connectionLabel: string;
    description: string;
    autoScale: boolean;
  }) => {
    const newId = `node-ext-${Date.now().toString().slice(-4)}`;
    const sourceNode = nodes.find(n => n.id === params.sourceNodeId);
    const targetX = sourceNode ? sourceNode.position.x + 360 : 1750;
    const targetY = sourceNode ? sourceNode.position.y + 30 : 250;

    const newNode: DAGNode = {
      id: newId,
      name: params.newWorkflowName,
      category: params.category,
      typeLabel: `${params.newWorkflowName} Engine`,
      description: params.description,
      position: { x: targetX, y: targetY },
      status: 'running',
      inputs: ['in-1'],
      outputs: ['out-1'],
      config: {
        cpuAllocation: params.autoScale ? '4.0 vCPU' : '2.0 vCPU',
        memoryAllocation: params.autoScale ? '8.0 GiB' : '4.0 GiB',
        autoScaling: {
          enabled: params.autoScale,
          minCpu: '2.0 vCPU',
          maxCpu: '8.0 vCPU',
          minMemory: '4.0 GiB',
          maxMemory: '16.0 GiB',
          targetMetric: 'Throughput (rec/s)',
          targetValue: 22000,
          scaleUpThresholdPercent: 75,
          scaleDownThresholdPercent: 25,
          currentScaledCpu: '4.0 vCPU',
          currentScaledMemory: '8.0 GiB',
          scalingState: 'Scaling Up',
          lastScalingEvent: `Connected to ${sourceNode?.name || 'upstream'} -> Scaled to 4.0 vCPU on initial ingestion burst`
        },
        containerRuntime: {
          engine: 'OCI Standard Container',
          image: `registry.internal/components/${params.category}:v2.4`,
          isolation: 'gVisor Kernel Sandbox (Runsc)',
          rootless: true,
          readOnlyRootFilesystem: true
        },
        secretsManagement: {
          provider: 'Enterprise Secrets Manager',
          keyStore: 'Secrets Vault / Metadata Store',
          rotationPolicy: 'Automated 30-Day Rotation',
          injectionMechanism: 'CSI Secret Volume Driver',
          inMemoryWipe: true
        },
        encryption: {
          transit: 'Mutual TLS 1.3 Strict',
          rest: 'Envelope KMS AES-256-GCM',
          algorithm: 'AES-256-GCM / FF3-1 Tokenization',
          kmsKeyPlaceholder: 'Enterprise-KMS-Master-Key-Principal'
        },
        networkControls: {
          subnetType: 'Isolated Private VPC Subnet',
          publicIpEnabled: false,
          egressRules: 'Strict Whitelist: Internal Service Mesh Endpoints',
          meshProtocol: 'mTLS Envoy Mesh v1.28'
        },
        aiGuardrails: {
          promptSanitization: true,
          piiAnonymization: true,
          hallucinationCheck: true,
          outputSchemaValidation: true,
          maxTokenBudget: 4096
        },
        securityScanning: {
          sbomValidation: true,
          sastTaintAnalysis: true,
          containerSignatureVerified: true,
          vulnerabilityThreshold: 'Zero Critical / Zero High CVE Policy'
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'Exponential Backoff with Full Jitter',
          initialIntervalSeconds: 2,
          maxIntervalSeconds: 30,
          multiplier: 2
        },
        failureHandling: {
          deadLetterQueue: 'dlq-downstream-quarantine-store',
          circuitBreakerThresholdPercent: 5,
          fallbackAction: 'Quarantine payload and notify telemetry audit',
          auditNotification: true
        }
      }
    };

    const newEdge: DAGEdge = {
      id: `edge-${params.sourceNodeId}-${newId}`,
      source: params.sourceNodeId,
      target: newId,
      label: params.connectionLabel,
      dataFlowRate: '22,600 rec/s'
    };

    setNodes(prev => [...prev, newNode]);
    setEdges(prev => [...prev, newEdge]);
    setSelectedNodeId(newId);
    setIsSimulating(true);

    setCanvasNotification(`Connected "${params.newWorkflowName}" to "${sourceNode?.name || 'Upstream'}"! Pipeline simulation is running.`);
    setTimeout(() => {
      setCanvasNotification(null);
    }, 6000);
  };

  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // Workflow Selection Handler
  const handleSelectWorkflow = (workflowId: string) => {
    const targetWf = workflowsList.find(w => w.id === workflowId);
    if (!targetWf) return;
    setCurrentWorkflowId(workflowId);
    setNodes(targetWf.nodes);
    setEdges(targetWf.edges);
    setEnvironment(targetWf.environment);
    setSelectedNodeId(targetWf.nodes[0]?.id || null);
    setCanvasNotification(`Switched to "${targetWf.name}" (${targetWf.nodes.length} nodes, ${targetWf.edges.length} edges)`);
    setTimeout(() => {
      setCanvasNotification(null);
    }, 4500);
  };

  // Delete Workflow Handler
  const handleDeleteWorkflow = (workflowId: string) => {
    const targetWf = workflowsList.find(w => w.id === workflowId);
    const targetName = targetWf?.name || 'Workflow';

    if (workflowsList.length <= 1) {
      setCanvasNotification(`Cannot delete the only remaining workflow. At least one workflow must remain.`);
      setTimeout(() => setCanvasNotification(null), 4000);
      return;
    }

    const updatedList = workflowsList.filter(w => w.id !== workflowId);
    setWorkflowsList(updatedList);

    // If deleting the active workflow, switch to the first remaining one
    if (workflowId === currentWorkflowId) {
      const nextWf = updatedList[0];
      setCurrentWorkflowId(nextWf.id);
      setNodes(nextWf.nodes);
      setEdges(nextWf.edges);
      setSelectedNodeId(nextWf.nodes[0]?.id || null);
      setSelectedEdgeId(null);
      setEnvironment(nextWf.environment);
    }

    setCanvasNotification(`Deleted workflow "${targetName}" successfully.`);
    setTimeout(() => setCanvasNotification(null), 4000);
  };

  // Delete Connector (Edge) Handler
  const handleDeleteConnector = (edgeId: string) => {
    const targetEdge = edges.find(e => e.id === edgeId);
    const label = targetEdge?.connectorName || targetEdge?.label || 'Connector';

    setEdges(prev => prev.filter(e => e.id !== edgeId));
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null);
    }

    setCanvasNotification(`Deleted connector "${label}" successfully.`);
    setTimeout(() => setCanvasNotification(null), 3500);
  };

  // Delete Node Handler
  const handleDeleteNode = (nodeId: string) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    const nodeName = targetNode?.name || 'Node';

    setNodes(prev => prev.filter(n => n.id !== nodeId));
    // Cascade delete any edges connected to this node
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    setSelectedEdgeId(null);

    setCanvasNotification(`Deleted node "${nodeName}" and detached connections.`);
    setTimeout(() => setCanvasNotification(null), 3500);
  };

  // Run Workflow Handler with Live Simulation and Results Generation
  const handleRunWorkflow = () => {
    const currentWf = workflowsList.find(w => w.id === currentWorkflowId) || workflowsList[0];
    setIsWorkflowRunning(true);
    setIsSimulating(true);

    setCanvasNotification(`Running workflow "${currentWf.name}"... Initializing DAG execution.`);

    setTimeout(() => {
      const freshRunId = `run-${currentWorkflowId.slice(3, 6)}-${Math.floor(Math.random() * 899999 + 100000)}`;
      const stepResults = nodes.map((node, idx) => ({
        nodeId: node.id,
        nodeName: node.name,
        category: node.category,
        status: 'completed' as const,
        durationMs: Math.floor(Math.random() * 140 + 70),
        recordsIn: idx === 0 ? 0 : 54200,
        recordsOut: 54200,
        throughput: '24,600 rec/s',
        statusMessage: `${node.name} executed in hardware sandbox with zero audit exceptions.`
      }));

      const connectorResults = edges.map(edge => {
        const srcNode = nodes.find(n => n.id === edge.source);
        const tgtNode = nodes.find(n => n.id === edge.target);
        return {
          edgeId: edge.id,
          connectorName: edge.connectorName || edge.label || 'Inter-Node Service Mesh Link',
          connectorType: edge.connectorType || 'generic',
          sourceNodeName: srcNode?.name || 'Upstream Node',
          targetNodeName: tgtNode?.name || 'Downstream Node',
          protocol: edge.connectorProtocol || 'mTLS 1.3 Strict',
          status: 'handshake_verified' as const,
          latencyMs: +(Math.random() * 3 + 1.2).toFixed(1),
          bytesTransferred: `${(Math.random() * 10 + 15).toFixed(1)} MB`,
          securityCipher: 'TLS_AES_256_GCM_SHA384'
        };
      });

      const freshResult: WorkflowExecutionResult = {
        runId: freshRunId,
        workflowId: currentWorkflowId,
        workflowName: currentWf.name,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        durationSeconds: +(Math.random() * 0.7 + 0.9).toFixed(2),
        recordsProcessed: Math.floor(Math.random() * 12000 + 48000),
        throughput: '36.8 MB/s (24,600 rec/s)',
        errorRate: '0.00%',
        totalBytes: `${(Math.random() * 8 + 18).toFixed(1)} MB`,
        costEstimate: `$0.00${Math.floor(Math.random() * 30 + 25)} / run`,
        complianceStatus: 'SOC2 / HIPAA / ISO 27001 Compliant (100% Passed)',
        stepResults,
        connectorResults,
        outputPayloadSample: currentWf.defaultResults?.outputPayloadSample || [
          {
            record_id: `rec-${Math.random().toString(36).slice(2, 10)}`,
            status: 'COMMITTED',
            processed_at: new Date().toISOString()
          }
        ],
        auditLogs: [
          {
            timestamp: new Date().toTimeString().split(' ')[0] + '.012',
            level: 'INFO',
            component: 'DISPATCHER',
            message: `Initiated DAG run ${freshRunId} across ${nodes.length} cluster nodes.`
          },
          {
            timestamp: new Date().toTimeString().split(' ')[0] + '.418',
            level: 'AUDIT',
            component: 'SECURITY_ENCLAVE',
            message: 'All cryptographic invariants satisfied. Format-preserving tokenization verified.'
          },
          {
            timestamp: new Date().toTimeString().split(' ')[0] + '.992',
            level: 'SUCCESS',
            component: 'PIPELINE_ENGINE',
            message: `Pipeline run ${freshRunId} completed successfully with zero failures.`
          }
        ]
      };

      setExecutionResultsMap(prev => ({
        ...prev,
        [currentWorkflowId]: freshResult
      }));

      setIsWorkflowRunning(false);
      setCanvasNotification(`Workflow "${currentWf.name}" completed! 54,200 records processed (0 errors). Click "Show Results" to inspect.`);
      setTimeout(() => setCanvasNotification(null), 6000);
      setIsResultsModalOpen(true);
    }, 1400);
  };

  // Add Connector Handler
  const handleAddConnector = (params: {
    sourceNodeId: string;
    targetNodeId: string;
    connectorPreset: ConnectorPreset;
    customLabel?: string;
    protocol: string;
    authMethod: string;
    throughput: string;
  }) => {
    const src = nodes.find(n => n.id === params.sourceNodeId);
    const tgt = nodes.find(n => n.id === params.targetNodeId);

    const existingEdgeIndex = edges.findIndex(
      e => e.source === params.sourceNodeId && e.target === params.targetNodeId
    );

    const edgeData: DAGEdge = {
      id: existingEdgeIndex >= 0 ? edges[existingEdgeIndex].id : `edge-${params.sourceNodeId}-${params.targetNodeId}`,
      source: params.sourceNodeId,
      target: params.targetNodeId,
      label: params.customLabel || params.connectorPreset.name,
      dataFlowRate: params.throughput,
      connectorType: params.connectorPreset.type,
      connectorProtocol: params.protocol,
      connectorStatus: 'connected',
      connectorName: params.connectorPreset.name
    };

    if (existingEdgeIndex >= 0) {
      setEdges(prev => prev.map((e, idx) => idx === existingEdgeIndex ? edgeData : e));
    } else {
      setEdges(prev => [...prev, edgeData]);
    }

    setIsSimulating(true);
    setCanvasNotification(`Integrated connector "${params.connectorPreset.name}" between "${src?.name || 'Source'}" and "${tgt?.name || 'Target'}"!`);
    setTimeout(() => setCanvasNotification(null), 5000);
  };

  const handleOpenAddConnector = (sourceId?: string) => {
    setConnectorPresetSourceId(sourceId);
    setIsAddConnectorModalOpen(true);
  };

  const handleOpenResults = () => {
    setIsResultsModalOpen(true);
  };

  // Add Direct Edge via Drag-to-Connect on Canvas
  const handleAddDirectEdge = (sourceNodeId: string, targetNodeId: string) => {
    const src = nodes.find(n => n.id === sourceNodeId);
    const tgt = nodes.find(n => n.id === targetNodeId);
    const edgeId = `edge-${sourceNodeId}-${targetNodeId}`;
    const newEdge: DAGEdge = {
      id: edgeId,
      source: sourceNodeId,
      target: targetNodeId,
      label: 'mTLS Event Bridge (24,200 rec/s)',
      dataFlowRate: '24,200 rec/s',
      connectorType: 'grpc',
      connectorProtocol: 'mTLS 1.3 Strict',
      connectorStatus: 'connected',
      connectorName: `${src?.name || 'Node'} ➔ ${tgt?.name || 'Node'}`
    };
    setEdges(prev => [...prev.filter(e => !(e.source === sourceNodeId && e.target === targetNodeId)), newEdge]);
    setCanvasNotification(`Direct connector established: "${src?.name || 'Source'}" ➔ "${tgt?.name || 'Target'}"!`);
    setTimeout(() => setCanvasNotification(null), 4000);
  };

  // Add Start Workflow Gateway Marker to Canvas
  const handleAddStartGateway = () => {
    const newId = `node-start-gw-${Date.now().toString().slice(-4)}`;
    const startNode: DAGNode = {
      id: newId,
      name: 'Start Workflow Gateway · Sequence Step 1',
      category: 'control',
      typeLabel: 'Workflow Sequence Trigger',
      description: 'Designated upstream entry point and orchestrator trigger for this workflow pipeline.',
      position: { x: 80, y: 160 },
      status: 'completed',
      inputs: [],
      outputs: ['out-1'],
      config: {
        cpuAllocation: '1.0 vCPU',
        memoryAllocation: '2.0 GiB',
        containerRuntime: {
          engine: 'OCI Standard Container',
          image: 'registry.internal/control/trigger-gateway:latest',
          isolation: 'gVisor Kernel Sandbox (Runsc)',
          rootless: true,
          readOnlyRootFilesystem: true
        },
        secretsManagement: {
          provider: 'Enterprise Secrets Manager',
          keyStore: 'Secrets Vault / Metadata Store',
          rotationPolicy: 'Automated 30-Day Rotation',
          injectionMechanism: 'CSI Secret Volume Driver',
          inMemoryWipe: true
        },
        encryption: {
          transit: 'TLS 1.3',
          rest: 'AES-256-GCM',
          algorithm: 'AES-256-GCM',
          kmsKeyPlaceholder: 'Enterprise Encryption Key (KMS Master Key)'
        },
        networkControls: {
          subnetType: 'Private Isolated Subnet',
          publicIpEnabled: false,
          egressRules: 'Internal VPC CIDR Only',
          meshProtocol: 'mTLS Envoy Service Mesh'
        },
        aiGuardrails: {
          promptSanitization: true,
          piiAnonymization: false,
          hallucinationCheck: false,
          outputSchemaValidation: true,
          maxTokenBudget: 0
        },
        securityScanning: {
          sbomValidation: true,
          sastTaintAnalysis: true,
          containerSignatureVerified: true,
          vulnerabilityThreshold: 'Zero Critical CVEs'
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'Exponential Backoff with Full Jitter',
          initialIntervalSeconds: 5,
          maxIntervalSeconds: 60,
          multiplier: 2.0
        },
        failureHandling: {
          deadLetterQueue: 'Workflow State Store /dlq',
          circuitBreakerThresholdPercent: 10,
          fallbackAction: 'Halt Execution & Alert On-Call Role',
          auditNotification: true
        }
      }
    };
    setNodes(prev => [startNode, ...prev]);
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      setEdges(prev => [
        {
          id: `edge-${newId}-${firstNode.id}`,
          source: newId,
          target: firstNode.id,
          label: 'Sequence Trigger (Step 1 ➔ Step 2)',
          dataFlowRate: 'Trigger Handshake',
          connectorType: 'grpc',
          connectorProtocol: 'mTLS 1.3 Strict',
          connectorStatus: 'connected',
          connectorName: 'Trigger Handshake'
        },
        ...prev
      ]);
    }
    setSelectedNodeId(newId);
    setCanvasNotification(`Added Start Workflow Gateway to canvas (Sequence Step 1).`);
    setTimeout(() => setCanvasNotification(null), 4000);
  };

  // Add Chained Workflow Target Gateway to Canvas
  const handleAddTargetGateway = () => {
    const otherWf = workflowsList.find(w => w.id !== currentWorkflowId) || workflowsList[0];
    const newId = `node-link-gw-${Date.now().toString().slice(-4)}`;
    const gatewayNode: DAGNode = {
      id: newId,
      name: `Link to Workflow: ${otherWf.name.slice(0, 24)}...`,
      category: 'control',
      typeLabel: 'Cross-Workflow Linker Gateway',
      description: `Hands off execution payload and triggers chained workflow "${otherWf.name}".`,
      position: { x: 780, y: 320 },
      status: 'idle',
      inputs: ['in-1'],
      outputs: [],
      config: {
        cpuAllocation: '2.0 vCPU',
        memoryAllocation: '4.0 GiB',
        containerRuntime: {
          engine: 'OCI Standard Container',
          image: 'registry.internal/control/link-gateway:latest',
          isolation: 'gVisor Kernel Sandbox (Runsc)',
          rootless: true,
          readOnlyRootFilesystem: true
        },
        secretsManagement: {
          provider: 'Enterprise Secrets Manager',
          keyStore: 'Secrets Vault / Metadata Store',
          rotationPolicy: 'Automated 30-Day Rotation',
          injectionMechanism: 'CSI Secret Volume Driver',
          inMemoryWipe: true
        },
        encryption: {
          transit: 'TLS 1.3',
          rest: 'AES-256-GCM',
          algorithm: 'AES-256-GCM',
          kmsKeyPlaceholder: 'Enterprise Encryption Key (KMS Master Key)'
        },
        networkControls: {
          subnetType: 'Private Isolated Subnet',
          publicIpEnabled: false,
          egressRules: 'Internal VPC CIDR Only',
          meshProtocol: 'mTLS Envoy Service Mesh'
        },
        aiGuardrails: {
          promptSanitization: true,
          piiAnonymization: false,
          hallucinationCheck: false,
          outputSchemaValidation: true,
          maxTokenBudget: 0
        },
        securityScanning: {
          sbomValidation: true,
          sastTaintAnalysis: true,
          containerSignatureVerified: true,
          vulnerabilityThreshold: 'Zero Critical CVEs'
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'Exponential Backoff with Full Jitter',
          initialIntervalSeconds: 5,
          maxIntervalSeconds: 60,
          multiplier: 2.0
        },
        failureHandling: {
          deadLetterQueue: 'Workflow State Store /dlq',
          circuitBreakerThresholdPercent: 10,
          fallbackAction: 'Halt Execution & Alert On-Call Role',
          auditNotification: true
        }
      }
    };
    const lastNode = nodes[nodes.length - 1];
    setNodes(prev => [...prev, gatewayNode]);
    if (lastNode) {
      setEdges(prev => [
        ...prev,
        {
          id: `edge-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
          label: `Handoff to "${otherWf.name.slice(0, 16)}"`,
          dataFlowRate: 'Cross-Mesh Handshake',
          connectorType: 'kafka',
          connectorProtocol: 'Kafka Mesh Bridge',
          connectorStatus: 'connected',
          connectorName: 'Cross-Workflow Handoff'
        }
      ]);
    }
    setSelectedNodeId(newId);
    setCanvasNotification(`Added Workflow Linker Gateway to canvas (Links to "${otherWf.name}").`);
    setTimeout(() => setCanvasNotification(null), 4000);
  };

  // Connect 2+ Workflows in Sequence & Flow Handler
  const handleConnectWorkflowsInSequence = (params: {
    sourceWorkflowId: string;
    targetWorkflowIds: string[];
    sequenceMode: 'sequential' | 'parallel' | 'streaming';
    connectorProtocol: string;
    triggerCondition: string;
    createGatewayNodes: boolean;
  }) => {
    const srcWf = workflowsList.find(w => w.id === params.sourceWorkflowId) || workflowsList[0];
    const tgtWf = workflowsList.find(w => w.id === params.targetWorkflowIds[0]) || workflowsList[1];

    if (params.createGatewayNodes) {
      const startGwId = `node-start-seq-${Date.now().toString().slice(-4)}`;
      const linkGwId = `node-link-seq-${Date.now().toString().slice(-4)}`;

      const startNode: DAGNode = {
        id: startGwId,
        name: `Sequence Start: ${srcWf.name.slice(0, 24)}`,
        category: 'control',
        typeLabel: 'Workflow 1 Sequence Trigger',
        description: `Upstream initiator for sequence. Triggers on ${params.triggerCondition}.`,
        position: { x: 60, y: 120 },
        status: 'completed',
        inputs: [],
        outputs: ['out-1'],
        config: {
          cpuAllocation: '1.0 vCPU',
          memoryAllocation: '2.0 GiB',
          containerRuntime: { engine: 'OCI Standard Container', image: 'trigger:latest', isolation: 'gVisor', rootless: true, readOnlyRootFilesystem: true },
          secretsManagement: { provider: 'KMS', keyStore: 'Vault', rotationPolicy: '30d', injectionMechanism: 'CSI', inMemoryWipe: true },
          encryption: { transit: 'TLS 1.3', rest: 'AES-256', algorithm: 'AES-256', kmsKeyPlaceholder: 'KMS-Key' },
          networkControls: { subnetType: 'Private Isolated', publicIpEnabled: false, egressRules: 'Internal', meshProtocol: 'mTLS' },
          aiGuardrails: { promptSanitization: true, piiAnonymization: false, hallucinationCheck: false, outputSchemaValidation: true, maxTokenBudget: 0 },
          securityScanning: { sbomValidation: true, sastTaintAnalysis: true, containerSignatureVerified: true, vulnerabilityThreshold: 'Zero CVEs' },
          retryPolicy: { maxAttempts: 3, backoffStrategy: 'Exponential', initialIntervalSeconds: 5, maxIntervalSeconds: 60, multiplier: 2 },
          failureHandling: { deadLetterQueue: '/dlq', circuitBreakerThresholdPercent: 10, fallbackAction: 'Halt', auditNotification: true }
        }
      };

      const linkNode: DAGNode = {
        id: linkGwId,
        name: `Sequence Link ➔ ${tgtWf.name.slice(0, 24)}`,
        category: 'control',
        typeLabel: `Chained Workflow Linker (${params.sequenceMode})`,
        description: `Hands off output payload via ${params.connectorProtocol} to ${tgtWf.name}.`,
        position: { x: 800, y: 340 },
        status: 'idle',
        inputs: ['in-1'],
        outputs: [],
        config: {
          cpuAllocation: '2.0 vCPU',
          memoryAllocation: '4.0 GiB',
          containerRuntime: { engine: 'OCI Standard Container', image: 'linker:latest', isolation: 'gVisor', rootless: true, readOnlyRootFilesystem: true },
          secretsManagement: { provider: 'KMS', keyStore: 'Vault', rotationPolicy: '30d', injectionMechanism: 'CSI', inMemoryWipe: true },
          encryption: { transit: 'TLS 1.3', rest: 'AES-256', algorithm: 'AES-256', kmsKeyPlaceholder: 'KMS-Key' },
          networkControls: { subnetType: 'Private Isolated', publicIpEnabled: false, egressRules: 'Internal', meshProtocol: 'mTLS' },
          aiGuardrails: { promptSanitization: true, piiAnonymization: false, hallucinationCheck: false, outputSchemaValidation: true, maxTokenBudget: 0 },
          securityScanning: { sbomValidation: true, sastTaintAnalysis: true, containerSignatureVerified: true, vulnerabilityThreshold: 'Zero CVEs' },
          retryPolicy: { maxAttempts: 3, backoffStrategy: 'Exponential', initialIntervalSeconds: 5, maxIntervalSeconds: 60, multiplier: 2 },
          failureHandling: { deadLetterQueue: '/dlq', circuitBreakerThresholdPercent: 10, fallbackAction: 'Halt', auditNotification: true }
        }
      };

      const updatedNodes = [startNode, ...nodes, linkNode];
      const newEdges: DAGEdge[] = [
        {
          id: `edge-${startGwId}-${nodes[0]?.id || 'node-1'}`,
          source: startGwId,
          target: nodes[0]?.id || 'node-1',
          label: 'Step 1 Sequence Trigger',
          dataFlowRate: 'Initial Trigger',
          connectorType: 'grpc',
          connectorProtocol: 'mTLS 1.3 Strict',
          connectorStatus: 'connected',
          connectorName: 'Sequence Step 1'
        },
        {
          id: `edge-${nodes[nodes.length - 1]?.id || 'node-6'}-${linkGwId}`,
          source: nodes[nodes.length - 1]?.id || 'node-6',
          target: linkGwId,
          label: `${params.sequenceMode.toUpperCase()}: Link to "${tgtWf.name.slice(0, 16)}"`,
          dataFlowRate: 'Cross-Mesh Handshake',
          connectorType: 'kafka',
          connectorProtocol: params.connectorProtocol,
          connectorStatus: 'connected',
          connectorName: `Step 2 Handoff ➔ ${tgtWf.name.slice(0, 14)}`
        }
      ];

      setNodes(updatedNodes);
      setEdges(prev => [...prev, ...newEdges]);
      setShowSequenceFlow(true);
    }

    setCanvasNotification(`Connected "${srcWf.name}" ➔ "${tgtWf.name}" in ${params.sequenceMode} sequence with ${params.connectorProtocol}!`);
    setTimeout(() => setCanvasNotification(null), 6000);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setRunDuration(0);
    setRecordsProcessed(0);
  };

  const handleUpdateNodePosition = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => node.id === id ? { ...node, position: { x, y } } : node));
  };

  const handleUpdateConfig = (nodeId: string, updatedConfig: Partial<DAGNode['config']>) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          config: {
            ...node.config,
            ...updatedConfig
          }
        };
      }
      return node;
    }));
  };

  const handleAddNode = (category: string, name: string) => {
    const newId = `node-${Date.now().toString().slice(-4)}`;
    const newNode: DAGNode = {
      id: newId,
      name,
      category: category as any,
      typeLabel: `${name} Engine`,
      description: `User-provisioned ${name} node for enterprise pipeline execution.`,
      position: { x: 300 + Math.random() * 200, y: 150 + Math.random() * 200 },
      status: 'idle',
      inputs: ['in-1'],
      outputs: ['out-1'],
      config: {
        cpuAllocation: '2.0 vCPU',
        memoryAllocation: '4.0 GiB',
        containerRuntime: {
          engine: 'OCI Standard Container',
          image: `registry.internal/components/${category}:latest`,
          isolation: 'gVisor Kernel Sandbox (Runsc)',
          rootless: true,
          readOnlyRootFilesystem: true
        },
        secretsManagement: {
          provider: 'Enterprise Secrets Manager',
          keyStore: 'Secrets Vault / Metadata Store',
          rotationPolicy: 'Automated 30-Day Rotation',
          injectionMechanism: 'CSI Secret Volume Driver',
          inMemoryWipe: true
        },
        encryption: {
          transit: 'TLS 1.3',
          rest: 'AES-256-GCM',
          algorithm: 'AES-256-GCM',
          kmsKeyPlaceholder: 'Enterprise Encryption Key (KMS Master Key)'
        },
        networkControls: {
          subnetType: 'Private Isolated Subnet',
          publicIpEnabled: false,
          egressRules: 'Internal VPC CIDR Only',
          meshProtocol: 'mTLS Envoy Service Mesh'
        },
        aiGuardrails: {
          promptSanitization: true,
          piiAnonymization: false,
          hallucinationCheck: false,
          outputSchemaValidation: true,
          maxTokenBudget: 0
        },
        securityScanning: {
          sbomValidation: true,
          sastTaintAnalysis: true,
          containerSignatureVerified: true,
          vulnerabilityThreshold: 'Zero Critical CVEs'
        },
        retryPolicy: {
          maxAttempts: 3,
          backoffStrategy: 'Exponential Backoff with Full Jitter',
          initialIntervalSeconds: 5,
          maxIntervalSeconds: 60,
          multiplier: 2.0
        },
        failureHandling: {
          deadLetterQueue: 'Workflow State Store /dlq',
          circuitBreakerThresholdPercent: 10,
          fallbackAction: 'Halt Execution & Alert On-Call Role',
          auditNotification: true
        }
      }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  const handleApplyCopilotResult = (result: CopilotAnalysisResult) => {
    setNodes(result.proposedNodes);
    setEdges(result.proposedEdges);
    setSelectedNodeId(result.proposedNodes[2]?.id || result.proposedNodes[0]?.id || null);
    setActiveTab('canvas');
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* SIDEWAYS VERTICAL COLLAPSIBLE NAVIGATION */}
      {isSidebarVisible && !isZenMode && (
        <SidebarNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          environment={environment}
          onEnvironmentChange={setEnvironment}
          workspace={workspace}
          onWorkspaceChange={setWorkspace}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenPresentation={() => setIsPresentationOpen(true)}
          onHideSidebar={() => setIsSidebarVisible(false)}
          onToggleAllHeaders={handleToggleAllHeaders}
          areAllHeadersHidden={areAllHeadersHidden}
        />
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* VIEW 1: WORKFLOW CANVAS & STUDIO (Section 1) */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Canvas Middle Split */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Left Toolbox */}
              {isToolboxVisible && !isZenMode && (
                <ToolboxPanel
                  onAddNode={handleAddNode}
                  onOpenCopilot={() => setActiveTab('copilot')}
                />
              )}

              {/* Central Visual DAG Canvas */}
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={(id) => {
                  setSelectedNodeId(id);
                  setSelectedEdgeId(null);
                }}
                selectedEdgeId={selectedEdgeId}
                onSelectEdge={(edgeId) => {
                  setSelectedEdgeId(edgeId);
                  if (edgeId) setSelectedNodeId(null);
                }}
                onDeleteConnector={handleDeleteConnector}
                onDeleteNode={handleDeleteNode}
                onUpdateNodePosition={handleUpdateNodePosition}
                isSimulating={isSimulating}
                areAllHeadersHidden={areAllHeadersHidden}
                onToggleAllHeaders={handleToggleAllHeaders}
                isHeaderVisible={isTopHeaderVisible}
                onToggleHeader={() => setIsTopHeaderVisible(!isTopHeaderVisible)}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
                isBottomConsoleVisible={isBottomConsoleVisible}
                onToggleBottomConsole={() => setIsBottomConsoleVisible(!isBottomConsoleVisible)}
                isToolboxVisible={isToolboxVisible}
                onToggleToolbox={() => setIsToolboxVisible(!isToolboxVisible)}
                isInspectorVisible={isInspectorVisible}
                onToggleInspector={() => setIsInspectorVisible(!isInspectorVisible)}
                onHideDetails={() => setIsInspectorVisible(false)}
                onOpenConnectModal={(sourceId) => {
                  setConnectPresetSourceId(sourceId);
                  setIsConnectModalOpen(true);
                }}
                onOpenAddConnector={handleOpenAddConnector}
                onRunWorkflow={handleRunWorkflow}
                isWorkflowRunning={isWorkflowRunning}
                onOpenResults={handleOpenResults}
                hasResults={!!executionResultsMap[currentWorkflowId]}
                isMiniMapVisible={isMiniMapVisible}
                onToggleMiniMap={() => setIsMiniMapVisible(!isMiniMapVisible)}
                isZenMode={isZenMode}
                onToggleZenMode={() => setIsZenMode(!isZenMode)}
                onAddDirectEdge={handleAddDirectEdge}
                showSequenceFlow={showSequenceFlow}
                onToggleSequenceFlow={() => setShowSequenceFlow(!showSequenceFlow)}
                onAddStartGateway={handleAddStartGateway}
                onAddTargetGateway={handleAddTargetGateway}
                workflows={workflowsList}
                currentWorkflowId={currentWorkflowId}
                onSelectWorkflow={handleSelectWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                environment={environment}
                onEnvironmentChange={setEnvironment}
                workspace={workspace}
                onWorkspaceChange={setWorkspace}
                onOpenMultiWorkflowModal={() => setIsMultiWorkflowModalOpen(true)}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />

              {/* Right Node Inspector */}
              {isInspectorVisible && !isZenMode && (
                <NodeInspector
                  node={selectedNode}
                  onUpdateConfig={handleUpdateConfig}
                  isSimulating={isSimulating}
                  onClose={() => setIsInspectorVisible(false)}
                  onDeleteNode={handleDeleteNode}
                />
              )}
            </div>

            {/* Bottom Execution & Monitoring Console */}
            {isBottomConsoleVisible && !isZenMode && (
              <ExecutionConsole
                isSimulating={isSimulating}
                recordsProcessed={recordsProcessed}
                runDuration={runDuration}
                onToggleHide={() => setIsBottomConsoleVisible(false)}
              />
            )}
          </div>
        )}

        {/* VIEW 2: DATA LINEAGE VISUALIZATION & DEPENDENCIES */}
        {activeTab === 'lineage' && (
          <DataLineageView
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        )}

        {/* VIEW 3: AI COPILOT SYNTHESIZER (Section 2) */}
        {activeTab === 'copilot' && (
          <CopilotView
            onApplyToCanvas={handleApplyCopilotResult}
            onNavigateToCanvas={() => setActiveTab('canvas')}
          />
        )}

        {/* VIEW 4: SECURE EXECUTION INSPECTOR DIRECT VIEW (Section 3) */}
        {activeTab === 'inspector' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  Section 3 · Node Configuration & Secure Execution Inspector
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Secure Execution Profile & Container Specifications
                </h1>
                <p className="text-sm text-slate-400">
                  Inspect and tweak container resource limits, rootless OCI sandboxing, envelope KMS secret management, and failure policies across any node.
                </p>
              </div>

              {/* Node Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
                {nodes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNodeId(n.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedNodeId === n.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {n.name}
                  </button>
                ))}
              </div>

              {/* Centered Large Inspector View */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <NodeInspector
                  node={selectedNode}
                  onUpdateConfig={handleUpdateConfig}
                  isSimulating={isSimulating}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: READINESS ASSESSMENT DASHBOARD (Section 4) */}
        {activeTab === 'readiness' && (
          <ReadinessDashboard />
        )}

        {/* VIEW 6: END-TO-END CLOUD REFERENCE ARCHITECTURE (Section 5) */}
        {activeTab === 'reference' && (
          <ReferenceArchitectureView />
        )}

        {/* VIEW 7: 90-DAY IMPLEMENTATION ROADMAP (Section 6) */}
        {activeTab === 'roadmap' && (
          <RoadmapView />
        )}

        {/* VIEW 8: GOVERNANCE AUDIT LOGS (Section 7) */}
        {activeTab === 'audit' && (
          <GovernanceAuditLogsView />
        )}

        {/* VIEW: WORKFLOW EXECUTION RESULTS & TIMESTAMPED LOGS */}
        {activeTab === 'results' && (
          <WorkflowExecutionResultsView
            currentResult={executionResultsMap[currentWorkflowId] || null}
            workflows={workflowsList}
            currentWorkflowId={currentWorkflowId}
            onSelectWorkflow={handleSelectWorkflow}
            onRunWorkflow={handleRunWorkflow}
            isWorkflowRunning={isWorkflowRunning}
            onNavigateToCanvas={() => setActiveTab('canvas')}
            onDeleteWorkflow={handleDeleteWorkflow}
          />
        )}

        {/* VIEW: MASTER TECHNICAL DOCUMENTATION */}
        {activeTab === 'master_doc' && (
          <MasterDocumentationView />
        )}

        {/* VIEW 9: ARCHITECTURE DOCUMENTATION & TEST CASES */}
        {activeTab === 'tests' && (
          <TestCasesView
            nodes={nodes}
            edges={edges}
            onNavigateToCanvasWithConnect={() => {
              setActiveTab('canvas');
              setIsConnectModalOpen(true);
            }}
          />
        )}

        {/* VIEW 9: COMPLETE ARB / RFP DOSSIER */}
        {activeTab === 'dossier' && (
          <FullBlueprintDoc />
        )}
      </main>

      {/* Floating Canvas Notification Toast */}
      {canvasNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-cyan-500/70 text-cyan-200 text-xs px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white">{canvasNotification}</span>
        </div>
      )}

      {/* Modals */}
      <ConnectMultiWorkflowModal
        isOpen={isMultiWorkflowModalOpen}
        onClose={() => setIsMultiWorkflowModalOpen(false)}
        workflows={workflowsList}
        currentWorkflowId={currentWorkflowId}
        onConnectWorkflowsInSequence={handleConnectWorkflowsInSequence}
      />

      <ConnectWorkflowModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        nodes={nodes}
        onConnectAndRun={handleConnectNewWorkflowAndRun}
      />

      <AddConnectorModal
        isOpen={isAddConnectorModalOpen}
        onClose={() => setIsAddConnectorModalOpen(false)}
        nodes={nodes}
        edges={edges}
        defaultSourceId={connectorPresetSourceId}
        onAddConnector={handleAddConnector}
        onRunWorkflow={handleRunWorkflow}
      />

      <WorkflowResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
        result={executionResultsMap[currentWorkflowId] || null}
        onReRunWorkflow={handleRunWorkflow}
      />

      <AsciiWireframeModal
        isOpen={isAsciiModalOpen}
        onClose={() => setIsAsciiModalOpen(false)}
      />

      <ExportBlueprintModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        workflows={workflowsList}
        currentWorkflowId={currentWorkflowId}
      />

      <ExecutiveDeck
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
