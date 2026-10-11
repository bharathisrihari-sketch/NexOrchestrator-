import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Lock, 
  Key, 
  Server, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Radio, 
  Cpu, 
  FileCheck2, 
  ExternalLink,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AuditLogEvent, AuditLogSeverity, AuditCategory } from '../../types/architecture';

const INITIAL_AUDIT_LOGS: AuditLogEvent[] = [
  {
    id: 'EVT-88421',
    timestamp: '2026-10-09 15:42:18 UTC',
    ruleCode: 'SEC-PII-MASK-01',
    category: 'Data Leakage Prevention',
    severity: 'critical',
    nodeId: 'node-3',
    nodeName: 'Privacy Masking & Tokenization',
    summary: 'Direct plaintext identifier detected in ingestion pipeline stream',
    policyStandard: 'NIST 800-53 SC-13 / HIPAA §164.312',
    automatedAction: 'FF3-1 format-preserving tokenization enforced; plaintext wiped from RAM buffer',
    status: 'Remediated',
    principalRole: 'Ingestion Service Mesh Execution Role',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: {
      resourceTarget: 'Source Dataset A -> Privacy Enclave [node-3]',
      triggerMetricOrPayload: 'Unmasked field [account_identifier] matched entropy threshold 4.82',
      mitigationLatencyMs: 9,
      auditChainBlockIndex: 48921
    }
  },
  {
    id: 'EVT-88420',
    timestamp: '2026-10-09 15:41:55 UTC',
    ruleCode: 'NET-EGRESS-04',
    category: 'Network Egress',
    severity: 'high',
    nodeId: 'node-4',
    nodeName: 'Reference Joiner & Enrichment',
    summary: 'Container attempted outbound egress outside private VPC subnet boundary',
    policyStandard: 'Zero-Trust Network Architecture / PCI-DSS Req 1.3',
    automatedAction: 'eBPF Envoy firewall dropped SYN packet; alert dispatched to security SIEM',
    status: 'Blocked',
    principalRole: 'Compute Worker Role [node-4]',
    cryptographicHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    details: {
      resourceTarget: 'VPC-Subnet-Private-Isolated -> 198.51.100.24:443',
      triggerMetricOrPayload: 'Egress destination non-whitelisted in SecurityGroup-Restricted',
      mitigationLatencyMs: 4,
      auditChainBlockIndex: 48920
    }
  },
  {
    id: 'EVT-88419',
    timestamp: '2026-10-09 15:40:12 UTC',
    ruleCode: 'KMS-ENV-ROT-02',
    category: 'Encryption & KMS',
    severity: 'medium',
    nodeId: 'node-6',
    nodeName: 'Curated Analytics Repository',
    summary: 'Envelope encryption key aged beyond scheduled 90-day rotation milestone',
    policyStandard: 'SOC 2 Type II CC6.1 / ISO 27001 A.10.1',
    automatedAction: 'Master KMS Key rotated asynchronously; target tables re-wrapped with DEK-v2',
    status: 'Remediated',
    principalRole: 'KMS Cryptographic Administrator Role',
    cryptographicHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    details: {
      resourceTarget: 'Enterprise Analytics Repository [Object Storage & KMS Master Key]',
      triggerMetricOrPayload: 'KeyVersion-01 age = 91 days; automated rotation policy triggered',
      mitigationLatencyMs: 14,
      auditChainBlockIndex: 48919
    }
  },
  {
    id: 'EVT-88418',
    timestamp: '2026-10-09 15:38:44 UTC',
    ruleCode: 'IAM-LEAST-PRIV-01',
    category: 'Access & IAM',
    severity: 'medium',
    nodeId: 'node-2',
    nodeName: 'Source Dataset B (Semi-Structured)',
    summary: 'Batch connector requested wildcard metadata access permission (MetadataStore:*)',
    policyStandard: 'CMMI Level 4 / Least-Privilege IAM Standard',
    automatedAction: 'Wildcard scope stripped; bounded scoped policy (MetadataStore:GetSchema) substituted',
    status: 'Remediated',
    principalRole: 'Metadata Harvesting Token',
    cryptographicHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    details: {
      resourceTarget: 'Metadata Store Service API /catalog/schemas',
      triggerMetricOrPayload: 'IAM token evaluation intercepted by Envoy OPA sidecar',
      mitigationLatencyMs: 8,
      auditChainBlockIndex: 48918
    }
  },
  {
    id: 'EVT-88417',
    timestamp: '2026-10-09 15:35:29 UTC',
    ruleCode: 'CONT-SANDBOX-03',
    category: 'Container Sandbox',
    severity: 'high',
    nodeId: 'node-5',
    nodeName: 'Business Metrics Aggregator',
    summary: 'Attempted write operation targeting root filesystem in read-only OCI container',
    policyStandard: 'CIS Benchmark for Docker & OCI Runtime §5.12',
    automatedAction: 'Kernel VFS access denied; process redirected to ephemeral encrypted tmpfs',
    status: 'Blocked',
    principalRole: 'OCI Rootless Worker UID 10001',
    cryptographicHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    details: {
      resourceTarget: '/usr/local/bin (read_only_rootfs = true)',
      triggerMetricOrPayload: 'Syscall openat(O_WRONLY) intercepted by seccomp-bpf profile',
      mitigationLatencyMs: 2,
      auditChainBlockIndex: 48917
    }
  },
  {
    id: 'EVT-88416',
    timestamp: '2026-10-09 15:30:04 UTC',
    ruleCode: 'SEC-SBOM-VERIFY-01',
    category: 'Security Enforcement',
    severity: 'info',
    nodeId: 'node-1',
    nodeName: 'Source Dataset A (Relational CDC)',
    summary: 'Software Bill of Materials (SBOM) and container cryptographic signature verified',
    policyStandard: 'SLSA Level 3 Supply Chain Security',
    automatedAction: 'Cosign container signature verified against Enterprise Trust Root; deployment cleared',
    status: 'Logged',
    principalRole: 'CI/CD Pipeline Attestation Engine',
    cryptographicHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    details: {
      resourceTarget: 'Ingestion Worker Container Image sha256:7f83b165...',
      triggerMetricOrPayload: 'Zero Critical & Zero High CVEs confirmed via static vulnerability scan',
      mitigationLatencyMs: 28,
      auditChainBlockIndex: 48916
    }
  },
  {
    id: 'EVT-88415',
    timestamp: '2026-10-09 15:24:19 UTC',
    ruleCode: 'DLQ-QUARANTINE-01',
    category: 'Compliance & Policy',
    severity: 'medium',
    nodeId: 'node-4',
    nodeName: 'Reference Joiner & Enrichment',
    summary: 'Schema mismatch detected: 14 records quarantined to Dead Letter Queue (DLQ)',
    policyStandard: 'Enterprise Data Governance Contract §4.2',
    automatedAction: 'Mismatched records rerouted to Workflow State Store /dlq; pipeline execution uninterrupted',
    status: 'Quarantined',
    principalRole: 'Schema Validation Guardrail',
    cryptographicHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    details: {
      resourceTarget: 'Workflow State Store /dlq/corrupt-schemas',
      triggerMetricOrPayload: 'Field [reference_geo_key] expected Integer, received String "UNKNOWN"',
      mitigationLatencyMs: 11,
      auditChainBlockIndex: 48915
    }
  }
];

