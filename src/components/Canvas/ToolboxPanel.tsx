import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Radio, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Binary, 
  ArrowRightLeft, 
  Archive, 
  Layers, 
  Plus, 
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  BarChart3,
  Server,
  Cpu,
  Lock,
  Workflow,
  CheckCircle2,
  PieChart
} from 'lucide-react';

interface ToolboxPanelProps {
  onAddNode: (type: string, name: string) => void;
  onOpenCopilot: () => void;
}

interface SubMenuItem {
  id: string;
  name: string;
  icon: any;
  type: string;
  desc: string;
}

interface SubCategoryGroup {
  id: string;
  title: string;
  icon: any;
  items: SubMenuItem[];
}

interface MainCategory {
  id: string;
  title: string;
  badge: string;
  groups: SubCategoryGroup[];
}

export const ToolboxPanel: React.FC<ToolboxPanelProps> = ({
  onAddNode,
  onOpenCopilot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Track expand/collapse state: ALL sub-menus and nested groups collapsed by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>({});
  // Track hide/show visibility toggles for sub-level menus
  const [hiddenSubGroups, setHiddenSubGroups] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleSubGroupCollapse = (subId: string) => {
    setExpandedSubGroups(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const toggleSubGroupVisibility = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenSubGroups(prev => ({ ...prev, [subId]: !prev[subId] }));
  };

  const handleExpandAll = () => {
    const cats: Record<string, boolean> = {};
    const subs: Record<string, boolean> = {};
    menuCategories.forEach(c => {
      cats[c.id] = true;
      c.groups.forEach(g => { subs[g.id] = true; });
    });
    setExpandedCategories(cats);
    setExpandedSubGroups(subs);
  };

  const handleCollapseAll = () => {
    setExpandedCategories({});
    setExpandedSubGroups({});
  };

  // Structured multi-level hierarchy with 3rd level sub-items as dropdowns with hide/show toggles
  const menuCategories: MainCategory[] = [
    {
      id: 'sources',
      title: 'Data Sources (Ingestion)',
      badge: 'Inputs',
      groups: [
        {
          id: 'src-relational',
          title: 'Relational DBs (CDC)',
          icon: Database,
          items: [
            { id: 'src-pg-cdc', name: 'PostgreSQL WAL Debezium (CDC)', icon: Database, type: 'source', desc: 'Zero-downtime transactional WAL replication' },
            { id: 'src-mysql-cdc', name: 'MySQL Binlog Streaming Source', icon: Database, type: 'source', desc: 'Row-based binlog capture with GTID tracking' },
            { id: 'src-oracle-cdc', name: 'Oracle GoldenGate CDC Source', icon: Server, type: 'source', desc: 'Redo log mining for enterprise core systems' },
            { id: 'src-mssql-cdc', name: 'SQL Server Change Tracking', icon: Database, type: 'source', desc: 'Change tracking tables with schema evolution' }
          ]
        },
        {
          id: 'src-storage-lakes',
          title: 'Object Storage & Lakehouses',
          icon: HardDrive,
          items: [
            { id: 'src-s3-lake', name: 'AWS S3 / Apache Iceberg Lake', icon: HardDrive, type: 'source', desc: 'S3 bucket object ingest with Iceberg metadata' },
            { id: 'src-adls-lake', name: 'Azure ADLS Gen2 Storage Sink', icon: HardDrive, type: 'source', desc: 'Blob storage delta lakehouse parquet feed' },
            { id: 'src-gcs-lake', name: 'Google Cloud Storage Bucket', icon: HardDrive, type: 'source', desc: 'Multi-region GCS analytics bucket source' }
          ]
        },
        {
          id: 'src-streaming',
          title: 'Streaming & Event Topics',
          icon: Radio,
          items: [
            { id: 'src-kafka-topic', name: 'Apache Kafka Partitioned Topic', icon: Radio, type: 'source', desc: 'High-throughput SASL/SCRAM Kafka stream' },
            { id: 'src-kinesis-stream', name: 'AWS Kinesis Data Stream Source', icon: Radio, type: 'source', desc: 'Real-time shard-based event streaming' },
            { id: 'src-rabbitmq-bus', name: 'RabbitMQ Enterprise Queue', icon: Radio, type: 'source', desc: 'AMQP 0-9-1 durable message exchange' }
          ]
        },
        {
          id: 'src-files',
          title: 'Enterprise Feeds & Batch Files',
          icon: FileSpreadsheet,
          items: [
            { id: 'src-sftp-feed', name: 'Secure SFTP Batch File Ingest', icon: FileSpreadsheet, type: 'source', desc: 'Encrypted scheduled batch flat-file polling' },
            { id: 'src-excel-csv', name: 'Excel / CSV Structured Feed', icon: FileSpreadsheet, type: 'source', desc: 'Financial spreadsheet & delimited CSV feed' },
            { id: 'src-parquet-feed', name: 'Parquet Partitioned Directory', icon: Binary, type: 'source', desc: 'Columnar compression zstd file ingestion' }
          ]
        }
      ]
    },
    {
      id: 'transforms',
      title: 'Transforms & Enrichment',
      badge: 'Compute',
      groups: [
        {
          id: 'tr-security',
          title: 'Security, Masking & Enclaves',
          icon: ShieldCheck,
          items: [
            { id: 'tr-pii-mask', name: 'Sensitive Data Masking & PII', icon: EyeOff, type: 'guardrail', desc: 'Deterministic format-preserving tokenization' },
            { id: 'tr-enclave-run', name: 'Confidential AMD-SEV Enclave', icon: Lock, type: 'transform', desc: 'Hardware-attested memory isolation container' }
          ]
        },
        {
          id: 'tr-joins',
          title: 'Enrichment & Dimensional Joins',
          icon: ArrowRightLeft,
          items: [
            { id: 'tr-broadcast-join', name: 'Broadcasting Metadata Joiner', icon: ArrowRightLeft, type: 'transform', desc: 'In-memory dimension lookup table join' },
            { id: 'tr-scd2-lookup', name: 'SCD-2 Historical Lookup', icon: ArrowRightLeft, type: 'transform', desc: 'Slowly changing dimension temporal merge' }
          ]
        },
        {
          id: 'tr-aggregations',
          title: 'Contracts, KPI & Aggregations',
          icon: Calculator,
          items: [
            { id: 'tr-contract-gate', name: 'Data Quality & Contract Gate', icon: CheckCircle2, type: 'guardrail', desc: 'Great Expectations schema assertions gate' },
            { id: 'tr-kpi-agg', name: 'Business Metric Aggregator', icon: Calculator, type: 'transform', desc: 'Sliding window rollups and financial KPIs' },
            { id: 'tr-schema-proj', name: 'Schema Projection & Cast', icon: Binary, type: 'transform', desc: 'Type casting, schema pruning and sanitization' }
          ]
        },
        {
          id: 'tr-ai-eval',
          title: 'AI Synthesis & Embeddings',
          icon: Sparkles,
          items: [
            { id: 'tr-gemini-embed', name: 'Gemini AI Semantic Embeddings', icon: Sparkles, type: 'transform', desc: 'Multi-modal vector extraction and classification' },
            { id: 'tr-prompt-guard', name: 'Prompt Injection Guardrail', icon: ShieldCheck, type: 'guardrail', desc: 'Real-time safety filter against jailbreaks' }
          ]
        }
      ]
    },
    {
      id: 'sinks',
      title: 'Target Sinks (Destinations)',
      badge: 'Outputs',
      groups: [
        {
          id: 'snk-bi-reports',
          title: 'Power BI & BI Dashboards',
          icon: BarChart3,
          items: [
            { 
              id: 'snk-powerbi-report', 
              name: 'Power BI Report & DirectLake Sink', 
              icon: BarChart3, 
              type: 'sink', 
              desc: 'DirectLake semantic push dataset & automated Power BI report workspace sync' 
            },
            { 
              id: 'snk-tableau-hyper', 
              name: 'Tableau Hyper Extract Target', 
              icon: PieChart, 
              type: 'sink', 
              desc: 'High-speed Tableau Server hyper file publish' 
            }
          ]
        },
        {
          id: 'snk-warehouses',
          title: 'Cloud Data Warehouses',
          icon: Database,
          items: [
            { id: 'snk-snowflake-wh', name: 'Snowflake Data Cloud Warehouse', icon: Database, type: 'sink', desc: 'Snowpipe streaming auto-clustering table sink' },
            { id: 'snk-bigquery-wh', name: 'Google BigQuery Columnar Sink', icon: Database, type: 'sink', desc: 'Storage Write API streaming ingestion' }
          ]
        },
        {
          id: 'snk-lakehouses',
          title: 'Curated Gold Lakehouses',
          icon: Archive,
          items: [
            { id: 'snk-curated-analytics', name: 'Curated Analytics Repository', icon: Archive, type: 'sink', desc: 'Delta/Iceberg ACID partitioned analytical repository' },
            { id: 'snk-gold-s3', name: 'AWS S3 Gold Curated Bucket', icon: HardDrive, type: 'sink', desc: 'Immutable Parquet object lake with S3 ObjectLock' }
          ]
        },
        {
          id: 'snk-bus',
          title: 'Event Brokers & Downstream APIs',
          icon: Radio,
          items: [
            { id: 'snk-kafka-out', name: 'Kafka Outbound Event Pipe', icon: Radio, type: 'sink', desc: 'Guaranteed delivery enterprise topic publisher' },
            { id: 'snk-rest-webhook', name: 'Secure REST Webhook Gateway', icon: Workflow, type: 'sink', desc: 'HMAC signed HTTP/2 webhook with DLQ exponential retry' }
          ]
        }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 flex flex-col h-full shrink-0 select-none backdrop-blur-md">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800 space-y-2 shrink-0 bg-slate-950">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Component Toolbox</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleExpandAll}
              className="text-[10px] text-slate-400 hover:text-cyan-300 px-1 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Expand all categories & sub-menus"
            >
              Expand
            </button>
            <span className="text-slate-600">/</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold px-1 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Collapse all sub-menus & categories"
            >
              Collapse
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search nodes & targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Accordion Categories with All Sub-Menus Collapsed by Default */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
        {menuCategories.map((category) => {
          // Collapsed by default at all granular levels; expand if search active or user toggled
          const isCategoryExpanded = searchQuery.trim().length > 0 ? true : !!expandedCategories[category.id];

          // Filter groups and items
          const filteredGroups = category.groups.map(group => {
            const items = group.items.filter(item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.desc.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return { ...group, items };
          }).filter(group => group.items.length > 0);

          if (filteredGroups.length === 0) return null;

          return (
            <div key={category.id} className="space-y-1 rounded-xl bg-slate-900/40 border border-slate-850/80 p-1.5">
              {/* Category Level 1 Header (Click to expand) */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-850/60 transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">{category.title}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {category.badge}
                  </span>
                </div>
                {isCategoryExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>

              {/* Sub-groups Level 2 (Collapsed by default) */}
              {isCategoryExpanded && (
                <div className="space-y-1 pl-1 pt-0.5">
                  {filteredGroups.map((group) => {
                    // Sub-group collapsed by default
                    const isGroupExpanded = searchQuery.trim().length > 0 ? true : !!expandedSubGroups[group.id];
                    const isGroupHidden = !!hiddenSubGroups[group.id];
                    const GroupIcon = group.icon;

                    return (
                      <div key={group.id} className="rounded-lg bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                        {/* Level 2 Sub-Group Header (Click to expand items) */}
                        <div
                          onClick={() => toggleSubGroupCollapse(group.id)}
                          className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-slate-850/70 transition-colors group"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GroupIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white truncate">
                              {group.title}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              ({group.items.length})
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Toggle Hide & Show button for this sub-level menu */}
                            <button
                              type="button"
                              onClick={(e) => toggleSubGroupVisibility(group.id, e)}
                              className={`p-1 rounded transition-colors ${
                                isGroupHidden 
                                  ? 'text-rose-400 hover:text-rose-300 bg-rose-950/40' 
                                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                              }`}
                              title={isGroupHidden ? `Show ${group.title} items` : `Hide ${group.title} items`}
                            >
                              {isGroupHidden ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>

                            {/* Dropdown Chevron */}
                            <span className="text-slate-400">
                              {isGroupExpanded ? (
                                <ChevronDown className="w-3 h-3 text-cyan-400" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Level 3 Sub-Items (shown only when EXPANDED and NOT hidden) */}
                        {isGroupExpanded && !isGroupHidden && (
                          <div className="p-1 space-y-1 bg-slate-900/30 border-t border-slate-800/60 animate-in fade-in duration-100">
                            {group.items.map((item) => {
                              const ItemIcon = item.icon;
                              const isPowerBi = item.id === 'snk-powerbi-report';

                              return (
                                <div
                                  key={item.id}
                                  onClick={() => onAddNode(item.type, item.name)}
                                  className={`group flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-all ${
                                    isPowerBi
                                      ? 'bg-amber-950/30 hover:bg-amber-900/40 border border-amber-600/40 text-amber-200 shadow-sm'
                                      : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 text-slate-200'
                                  }`}
                                  title={`${item.desc} — Click to add to canvas`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={`p-1 rounded ${
                                      isPowerBi 
                                        ? 'bg-amber-500/20 text-amber-400' 
                                        : 'bg-slate-800 text-cyan-400 group-hover:text-cyan-300'
                                    }`}>
                                      <ItemIcon className="w-3 h-3" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-[11px] font-medium truncate group-hover:text-white flex items-center gap-1">
                                        <span className="truncate">{item.name}</span>
                                        {isPowerBi && (
                                          <span className="text-[8px] font-bold uppercase px-1 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50">
                                            Target
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[9px] text-slate-400 truncate">
                                        {item.desc}
                                      </div>
                                    </div>
                                  </div>
                                  <Plus className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Indication when hidden */}
                        {isGroupExpanded && isGroupHidden && (
                          <div className="px-2 py-1 text-[10px] text-slate-500 italic bg-slate-950/40 border-t border-slate-850 flex items-center justify-between">
                            <span>Items hidden ({group.items.length})</span>
                            <button
                              type="button"
                              onClick={(e) => toggleSubGroupVisibility(group.id, e)}
                              className="text-cyan-400 hover:underline text-[9px]"
                            >
                              Unhide
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Copilot Quick Prompt Box */}
      <div className="p-3 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/90 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Engine</span>
          </span>
          <span className="text-[10px] text-slate-400">Natural Language</span>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2">
          "Build a pipeline with Power BI target reporting, Kafka CDC ingest, and masking..."
        </p>
        <button
          onClick={onOpenCopilot}
          className="w-full py-1.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesize Pipeline</span>
        </button>
      </div>
    </aside>
  );
};
