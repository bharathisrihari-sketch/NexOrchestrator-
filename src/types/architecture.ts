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

export interface AutoScalingConfig {
  enabled: boolean;
  minCpu: string;
  maxCpu: string;
  minMemory: string;
  maxMemory: string;
  targetMetric: 'Throughput (rec/s)' | 'CPU Utilization (%)' | 'Memory Pressure (%)';
  targetValue: number;
  scaleUpThresholdPercent: number;
  scaleDownThresholdPercent: number;
  currentScaledCpu?: string;
  currentScaledMemory?: string;
  scalingState?: 'Nominal' | 'Scaling Up' | 'Scaling Down' | 'Peak Allocated';
  lastScalingEvent?: string;
}

export interface NodeConfig {
  cpuAllocation: string;
  memoryAllocation: string;
  autoScaling?: AutoScalingConfig;
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
  connectorType?: 'kafka' | 'snowflake' | 's3' | 'salesforce' | 'rest' | 'grpc' | 'gemini' | 'postgres' | 'databricks' | 'generic';
  connectorProtocol?: string;
  connectorStatus?: 'connected' | 'syncing' | 'streaming' | 'idle' | 'error';
  connectorName?: string;
}

export interface WorkflowExecutionStepResult {
  nodeId: string;
  nodeName: string;
  category: NodeType;
  status: 'completed' | 'running' | 'failed' | 'skipped';
  durationMs: number;
  recordsIn: number;
  recordsOut: number;
  throughput: string;
  statusMessage: string;
}

export interface ConnectorExecutionResult {
  edgeId: string;
  connectorName: string;
  connectorType: string;
  sourceNodeName: string;
  targetNodeName: string;
  protocol: string;
  status: 'handshake_verified' | 'streaming' | 'connected' | 'idle' | 'failed';
  latencyMs: number;
  bytesTransferred: string;
  securityCipher: string;
}

export interface WorkflowExecutionResult {
  runId: string;
  workflowId: string;
  workflowName: string;
  timestamp: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
  durationSeconds: number;
  recordsProcessed: number;
  throughput: string;
  errorRate: string;
  totalBytes: string;
  costEstimate: string;
  complianceStatus: string;
  stepResults: WorkflowExecutionStepResult[];
  connectorResults: ConnectorExecutionResult[];
  outputPayloadSample: Record<string, any>[];
  auditLogs: Array<{
    timestamp: string;
    level: 'INFO' | 'SUCCESS' | 'WARN' | 'AUDIT' | 'ERROR' | 'METRIC' | 'SECURITY';
    component: string;
    message: string;
  }>;
}

export interface WorkflowCatalogItem {
  id: string;
  name: string;
  description: string;
  category: 'Integration' | 'Fraud & Risk' | 'Lakehouse' | 'Healthcare / HIPAA' | 'GenAI' | 'FinTech';
  environment: EnvironmentType;
  nodes: DAGNode[];
  edges: DAGEdge[];
  defaultResults?: WorkflowExecutionResult;
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

export type AuditLogSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AuditCategory = 
  | 'Security Enforcement'
  | 'Access & IAM'
  | 'Compliance & Policy'
  | 'Data Leakage Prevention'
  | 'Encryption & KMS'
  | 'Network Egress'
  | 'Container Sandbox';

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  ruleCode: string;
  category: AuditCategory;
  severity: AuditLogSeverity;
  nodeId: string;
  nodeName: string;
  summary: string;
  policyStandard: string;
  automatedAction: string;
  status: 'Remediated' | 'Blocked' | 'Quarantined' | 'Logged';
  principalRole: string;
  cryptographicHash: string;
  details: {
    resourceTarget: string;
    triggerMetricOrPayload: string;
    mitigationLatencyMs: number;
    auditChainBlockIndex: number;
  };
}
