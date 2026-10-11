import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Layers, 
  GitBranch, 
  Radio, 
  Database, 
  ShieldCheck, 
  Zap, 
  Server, 
  Workflow, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  FileCode, 
  Lock, 
  HardDrive, 
  ChevronRight, 
  Terminal,
  Activity,
  CheckCircle2,
  Trash2,
  Cpu,
  RefreshCw,
  Share2
} from 'lucide-react';

export const MasterDocumentationView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: 'executive-summary', title: '1. Executive Summary & Architecture Philosophy', icon: BookOpen },
    { id: 'core-features', title: '2. Core Platform Features & Capabilities', icon: Layers },
    { id: 'ingestion-inputs', title: '3. Ingestion Inputs & Protocols Specification', icon: HardDrive },
    { id: 'egress-outputs', title: '4. Egress Targets & Output Data Formats', icon: Database },
    { id: 'enterprise-benefits', title: '5. Enterprise Benefits, ROI & Compliance', icon: TrendingUp },
    { id: 'connector-guide', title: '6. Connector Integration & Linking Guide', icon: GitBranch },
    { id: 'execution-observability', title: '7. Execution Engine & Timestamped Observability', icon: Activity },
    { id: 'deletion-lifecycle', title: '8. Deletion & DAG Lifecycle Operations', icon: Trash2 },
    { id: 'future-improvements', title: '9. Notes & Roadmap for Further Improvements', icon: Zap }
  ];

  const handleCopyMarkdown = () => {
    const docText = `
# NxtGenOrchestrator Enterprise Platform — Master Architecture & Technical Documentation
Classification: Enterprise Architecture Specification
Audience: Architecture Review Board (ARB), Principal Architects, Data Engineering Teams

1. Executive Summary & Architecture Philosophy
NxtGenOrchestrator is a cloud-neutral, zero-trust enterprise ETL and data integration platform designed to ingest high-volume structured, semi-structured, and streaming datasets. It combines a visual DAG canvas, natural-language AI copilot workflow synthesis, hardware-enclave format-preserving tokenization, and multi-tenant isolated worker runtimes.

2. Core Platform Features
- Visual DAG Pipeline Canvas with pan/zoom, minimap, zen full-viewport mode
- Native High-Throughput Connectors (Kafka, Snowflake, S3, Salesforce, gRPC, REST, Gemini AI, PostgreSQL, Databricks)
- Secure Container Sandbox (gVisor runsc kernel sandbox, rootless OCI containers, read-only rootfs)
- Envelope KMS & Format-Preserving Encryption (FF3-1, AES-256-GCM, automated 30-day rotation)
- Multi-Workflow Catalog with instant switching & execution results tracking
- Granular Deletion Controls (Delete selected workflow, delete connector, delete node with cascade cleanup)
- Real-Time Timestamped Execution Logs with millisecond precision

3. Ingestion Inputs & Protocols
- Apache Kafka: Event streams, Avro/Protobuf/JSON Schema, 50,000+ msgs/sec
- Amazon S3 / Cloud Storage: Parquet, ORC, Delta Lake, CSV, chunked multi-part streaming
- Snowflake: CDC streams, micro-batches via Snowpipe REST
- Salesforce: Bulk API 2.0 with OAuth 2.0 PKCE authentication
- REST & Webhooks: HTTPS endpoints with HMAC-SHA256 signature verification
- gRPC: Bidirectional streaming with HTTP/2 and Protobuf v3
- Gemini AI API: Multimodal and semantic enrichment streams with JSON schema grounding

4. Egress Targets & Outputs
- Curated Data Lakehouse (Parquet Snappy, Delta Lake, Apache Iceberg)
- Cloud Data Warehouses (Snowflake, BigQuery, Databricks)
- Real-Time Event Brokers (Kafka Egress, Cloud Pub/Sub)
- Dead Letter Queue (DLQ) with quarantine encryption and telemetry replay hooks

5. Enterprise Benefits
- Zero Data Loss Guarantees via Write-Ahead Log (WAL) and 2PC exactly-once semantics
- 42% Cloud Cost Savings through scale-to-zero compute and intelligent micro-batching
- Turnkey SOC2 Type II, HIPAA, ISO 27001, and GDPR compliance
- Sub-second pipeline execution with hardware-enclave security

6. Connector Integration Guide
- Step 1: Select source and target nodes on the DAG canvas
- Step 2: Choose connector preset protocol (e.g. mTLS 1.3 Strict, gRPC, OAuth2)
- Step 3: Configure credentials via CSI Secrets Driver or Secrets Vault
- Step 4: Validate throughput watermark and click "Integrate Connector & Link Workflow"

7. Execution Observability & Timestamped Logging
- Millisecond-precision audit logs across all dispatcher and node components
- Structured JSON telemetry with OpenTelemetry trace and span IDs

8. Deletion & DAG Lifecycle Operations
- Delete selected connectors directly via the canvas badge, floating toolbar, or Delete/Backspace key
- Delete selected nodes with automated cascade dependency cleanup
- Delete selected workflows with safety confirmation dialogs

9. Notes & Strategic Roadmap for Further Improvements
- Active-Active Multi-Region Distributed Checkpointing
- Custom WebAssembly (WASM) User-Defined Transform Modules
- Automated Self-Healing DAG Topology & Circuit Breaker Re-routing
- AI-Driven Predictive Backpressure & Dynamic Partition Sizing
- Zero-Knowledge Proof (ZKP) Data Provenance Verifiers
- GitOps Declarative YAML & Terraform Provider Synchronization
`;
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('master-doc-content')?.innerText || ''], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'NxtGenOrchestrator-Master-Architecture-Documentation.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Table of Contents Left Rail */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0 overflow-hidden hidden md:flex">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Master Documentation</h2>
              <span className="text-[10px] font-mono text-cyan-400">Architecture & Operations Guide</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search features, inputs, outputs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isCurrent = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  isCurrent
                    ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/50 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </aside>

      {/* Main Documentation Body */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-12 max-w-5xl mx-auto w-full">
        {/* Title Banner */}
        <div className="border-b border-slate-800 pb-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                ARCH-SPEC-V4.2
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                ARB APPROVED &middot; ENTERPRISE PRODUCTION READY
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Copy entire document as markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Download documentation file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export File</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Print documentation"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            NxtGenOrchestrator Enterprise Platform &mdash; Master Technical Documentation
          </h1>
          <p className="text-sm lg:text-base text-slate-400 leading-relaxed max-w-4xl">
            A comprehensive architectural and engineering guide covering core capabilities, pipeline engine topology, 
            ingestion input protocols, target outputs, enterprise benefits, connector integration procedures, timestamped execution telemetry, 
            lifecycle deletion management, and strategic roadmap enhancements.
          </p>
        </div>

        <div id="master-doc-content" className="space-y-16">
          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <section id="executive-summary" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">1. Executive Summary & Architecture Philosophy</h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>NxtGenOrchestrator</strong> is a next-generation, cloud-neutral, zero-trust data integration mesh and visual ETL pipeline platform. 
                Modern enterprises frequently struggle with fragmented data silos, brittle hard-coded glue scripts, lack of cryptographic privacy guarantees, 
                and slow pipeline iteration cycles. NxtGenOrchestrator resolves these challenges by decoupling pipeline topology from physical compute runtimes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Decoupled Compute</span>
                  <p className="text-xs text-slate-400">
                    Pipelines execute inside lightweight, rootless OCI sandboxes (gVisor runsc) with independent auto-scaling thresholds.
                  </p>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Zero-Trust Security</span>
                  <p className="text-xs text-slate-400">
                    Mutual TLS 1.3 strict enforcement on all inter-node links with automated 30-day envelope KMS key rotation.
                  </p>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Continuous Observability</span>
                  <p className="text-xs text-slate-400">
                    Sub-millisecond timestamped execution logging and OpenTelemetry tracing spans emitted at every DAG node boundary.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CORE PLATFORM FEATURES */}
          <section id="core-features" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">2. Core Platform Features & Capabilities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Workflow className="w-4 h-4 text-cyan-400" />
                  <span>Visual Directed Acyclic Graph (DAG) Designer</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive multi-node canvas supporting pan, zoom, drag-and-drop repositioning, mini-map overview, 
                  Zen mode full-screen immersion, and real-time edge flow rendering with customizable throughput indicators.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <GitBranch className="w-4 h-4 text-indigo-400" />
                  <span>High-Throughput Enterprise Connectors</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Out-of-the-box native adapters for Apache Kafka, Snowflake Stage/CDC, AWS S3 / Object Stores, Salesforce Bulk API, 
                  Google Cloud Storage, REST endpoints, high-speed gRPC, PostgreSQL, and Databricks Delta Lake.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Hardware Enclave & Secure Sandboxing</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fine-grained isolation utilizing gVisor user-space kernel virtualization, non-root execution (UID 10001), 
                  read-only container root filesystems, and memory zeroing on process teardown to prevent cold-boot memory dumps.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Live Execution Simulation & Timestamped Audit Logs</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live pipeline execution trigger with immediate telemetry generation, throughput rate calculation, error rate verification, 
                  and millisecond-precision structured execution audit logs.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>Format-Preserving Tokenization (FF3-1)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  NIST SP 800-38G compliant format-preserving encryption allowing social security numbers, credit cards, and emails 
                  to be masked while retaining deterministic character lengths and hyphen formatting for downstream analytical parity.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Granular Deletion & DAG Lifecycle Controls</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instantly delete selected workflows, individual pipeline nodes, or inter-node connectors with safety confirmations, 
                  keyboard shortcuts (Del / Backspace), and automatic dependency cleanup.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: INGESTION INPUTS & PROTOCOLS */}
          <section id="ingestion-inputs" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <HardDrive className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">3. Ingestion Inputs & Protocols Specification</h2>
            </div>
            <p className="text-sm text-slate-400">
              NxtGenOrchestrator natively supports ingestion from diverse streaming brokers, cloud object lakes, relational databases, enterprise SaaS platforms, and AI inference engines.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Source System</th>
                    <th className="p-3">Transport Protocol</th>
                    <th className="p-3">Serialization Formats</th>
                    <th className="p-3">Throughput & Sizing</th>
                    <th className="p-3">Authentication & Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/60 text-slate-300 font-mono">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-amber-300 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Apache Kafka / Redpanda</span>
                    </td>
                    <td className="p-3">TCP / TLS 1.3 (Port 9092/9093)</td>
                    <td className="p-3">Avro, Protobuf v3, JSON Schema</td>
                    <td className="p-3">Up to 75,000 rec/s per partition</td>
                    <td className="p-3">SASL/SCRAM-SHA-512 &amp; mTLS certs</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-blue-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>AWS S3 / GCS / Azure Blob</span>
                    </td>
                    <td className="p-3">HTTPS REST / HTTP/2 Multipart</td>
                    <td className="p-3">Apache Parquet, ORC, Delta Lake, CSV</td>
                    <td className="p-3">Multi-stream 500 MB/s parallel chunking</td>
                    <td className="p-3">IAM Role Assumption / Workload Identity</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-cyan-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Snowflake CDC / Stages</span>
                    </td>
                    <td className="p-3">HTTPS Snowpipe REST API</td>
                    <td className="p-3">Snowflake Internal Stage JSON/Parquet</td>
                    <td className="p-3">Micro-batch 50,000 rec/s</td>
                    <td className="p-3">RSA 2048-bit Keypair Authentication</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5" />
                      <span>Salesforce / SaaS Bulk</span>
                    </td>
                    <td className="p-3">HTTPS Bulk API 2.0</td>
                    <td className="p-3">JSON, CSV multipart chunks</td>
                    <td className="p-3">Rate-limited 100M records/24hr window</td>
                    <td className="p-3">OAuth 2.0 PKCE + Token Refresh</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-purple-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Gemini AI Multimodal</span>
                    </td>
                    <td className="p-3">HTTPS / gRPC streaming</td>
                    <td className="p-3">Structured JSON Schema Grounding</td>
                    <td className="p-3">Token budgeted: 4,096 tokens/batch</td>
                    <td className="p-3">Service Account Bearer Token / API Key</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>PostgreSQL / Cloud SQL</span>
                    </td>
                    <td className="p-3">PostgreSQL Wire v3 over TLS</td>
                    <td className="p-3">Row-oriented WAL / Debezium CDC</td>
                    <td className="p-3">Connection pooled: 200 concurrent</td>
                    <td className="p-3">SSL Mode verify-full, SCRAM-SHA-256</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Backpressure & Ingestion Controls */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Watermark Backpressure &amp; Flow Control Policy</span>
              </span>
              <p className="text-slate-400 leading-relaxed">
                When downstream transformation nodes exceed 80% CPU saturation or input memory queues cross 128 MB, 
                the ingestion engine automatically throttles upstream Kafka consumer poll intervals and activates reactive HTTP 429 
                rate-limiting on incoming webhooks to guarantee zero out-of-memory (OOM) pod crashes.
              </p>
            </div>
          </section>

          {/* SECTION 4: EGRESS TARGETS & OUTPUT DATA FORMATS */}
          <section id="egress-outputs" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-cyan-400">
              <Database className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">4. Egress Targets & Output Data Formats</h2>
            </div>
            <p className="text-sm text-slate-400">
              Cleaned, tokenized, and aggregated payloads are committed to destination repositories with strict ACID and exactly-once delivery guarantees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">1. Curated Lakehouse (Parquet / Delta)</span>
                <p className="text-xs text-slate-400">
                  Data files written in columnar <strong>Apache Parquet (Snappy / ZSTD compressed)</strong> with Hive-partitioned directory structures 
                  (<code>year=YYYY/month=MM/day=DD/</code>) and Delta Lake transaction log checkpoints.
                </p>
                <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-850">
                  s3://nxtorchestrato-lakehouse-prod/curated/transactions/year=2026/part-00042.snappy.parquet
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase">2. Cloud Data Warehouse (Snowflake / BigQuery)</span>
                <p className="text-xs text-slate-400">
                  Staged micro-batches loaded via automated COPY INTO commands with transactional validation. Schema changes trigger automated 
                  non-destructive table alter queries with lineage tracking.
                </p>
                <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-850">
                  ANALYTICS_DB.FINANCE_CURATED.TXN_LEDGER (CLUSTERED BY RECORD_TIMESTAMP)
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">3. Real-Time Streaming Egress</span>
                <p className="text-xs text-slate-400">
                  Outbound Kafka topics publish enriched business events for downstream low-latency microservices with end-to-end 
                  latencies under 45 milliseconds.
                </p>
                <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-850">
                  nxtorchestrato.egress.risk-scored-events.v1 (Partition Key: customer_id)
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-300 uppercase">4. Quarantine Dead Letter Queue (DLQ)</span>
                <p className="text-xs text-slate-400">
                  Payloads failing PII validation or schema contract checks are routed to an encrypted DLQ with full original error stack traces, 
                  allowing zero data loss and automated re-drive.
                </p>
                <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 border border-slate-850">
                  arn:aws:sqs:us-east-1:123456789012:nxtorchestrato-quarantine-dlq
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: ENTERPRISE BENEFITS */}
          <section id="enterprise-benefits" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">5. Enterprise Benefits, ROI & Compliance</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-emerald-900/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">ZERO DATA LOSS</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">100% EOS</div>
                <p className="text-xs text-slate-400">
                  Exactly-once semantics achieved via two-phase commit protocols across source offsets and sink transactions.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-cyan-900/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">COST OPTIMIZATION</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">42% Savings</div>
                <p className="text-xs text-slate-400">
                  Dynamic scale-to-zero compute eliminates idle cluster waste, reducing monthly cloud infrastructure spend.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-purple-900/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400">COMPLIANCE READINESS</span>
                  <Lock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">SOC 2 / HIPAA</div>
                <p className="text-xs text-slate-400">
                  Turnkey compliance with continuous audit logs, automated field-level masking, and cryptographic memory isolation.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: CONNECTOR INTEGRATION GUIDE */}
          <section id="connector-guide" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-indigo-400">
              <GitBranch className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">6. Connector Integration & Linking Guide</h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
              <p className="text-sm text-white font-medium">
                Follow these four standardized steps to integrate external connectors and establish secure DAG links:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-xs">Access Connector Studio</span>
                    <p className="text-slate-400">
                      Click the <strong>&ldquo;+ Add Connector&rdquo;</strong> button in the canvas header or click the right-side output port of any DAG node.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-xs">Select Source, Target &amp; Connector Preset</span>
                    <p className="text-slate-400">
                      Choose the upstream producing node and downstream receiving node. Select from ready presets: Kafka, Snowflake, S3, Salesforce, REST, gRPC, or Gemini AI.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-xs">Configure Protocol, Security &amp; Throughput</span>
                    <p className="text-slate-400">
                      Set protocol (Mutual TLS 1.3 Strict, gRPC over HTTP/2, OAuth 2.0 PKCE) and tune buffer throughput limits (e.g. 24,000 rec/s).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </span>
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-xs">Verify Live Handshake &amp; Execute</span>
                    <p className="text-slate-400">
                      Click <strong>&ldquo;Integrate Connector &amp; Link Workflow&rdquo;</strong>. The edge appears immediately on canvas with rich protocol badges and live flow indicators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: EXECUTION OBSERVABILITY & TIMESTAMPED LOGS */}
          <section id="execution-observability" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-amber-400">
              <Activity className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">7. Execution Engine & Timestamped Observability</h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
              <p className="text-slate-400 leading-relaxed">
                Every pipeline execution emits structured telemetry logs tagged with high-resolution timestamps down to the millisecond. 
                Below is an excerpt of the runtime audit trail format:
              </p>

              <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-1.5 border border-slate-800 overflow-x-auto">
                <div><span className="text-slate-500">[2026-10-09 17:54:12.012]</span> <span className="text-cyan-400 font-bold">[INFO]</span> <span className="text-slate-400">[DISPATCHER]</span> Initiated DAG run run-ent-841920 across 6 cluster worker pods.</div>
                <div><span className="text-slate-500">[2026-10-09 17:54:12.084]</span> <span className="text-emerald-400 font-bold">[METRIC]</span> <span className="text-slate-400">[KAFKA_INGEST]</span> Ingestion stream connected. Topic: enterprise.events.v1, Partition lag: 0 ms.</div>
                <div><span className="text-slate-500">[2026-10-09 17:54:12.215]</span> <span className="text-purple-400 font-bold">[SECURITY]</span> <span className="text-slate-400">[KMS_ENCLAVE]</span> Envelope KMS key verified. FF3-1 format-preserving tokenization active.</div>
                <div><span className="text-slate-500">[2026-10-09 17:54:12.418]</span> <span className="text-blue-400 font-bold">[AUDIT]</span> <span className="text-slate-400">[SECURITY_ENCLAVE]</span> All cryptographic invariants satisfied. 0 PII leakages detected.</div>
                <div><span className="text-slate-500">[2026-10-09 17:54:12.780]</span> <span className="text-indigo-400 font-bold">[INFO]</span> <span className="text-slate-400">[QUALITY_VALIDATOR]</span> 54,200 records evaluated against Great Expectations suite. 100% pass rate.</div>
                <div><span className="text-slate-500">[2026-10-09 17:54:12.992]</span> <span className="text-emerald-400 font-bold">[SUCCESS]</span> <span className="text-slate-400">[PIPELINE_ENGINE]</span> Pipeline run completed in 0.98s. 54,200 records committed to Snowflake Stage.</div>
              </div>
            </div>
          </section>

          {/* SECTION 8: DELETION & LIFECYCLE MANAGEMENT */}
          <section id="deletion-lifecycle" className="space-y-4 scroll-mt-6">
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">8. Deletion & DAG Lifecycle Operations</h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
              <p className="text-sm text-white font-medium">
                The platform provides safe, granular deletion controls with automatic dependency cleanups:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-rose-300 text-xs flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Connector</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Click any connector badge or edge on canvas to select it, then click the red &ldquo;Delete Connector&rdquo; button or press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[10px]">Del</kbd>. 
                    The inter-node link is cleanly detached without destroying the participating nodes.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected Node</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Select any node and click the trash button in the floating toolbar, node card header, or Node Inspector. 
                    All incoming and outgoing edges attached to that node are automatically cascade-purged.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-red-300 text-xs flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Workflow</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Click the &ldquo;Delete Workflow&rdquo; button beside the workflow picker or in the dropdown menu. 
                    A confirmation dialog ensures safety before removing the workflow and seamlessly switching to the next available workflow.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: NOTES & ROADMAP FOR FURTHER IMPROVEMENTS */}
          <section id="future-improvements" className="space-y-4 scroll-mt-6 pb-12">
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-5 h-5" />
              <h2 className="text-xl font-bold tracking-tight text-white">9. Notes & Strategic Roadmap for Further Improvements</h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
              <p className="text-slate-400 leading-relaxed">
                The following strategic engineering initiatives are scheduled for subsequent architectural phases:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Active-Active Multi-Region Distributed Checkpointing</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Implement Raft-consensus distributed state checkpoints across US-East, US-West, and EU-West clusters, enabling seamless RPO=0 and RTO &lt; 3s automatic failover during cloud provider availability zone outages.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>WebAssembly (WASM) Custom User-Defined Plugins</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Allow data engineering teams to author high-performance transformation logic in Rust, Go, or C++ compiled to WebAssembly bytecode with sandboxed sub-millisecond execution overhead.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>AI-Driven Predictive Backpressure & Auto-Tuning</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Integrate Gemini neural forecasting models to predict ingestion spikes 15 minutes in advance, proactively scaling pod replica counts and re-partitioning Kafka topics before memory saturation occurs.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Declarative GitOps & Terraform Provider</span>
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Enable full bidirectional synchronization between the visual canvas and declarative YAML / HCL infrastructure-as-code manifests, empowering version-controlled pipeline promotions through CI/CD pipelines.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
