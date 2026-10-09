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
  ChevronRight
} from 'lucide-react';

interface ToolboxPanelProps {
  onAddNode: (type: string, name: string) => void;
  onOpenCopilot: () => void;
}

export const ToolboxPanel: React.FC<ToolboxPanelProps> = ({
  onAddNode,
  onOpenCopilot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    {
      id: 'sources',
      title: 'Data Sources (Ingestion)',
      items: [
        { id: 'src-storage', name: 'Object Storage Source', icon: HardDrive, type: 'source', desc: 'S3-compatible bucket, Parquet/JSON' },
        { id: 'src-db', name: 'Relational Database (CDC)', icon: Database, type: 'source', desc: 'PostgreSQL, MySQL, Oracle CDC' },
        { id: 'src-stream', name: 'Streaming Message Topic', icon: Radio, type: 'source', desc: 'Kafka, EventHub, Pub/Sub stream' },
        { id: 'src-file', name: 'Enterprise File Feed', icon: FileSpreadsheet, type: 'source', desc: 'SFTP, CSV, Excel structured feed' },
      ]
    },
    {
      id: 'transforms',
      title: 'Transforms & Enrichment',
      items: [
        { id: 'tr-mask', name: 'Sensitive Data Masking', icon: ShieldCheck, type: 'guardrail', desc: 'Format-preserving tokenization & PII filter' },
        { id: 'tr-enrich', name: 'Reference Dataset Join', icon: ArrowRightLeft, type: 'transform', desc: 'Metadata store lookup & dimension join' },
        { id: 'tr-agg', name: 'Business Metric Aggregator', icon: Calculator, type: 'transform', desc: 'Sliding/tumbling window KPI rollups' },
        { id: 'tr-proj', name: 'Schema Projection', icon: Binary, type: 'transform', desc: 'Column mapping, type casting, filtering' },
        { id: 'tr-ai', name: 'AI Feature Extraction', icon: Sparkles, type: 'transform', desc: 'LLM semantic classification & embeddings' },
      ]
    },
    {
      id: 'sinks',
      title: 'Target Sinks (Destinations)',
      items: [
        { id: 'snk-analytics', name: 'Curated Analytics Repo', icon: Archive, type: 'sink', desc: 'Iceberg/Delta partitioned analytical lake' },
        { id: 'snk-warehouse', name: 'Enterprise Data Warehouse', icon: Database, type: 'sink', desc: 'Columnar analytical warehouse cluster' },
        { id: 'snk-storage', name: 'Object Storage Sink', icon: HardDrive, type: 'sink', desc: 'Curated Gold storage bucket' },
        { id: 'snk-bus', name: 'Event Bus / Downstream', icon: Radio, type: 'sink', desc: 'Enterprise event broker integration' },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/70 flex flex-col h-full shrink-0 select-none">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Component Toolbox</span>
          </span>
          <span className="text-[10px] text-slate-400">Drag or Click</span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-2 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {categories.map((category) => {
          const isCollapsed = !!collapsedSections[category.id];
          const filteredItems = category.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={category.id} className="space-y-1">
              <button
                onClick={() => toggleSection(category.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider"
              >
                <span>{category.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => onAddNode(item.type, item.name)}
                        className="group flex items-center justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
                        title={item.desc}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 rounded bg-slate-800 text-cyan-400 group-hover:text-cyan-300">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
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
            </div>
          );
        })}
      </div>

      {/* AI Copilot Quick Prompt Box */}
      <div className="p-3 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Engine</span>
          </span>
          <span className="text-[10px] text-slate-400">Natural Language</span>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2">
          "Build a pipeline that ingests structured and semi-structured data, masks sensitive..."
        </p>
        <button
          onClick={onOpenCopilot}
          className="w-full py-1.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesize Pipeline</span>
        </button>
      </div>
    </aside>
  );
};