export const GovernanceAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEvent[]>(INITIAL_AUDIT_LOGS);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<'logs' | 'test-coverage'>('logs');
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  // Filtered logs calculation
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
      const matchCategory = selectedCategory === 'all' || log.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ruleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.nodeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.policyStandard.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.automatedAction.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchSeverity && matchCategory && matchSearch;
    });
  }, [logs, selectedSeverity, selectedCategory, searchQuery]);

  // Aggregate telemetry
  const criticalCount = logs.filter(l => l.severity === 'critical').length;
  const highCount = logs.filter(l => l.severity === 'high').length;
  const remediatedCount = logs.filter(l => l.status === 'Remediated' || l.status === 'Blocked').length;

  const handleSimulateIncident = (incidentType: 'pii' | 'egress' | 'kms') => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    let newEvent: AuditLogEvent;

    if (incidentType === 'pii') {
      newEvent = {
        id: `EVT-${Math.floor(88422 + Math.random() * 900)}`,
        timestamp,
        ruleCode: 'SEC-PII-DYNAMIC-09',
        category: 'Data Leakage Prevention',
        severity: 'critical',
        nodeId: 'node-3',
        nodeName: 'Privacy Masking & Tokenization',
        summary: 'Synthetic unmasked SSN/National ID test vector injected by auditor',
        policyStandard: 'NIST 800-53 SC-13 / Zero Plain-Text Invariant',
        automatedAction: 'Real-time AES-256 tokenization applied in <8ms; zero unmasked data persisted',
        status: 'Remediated',
        principalRole: 'Interactive Test Suite Role',
        cryptographicHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
        details: {
          resourceTarget: 'Privacy Masking Enclave [node-3]',
          triggerMetricOrPayload: 'Regex pattern ^\\d{3}-\\d{2}-\\d{4}$ intercepted in stream',
          mitigationLatencyMs: 7,
          auditChainBlockIndex: 48922 + logs.length
        }
      };
      setSimulationToast('Automated Mitigation Active: Unmasked PII Tokenized & Quarantined in 7ms');
    } else if (incidentType === 'egress') {
      newEvent = {
        id: `EVT-${Math.floor(88422 + Math.random() * 900)}`,
        timestamp,
        ruleCode: 'NET-EGRESS-BLOCK-02',
        category: 'Network Egress',
        severity: 'high',
        nodeId: 'node-5',
        nodeName: 'Business Metrics Aggregator',
        summary: 'Non-whitelisted outbound API call intercepted at service mesh boundary',
        policyStandard: 'CIS Benchmark §3.4 / Restricted Subnet Policy',
        automatedAction: 'Envoy sidecar dropped TCP handshake; zero data exited VPC boundary',
        status: 'Blocked',
        principalRole: 'Aggregator Worker Task',
        cryptographicHash: 'b2c3d4e5f6a10718293a4b5c6d7e8f90123456789abcdef0123456789abcdef1',
        details: {
          resourceTarget: '198.51.100.199:8080 (External Non-Compliant Host)',
          triggerMetricOrPayload: 'Egress destination failed mutual TLS handshake',
          mitigationLatencyMs: 3,
          auditChainBlockIndex: 48922 + logs.length
        }
      };
      setSimulationToast('Automated Mitigation Active: Illegal Network Egress Blocked at VPC Gateway');
    } else {
      newEvent = {
        id: `EVT-${Math.floor(88422 + Math.random() * 900)}`,
        timestamp,
        ruleCode: 'KMS-TAMPER-DETECT-01',
        category: 'Encryption & KMS',
        severity: 'high',
        nodeId: 'node-6',
        nodeName: 'Curated Analytics Repository',
        summary: 'Stale envelope encryption session key used in bulk write operation',
        policyStandard: 'SOC 2 CC6.1 Cryptographic Integrity',
        automatedAction: 'Write held in buffer; fresh Data Encryption Key (DEK) negotiated with KMS',
        status: 'Remediated',
        principalRole: 'Analytics Persistence Executor',
        cryptographicHash: 'c3d4e5f6a1b20718293a4b5c6d7e8f90123456789abcdef0123456789abcdef2',
        details: {
          resourceTarget: 'Analytics Repository KMS Key Ring',
          triggerMetricOrPayload: 'Expired DEK nonce detected; zero plaintext exposed',
          mitigationLatencyMs: 12,
          auditChainBlockIndex: 48922 + logs.length
        }
      };
      setSimulationToast('Automated Mitigation Active: KMS Envelope Re-Keyed; Integrity Preserved');
    }

    setLogs(prev => [newEvent, ...prev]);
    setSelectedLogId(newEvent.id);
    setTimeout(() => setSimulationToast(null), 4000);
  };

  const selectedLog = logs.find(l => l.id === selectedLogId) || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Toast Alert Banner for Live Mitigation */}
      {simulationToast && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-b border-emerald-500/50 px-4 py-2 flex items-center justify-between text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold font-mono">{simulationToast}</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Immutable Hash Chain Updated · Latency &lt; 10ms</span>
        </div>
      )}

      {/* TOP COLLAPSIBLE HEADER */}
      {isHeaderVisible && (
        <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  Section 7 · Governance & Automated Security Audit
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                  Tamper-Evident SHA-256 Ledger Active
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white mt-1">
                Governance Audit Logs & Automated Compliance Monitor
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect simulated, filterable table of automated security events, access logs, and compliance policy violations detected during pipeline execution.
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Navigation View Pills */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setActiveSection('logs')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeSection === 'logs'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Audit Stream ({logs.length})
                </button>
                <button
                  onClick={() => setActiveSection('test-coverage')}
                  className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                    activeSection === 'test-coverage'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Test Coverage (5/5 Passed)
                </button>
              </div>

              {/* Hide Header Button */}
              <button
                onClick={() => setIsHeaderVisible(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                title="Collapse this header to maximize log view"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hide Header</span>
              </button>
            </div>
          </div>

          {/* TELEMETRY KPI METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono">Total Recorded Events</span>
              <span className="text-base font-bold text-white font-mono">{logs.length} Audit Entries</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Immutable append-only ledger</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono">Security Violations Blocked</span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {criticalCount + highCount} Detected & Defended
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">0 Plaintext leaks persisted</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono">Automated Remediation</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {remediatedCount} Auto-Remediated
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">100% Policy SLA met (&lt; 15ms)</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-mono">Compliance Attestation</span>
              <span className="text-base font-bold text-cyan-400 font-mono">SOC 2 / HIPAA Passed</span>
              <span className="text-[9px] text-cyan-300 block mt-0.5">Zero critical open findings</span>
            </div>
          </div>
        </header>
      )}

      {/* Floating Reveal Button when Header is Hidden */}
      {!isHeaderVisible && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Governance Audit Stream Active · {filteredLogs.length} events visible</span>
          </div>
          <button
            onClick={() => setIsHeaderVisible(true)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>Show Header</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {activeSection === 'logs' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT: TABLE & CONTROLS */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800">
            {/* Filter and Simulation Toolbar */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search rule code, summary, node, policy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                {/* Severity Dropdown */}
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                  <option value="info">Info Only</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="all">All Categories</option>
                  <option value="Data Leakage Prevention">Data Leakage Prevention</option>
                  <option value="Network Egress">Network Egress</option>
                  <option value="Encryption & KMS">Encryption & KMS</option>
                  <option value="Access & IAM">Access & IAM</option>
                  <option value="Container Sandbox">Container Sandbox</option>
                  <option value="Security Enforcement">Security Enforcement</option>
                  <option value="Compliance & Policy">Compliance & Policy</option>
                </select>
              </div>

              {/* Simulation Quick Triggers */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">Simulate:</span>
                <button
                  onClick={() => handleSimulateIncident('pii')}
                  className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition-colors"
                  title="Inject test PII and verify real-time cryptographic masking"
                >
                  + PII Probe
                </button>
                <button
                  onClick={() => handleSimulateIncident('egress')}
                  className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-mono transition-colors"
                  title="Attempt outbound non-whitelisted egress and verify automated Envoy drop"
                >
                  + Egress Block
                </button>
                <button
                  onClick={() => handleSimulateIncident('kms')}
                  className="px-2 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono transition-colors"
                  title="Simulate KMS envelope key re-negotiation"
                >
                  + KMS Rotate
                </button>
              </div>
            </div>

            {/* AUDIT LOG TABLE */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-mono sticky top-0 border-b border-slate-800 z-10 backdrop-blur">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Severity</th>
                    <th className="py-2.5 px-3 font-semibold">Event ID & Code</th>
                    <th className="py-2.5 px-3 font-semibold">Pipeline Node</th>
                    <th className="py-2.5 px-3 font-semibold">Event Summary</th>
                    <th className="py-2.5 px-3 font-semibold">Policy Standard</th>
                    <th className="py-2.5 px-3 font-semibold">Automated Action</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredLogs.map(log => {
                    const isSelected = selectedLogId === log.id;
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLogId(log.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400' 
                            : 'hover:bg-slate-900/50'
                        }`}
                      >
                        {/* Severity */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {log.severity === 'critical' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Critical
                            </span>
                          )}
                          {log.severity === 'high' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              High
                            </span>
                          )}
                          {log.severity === 'medium' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium bg-blue-500/20 text-blue-300 border border-blue-500/40">
                              Medium
                            </span>
                          )}
                          {log.severity === 'info' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              Info
                            </span>
                          )}
                        </td>

                        {/* ID & Code */}
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                          <div className="font-semibold text-white">{log.id}</div>
                          <div className="text-[10px] text-cyan-400">{log.ruleCode}</div>
                        </td>

                        {/* Node */}
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-300">
                          <div className="font-medium text-slate-200">{log.nodeName}</div>
                          <div className="text-[10px] text-slate-400">{log.nodeId}</div>
                        </td>

                        {/* Summary */}
                        <td className="py-2.5 px-3 max-w-xs text-slate-300">
                          <p className="line-clamp-2 text-xs">{log.summary}</p>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {log.timestamp}
                          </span>
                        </td>

                        {/* Policy Standard */}
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                          {log.policyStandard}
                        </td>

                        {/* Automated Action */}
                        <td className="py-2.5 px-3 text-slate-300 text-xs">
                          <p className="line-clamp-2 text-[11px] font-mono text-emerald-300">
                            {log.automatedAction}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {log.status === 'Remediated' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Remediated
                            </span>
                          )}
                          {log.status === 'Blocked' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1 w-fit">
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                              Blocked
                            </span>
                          )}
                          {log.status === 'Quarantined' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/70 text-purple-300 border border-purple-800/60 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-purple-400" />
                              Quarantined
                            </span>
                          )}
                          {log.status === 'Logged' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1 w-fit">
                              <FileCheck2 className="w-3 h-3 text-slate-400" />
                              Logged
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredLogs.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <p>No audit events match current search and severity filters.</p>
                  <button
                    onClick={() => { setSelectedSeverity('all'); setSelectedCategory('all'); setSearchQuery(''); }}
                    className="mt-2 text-cyan-400 hover:underline font-mono"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SELECTED LOG DETAIL DRAWER */}
          <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 bg-slate-950/95 p-4 flex flex-col overflow-y-auto shrink-0 select-text">
            {selectedLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      Audit Chain Block #{selectedLog.details.auditChainBlockIndex}
                    </span>
                    <h3 className="text-sm font-bold text-white font-mono">{selectedLog.id}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {selectedLog.status}
                  </span>
                </div>

                {/* Event Summary */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Incident Summary</label>
                  <p className="text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    {selectedLog.summary}
                  </p>
                </div>

                {/* Automated Mitigation Details */}
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-400 font-mono uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Automated Defense Action
                  </label>
                  <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded border border-emerald-800/40 font-mono">
                    {selectedLog.automatedAction}
                    <div className="mt-1 text-[10px] text-slate-400">
                      Mitigation Latency: <span className="text-emerald-400 font-bold">{selectedLog.details.mitigationLatencyMs}ms</span>
                    </div>
                  </div>
                </div>

                {/* Policy Standard */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">Standard</span>
                    <span className="text-[11px] font-mono text-cyan-300 block mt-0.5 truncate">{selectedLog.policyStandard}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">Rule Code</span>
                    <span className="text-[11px] font-mono text-purple-300 block mt-0.5 truncate">{selectedLog.ruleCode}</span>
                  </div>
                </div>

                {/* Target & Principal */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block">Resource Target</span>
                    <span className="text-[11px] text-slate-200 block mt-0.5">{selectedLog.details.resourceTarget}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block">Principal Execution Role</span>
                    <span className="text-[11px] text-slate-200 block mt-0.5">{selectedLog.principalRole}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase block">Trigger Condition</span>
                    <span className="text-[11px] text-amber-300 block mt-0.5">{selectedLog.details.triggerMetricOrPayload}</span>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Chain Hash */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    Cryptographic Block Signature
                  </label>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[9px] font-mono text-slate-400 break-all select-all">
                    {selectedLog.cryptographicHash}
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-mono text-slate-400 text-center">
                  Immutable record signed by Enterprise KMS Trust Anchor
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <FileCheck2 className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-300">Select an Audit Entry</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click any security event row to view forensic payload, policy bindings, and cryptographic signature verification.
                </p>
              </div>
            )}
          </aside>
        </div>
      ) : (
        /* TEST COVERAGE SECTION */
        <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Audit & Governance Live Test Suite
            </span>
            <h2 className="text-xl font-bold text-white">
              Automated Policy Enforcement & Invariant Test Results
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic verification suite covering tamper-evident ledger integrity, PII tokenization latency, eBPF network egress containment, and least-privilege IAM controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TC-AUD-01 · Immutable Ledger Verification</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">100% PASSED</span>
              </div>
              <p className="text-xs text-slate-300">
                Asserts that every published audit event contains a continuous SHA-256 Merkle root hash linking back to genesis block #48900 with zero broken pointers.
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                ASSERT: Evaluated 142 chain blocks · Hash integrity 100% verified · Nonce collision rate: 0.00%
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TC-AUD-02 · Automated Remediation Latency</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">8.4ms (Target &lt; 15ms)</span>
              </div>
              <p className="text-xs text-slate-300">
                Measures mean time from violation detection at worker node boundary to automated policy enforcement action (Envoy drop / tokenization / DLQ routing).
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                ASSERT: P99 latency: 12.8ms · P50 latency: 6.2ms · Zero human intervention required
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TC-AUD-03 · Zero Plaintext Leakage Invariant</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">ZERO LEAKS</span>
              </div>
              <p className="text-xs text-slate-300">
                Injects high-entropy PII test payloads (national identifiers, IP addresses) into pipeline streams and verifies 100% conversion to FF3-1 tokens prior to sink delivery.
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                ASSERT: 50,000 synthetic records inspected · Sink verification clean · RAM buffer wiped
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TC-AUD-04 · Network Boundary Containment</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">100% CONTAINED</span>
              </div>
              <p className="text-xs text-slate-300">
                Executes synthetic outbound TCP handshakes targeting non-whitelisted external CIDR blocks to verify eBPF Envoy packet dropping without pipeline stall.
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                ASSERT: 24 outbound unauthorized connection attempts blocked · 0 bytes egressed beyond VPC
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">TC-AUD-05 · Regulatory Compliance Mapping (SOC 2 / HIPAA)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">COMPLIANT</span>
              </div>
              <p className="text-xs text-slate-300">
                Verifies full telemetry trace alignment against SOC 2 CC6.1 (Logical Access), HIPAA §164.312 (Transmission Security), and NIST 800-53 (Identification and Authentication).
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded border border-slate-800">
                STATUS: All 18 compliance controls attested · Audit evidence exportable as JSON / Markdown
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
