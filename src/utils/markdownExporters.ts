import { 
  ASCII_UI_WIREFRAME, 
  ASCII_REFERENCE_ARCHITECTURE, 
  ASCII_PROPOSED_WORKFLOW_GRAPH,
  READINESS_PILLARS,
  ROADMAP_PHASES,
  CANONICAL_COPILOT_PROMPT,
  SAMPLE_COPILOT_ANALYSIS
} from '../data/blueprintData';
import { DAGNode } from '../types/architecture';

export function exportTabMarkdown(tabId: string, nodes?: DAGNode[]): string {
  const dateStr = new Date().toISOString().split('T')[0];

  switch (tabId) {
    case 'canvas':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 1 – High-Level UI Layout & Canvas Wireframe
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Executive UI Layout Specification (ASCII Wireframe)
\`\`\`text
${ASCII_UI_WIREFRAME}
\`\`\`

### Wireframe Region Legend
1. **Global Navigation Header**: Wordmark branding, active view switchers, executive presentation link, and export controls.
2. **Environment Selector**: Multi-AZ runtime isolation (Production, Pre-Prod Staging, Sandbox Development).
3. **Workspace Selector**: Multi-tenant boundaries (Enterprise Data Integration, Analytical Mesh Core, Governance Hub).
4. **Left Toolbox Panel**: Palettes for Sources, Transformers, AI Guardrails, and Target Sinks.
5. **AI Copilot Panel**: Natural-language prompt interface with deterministic DAG synthesis.
6. **Central Visual Workflow Canvas (DAG Editor)**: Interactive graph workspace with bezier connectors and elastic node status.
7. **Right Node Inspector & Lineage Panel**: Rootless container specs, KMS envelope encryption, auto-scaling bounds, and schema contracts.
8. **Bottom Execution & Monitoring Console**: Real-time throughput (rec/s), run duration, assertion telemetry, and audit logs.

### Architectural Assumptions & Open Questions
- **Assumption 1**: Front-end state management maintains deterministic graph topologies with zero server round-trips during interactive layout adjustments.
- **Assumption 2**: Canvas connectors represent streaming partitioned log buffers or micro-batch boundary channels.
`;

    case 'copilot':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 2 – Interactive AI Workflow Copilot
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Natural-Language Input Specification
\`\`\`text
${CANONICAL_COPILOT_PROMPT}
\`\`\`

### Stage A: Semantic AI Analysis
- **Identified Sources**: Source Dataset A (Structured RDBMS CDC), Source Dataset B (Semi-Structured JSON/Parquet).
- **Transformation Steps**: Automated PII detection, reference table join, hourly sliding window metric rollup.
- **Target Sink**: Curated Analytics Repository (Enterprise Data Warehouse).
- **Partitioning Scheme**: Date-Hour partition key + Composite Entity Hash.

### Stage B: Automated Security Validation
- **Zero-Trust Workload Identity**: Enforced via ephemeral Execution Role STS credentials.
- **Format-Preserving Encryption**: Dedicated hardware enclave microVM (FPE FF3-1).
- **Subnet Isolation**: Air-gapped private subnet; zero internet egress.
- **Runtime Sandboxing**: Rootless OCI container with gVisor kernel isolation.

### Stage C: Data Quality Assertion Gates
1. **Primary Key Completeness**: \`record_id IS NOT NULL AND LENGTH(record_id) > 0\` -> 100% Conformance.
2. **Schema Drift Gate**: Unmapped payload fields <= 0 -> Strict contract enforcement.
3. **Metric Range Fencing**: \`transaction_amt >= 0.00 AND transaction_amt <= 100,000,000.00\` -> 99.99% Conformance.
4. **Dimension Reference Hit Rate**: Join hit rate >= 98.5% against Metadata Store master catalog.

### Stage D: Proposed Workflow Graph (ASCII DAG)
\`\`\`text
${ASCII_PROPOSED_WORKFLOW_GRAPH}
\`\`\`

### Architectural Assumptions & Open Questions
- **Open Question**: AI model inference uses enterprise private VPC endpoints with zero payload retention and prompt sanitization.
`;

    case 'inspector':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 3 – Node Configuration & Secure Execution Inspector
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Secure Execution & Container Specification
- **Container Runtime**: OCI-compliant rootless container, gVisor Runsc kernel sandbox, immutable read-only rootfs.
- **Elastic Auto-Scaling**: Dynamic CPU (1.0 to 16.0 vCPU) and RAM (2.0 to 64.0 GiB) scaling triggered by real-time throughput metrics.
- **Secret Management**: Envelope KMS encryption with customer-managed keys (CMEK); in-memory RAMFS volume injection; zero plaintext storage.
- **Network Controls**: Air-gapped private VPC subnet without public IP allocation; mTLS Envoy service mesh.
- **AI Guardrails**: Prompt injection sanitization, automated PII tokenization gate, and output schema validation.
- **Security Scanning**: Automated SPDX 2.3 SBOM generation, SAST taint analysis, container signature verification, zero-critical CVE policy.
- **Fault Tolerance**: Exponential backoff with jitter (max 3-5 retries); dead-letter queue isolation in Workflow State Store; circuit breaker trip at 10-15% error rate.

### Active Node Profiles
${(nodes || []).map(n => `
#### ${n.name} (${n.typeLabel})
- **Base Allocation**: ${n.config.cpuAllocation} / ${n.config.memoryAllocation}
- **Auto-Scaling**: ${n.config.autoScaling?.enabled ? `Enabled (Bounds: ${n.config.autoScaling.minCpu}–${n.config.autoScaling.maxCpu}, ${n.config.autoScaling.minMemory}–${n.config.autoScaling.maxMemory})` : 'Disabled (Static)'}
- **KMS Key**: ${n.config.encryption.kmsKeyPlaceholder}
- **Isolation**: ${n.config.containerRuntime.isolation}
- **DLQ**: ${n.config.failureHandling.deadLetterQueue}
`).join('\n')}
`;

    case 'readiness':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 4 – Enterprise Readiness Assessment Dashboard
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Six Pillars of Enterprise Architecture (Illustrative Scores)
${READINESS_PILLARS.map(p => `
### ${p.name}
- **Status**: ${p.status} | **Score**: ${p.readinessScore}%
- **Current Maturity**: Level ${p.currentMaturity} / 5 | **Target Maturity**: Level ${p.targetMaturity} / 5
- **Overview**: ${p.description}
- **Key Remediation Actions**:
${p.keyRemediationActions.map(a => `  - **Action**: ${a.action} (Timeline: ${a.timeline}, Lead: ${a.owner})`).join('\n')}
`).join('\n')}

### Architectural Assumptions & Open Questions
- **Note**: All maturity scores are illustrative benchmarks calibrated against CMMI Level 4/5 enterprise operational criteria.
`;

    case 'reference':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 5 – End-to-End Cloud Reference Architecture
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Architectural Sequence Flow
Users → WAF → Load Balancer → Frontend Application → AI Copilot Service → Workflow Engine → Message Queue → Worker Pool → Metadata Store → Workflow State Store → Object Storage → Secrets Management → Enterprise AI Services

### Detailed Reference Architecture Diagram (ASCII)
\`\`\`text
${ASCII_REFERENCE_ARCHITECTURE}
\`\`\`

### Component Description Table
| # | Component | Architectural Role | Resilience & Security Specification |
|---|---|---|---|
| 1 | Users | Enterprise Engineers & Analysts | TLS 1.3 zero-trust VPN tunnel |
| 2 | WAF | Web Application Firewall | L7 DDoS protection & OWASP Top 10 mitigation |
| 3 | Load Balancer | Multi-AZ Application Ingress | Cross-zone failover, health probing, SSL offload |
| 4 | Frontend Application | Stateless React SPA Pods | Micro-frontend architecture with ephemeral sessions |
| 5 | AI Copilot Service | Natural-Language Pipeline Compiler | Deterministic prompt grammar & AST validator |
| 6 | Workflow Engine | Distributed DAG Scheduler | Topological sorting & state machine dispatcher |
| 7 | Message Queue | Partitioned Event Bus | Reactive backpressure & consumer group buffering |
| 8 | Worker Pool | Container Execution Runtimes | Rootless OCI pods in gVisor sandbox isolation |
| 9 | Metadata Store | ACID Schema & Catalog RDBMS | Multi-region replica with pipeline version lineage |
| 10| Workflow State Store | Low-Latency Checkpoint KV Store | Sub-millisecond distributed state persistence |
| 11| Object Storage | Cloud Data Lake | Immutable multi-tier storage (Bronze, Silver, Gold) |
| 12| Secrets Management | KMS HSM Master Key Vault | Automated 30-day key rotation & RAMFS injection |
| 13| Enterprise AI Services | Foundation Model Inference | Private endpoint with toxic token filtering |
`;

    case 'roadmap':
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint
## TAB 6 – 90-Day Implementation Roadmap
*Generated on: ${dateStr} | Classification: Vendor-Neutral Enterprise Blueprint*

### Phase Breakdown (Weeks 1 – 13)
${ROADMAP_PHASES.map(phase => `
### Phase ${phase.phase}: ${phase.name} (${phase.timeframe})
**Objective**: ${phase.objective}

**Exit Criteria**:
${phase.exitCriteria.map(c => `- ${c}`).join('\n')}

**Weekly Deliverables**:
${phase.weeks.map(w => `
- **Week ${w.week}: ${w.title}**
  - Focus: ${w.focus}
  - Deliverables: ${w.deliverables.join('; ')}
  - Workstreams: Architecture (${w.workstreams.architecture}), Security (${w.workstreams.security}), Platform (${w.workstreams.platform}), Governance (${w.workstreams.governance})
  ${w.milestone ? `  - Milestone: ${w.milestone}` : ''}
`).join('\n')}
`).join('\n')}
`;

    default:
      return `# NxtGenOrchestrator Enterprise Architecture Blueprint\n*Export generated for tab: ${tabId} on ${dateStr}*`;
  }
}
