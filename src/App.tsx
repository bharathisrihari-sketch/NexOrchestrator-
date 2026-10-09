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
import { FullBlueprintDoc } from './components/Documentation/FullBlueprintDoc';
import { AsciiWireframeModal } from './components/Modals/AsciiWireframeModal';
import { ExportBlueprintModal } from './components/Modals/ExportBlueprintModal';
import { ExecutiveDeck } from './components/Presentation/ExecutiveDeck';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<EnvironmentType>('Production');
  const [workspace, setWorkspace] = useState<WorkspaceType>('Enterprise Data Integration');

  // Canvas State
  const [nodes, setNodes] = useState<DAGNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<DAGEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-3');

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

  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
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
      />

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* VIEW 1: WORKFLOW CANVAS & STUDIO (Section 1) */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Environment & Simulation Bar */}
            <EnvironmentBar
              environment={environment}
              onEnvironmentChange={setEnvironment}
              workspace={workspace}
              onWorkspaceChange={setWorkspace}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              onResetSimulation={handleResetSimulation}
              onOpenAsciiModal={() => setIsAsciiModalOpen(true)}
            />

            {/* Canvas Middle Split */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Left Toolbox */}
              <ToolboxPanel
                onAddNode={handleAddNode}
                onOpenCopilot={() => setActiveTab('copilot')}
              />

              {/* Central Visual DAG Canvas */}
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onUpdateNodePosition={handleUpdateNodePosition}
                isSimulating={isSimulating}
              />

              {/* Right Node Inspector */}
              <NodeInspector
                node={selectedNode}
                onUpdateConfig={handleUpdateConfig}
              />
            </div>

            {/* Bottom Execution & Monitoring Console */}
            <ExecutionConsole
              isSimulating={isSimulating}
              recordsProcessed={recordsProcessed}
              runDuration={runDuration}
            />
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

        {/* VIEW 8: ARCHITECTURE DOCUMENTATION & TEST CASES */}
        {activeTab === 'tests' && (
          <TestCasesView
            nodes={nodes}
            edges={edges}
          />
        )}

        {/* VIEW 9: COMPLETE ARB / RFP DOSSIER */}
        {activeTab === 'dossier' && (
          <FullBlueprintDoc />
        )}
      </main>

      {/* Modals */}
      <AsciiWireframeModal
        isOpen={isAsciiModalOpen}
        onClose={() => setIsAsciiModalOpen(false)}
      />

      <ExportBlueprintModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ExecutiveDeck
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
