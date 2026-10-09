export type EnvironmentType = 'Development' | 'Staging' | 'Production';
export type WorkspaceType = 'Enterprise Data Integration' | 'Analytical Mesh Core' | 'Governance & Compliance Hub';

export type NodeType = 'source' | 'transform' | 'guardrail' | 'sink' | 'control';

export interface DAGNode {
  id: string;
  name: string;
  category: NodeType;
  typeLabel: string;
  description: string;
  position: { x: number; y: number };
  status: 'idle' | 'running' | 'completed' | 'warning' | 'error';
  inputs: string[];
  outputs: string[];
  config: NodeConfig;
}

export interface NodeConfig {
  cpuAllocation: string;
  memoryAllocation: string;
  containerRuntime: {
    engine: string;
    image: string;
    isolation: string;
    rootless: boolean;
    readOnlyRootFilesystem: boolean;
  };
  secretsManagement: {
    provider: string;
    keyStore: string;
    rotationPolicy: string;
    injectionMechanism: string;
    inMemoryWipe: boolean;
  };
  encryption: {
    transit: string;
    rest: string;
    algorithm: string;
    kmsKeyPlaceholder: string;
  };
  networkControls: {
    subnetType: string;
    publicIpEnabled: boolean;
    egressRules: string;
    meshProtocol: string;
  };
  aiGuardrails: {
    promptSanitization: boolean;
    piiAnonymization: boolean;
    hallucinationCheck: boolean;
    outputSchemaValidation: boolean;
    maxTokenBudget: number;
  };
  securityScanning: {
    sbomValidation: boolean;
    sastTaintAnalysis: boolean;
    containerSignatureVerified: boolean;
    vulnerabilityThreshold: string;
  };
  retryPolicy: {
    maxAttempts: number;
    backoffStrategy: string;
    initialIntervalSeconds: number;
    maxIntervalSeconds: number;
    multiplier: number;
  };
  failureHandling: {
    deadLetterQueue: string;
    circuitBreakerThresholdPercent: number;
    fallbackAction: string;
    auditNotification: boolean;
  };
  schemaContract?: {
    inputSchema: Array<{ field: string; type: string; classification: string }>;
    outputSchema: Array<{ field: string; type: string; classification: string }>;
  };
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  dataFlowRate?: string;
}

export interface CopilotAnalysisResult {
  prompt: string;
  semanticAnalysis: {
    summary: string;
    identifiedSources: string[];
    transformationRequirements: string[];
    targetDestinations: string[];
    partitioningPattern: string;
  };
  securityValidation: {
    status: 'passed' | 'warning';
    rulesChecked: Array<{ rule: string; status: 'compliant' | 'warning'; detail: string }>;
    classificationSummary: { sensitiveFieldsFound: number; tokenizationStrategy: string };
  };
  dataQualityChecks: {
    checks: Array<{ name: string; assertion: string; threshold: string; actionOnFailure: string }>;
  };
  proposedNodes: DAGNode[];
  proposedEdges: DAGEdge[];
  resourceEstimate: {
    totalEstimatedVCPU: number;
    totalEstimatedRAM: string;
    concurrencyClass: string;
  };
}

export interface ReadinessPillar {
  id: string;
  name: string;
  iconName: string;
  currentMaturity: number; // 1-5
  targetMaturity: number; // 1-5
  status: 'Ready' | 'In Progress' | 'Attention Required';
  readinessScore: number; // 0-100%
  description: string;
  subCapabilities: Array<{
    name: string;
    currentLevel: number;
    targetLevel: number;
    gapAnalysis: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
  keyRemediationActions: Array<{
    action: string;
    timeline: string;
    owner: string;
    impact: string;
  }>;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  focus: string;
  deliverables: string[];
  workstreams: {
    architecture: string;
    security: string;
    platform: string;
    governance: string;
  };
  milestone?: string;
}

export interface RoadmapPhase {
  phase: number;
  name: string;
  timeframe: string;
  objective: string;
  weeks: RoadmapWeek[];
  exitCriteria: string[];
}
