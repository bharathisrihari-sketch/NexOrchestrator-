import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  GitBranch, 
  Activity, 
  Terminal, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Layers,
  Award
} from 'lucide-react';
import { READINESS_PILLARS } from '../../data/blueprintData';
import { ReadinessPillar } from '../../types/architecture';
import { CollapsibleSection } from '../common/CollapsibleSection';

export const ReadinessDashboard: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('security');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready' | 'In Progress'>('All');

  const selectedPillar = READINESS_PILLARS.find(p => p.id === selectedPillarId) || READINESS_PILLARS[0];

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'security': return ShieldCheck;
      case 'scalability': return Cpu;
      case 'reliability': return RefreshCw;
      case 'governance': return GitBranch;
      case 'observability': return Activity;
      default: return Terminal;
    }
  };

  const filteredPillars = READINESS_PILLARS.filter(p => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  const averageScore = Math.round(
    READINESS_PILLARS.reduce((acc, p) => acc + p.readinessScore, 0) / READINESS_PILLARS.length
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
            Section 4 · Architecture Scorecard & Compliance
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>Enterprise Readiness Assessment Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            Multi-dimensional evaluation of NexOrchestrator across the six core pillars of enterprise architecture. Calibrated against CMMI maturity levels and non-functional requirements (NFRs).
          </p>
        </div>

        {/* Global Score Widget */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4 shrink-0 shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Aggregate Readiness</span>
            <span className="text-2xl font-bold text-cyan-400 font-mono">{averageScore}%</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">CMMI Profile</span>
            <span className="text-sm font-semibold text-emerald-400">Level 4.2 Managed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-2">Filter Pillars:</span>
        {(['All', 'Ready', 'In Progress'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === filter
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* COLLAPSIBLE SUB-HEADER 1: 6-Pillar Overview Scorecard Grid */}
      <CollapsibleSection
        title="1. Enterprise Architecture Pillars Scorecard (Overview)"
        subtitle="Click any pillar card to drill down into sub-capabilities, gap analysis, and remediation roadmaps"
        badge={`${filteredPillars.length} Pillars`}
        badgeColor="bg-blue-950 text-blue-400 border border-blue-800/60"
        icon={Award}
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPillars.map((pillar) => {
            const Icon = getPillarIcon(pillar.id);
            const isSelected = selectedPillarId === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-4 rounded-xl bg-slate-950 border cursor-pointer transition-all duration-200 space-y-3 ${
                  isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-950/40 bg-slate-900/90'
                    : 'border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      pillar.status === 'Ready' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' :
                      'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      {pillar.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    pillar.status === 'Ready'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                  }`}>
                    {pillar.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {pillar.description}
                </p>

                {/* Progress Bar & CMMI Level */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Score</span>
                    <span className="text-cyan-400 font-bold">{pillar.readinessScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pillar.readinessScore}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        pillar.status === 'Ready' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                    <span>Current: Level {pillar.currentMaturity}</span>
                    <span className="text-cyan-300">Target: Level {pillar.targetMaturity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE SUB-HEADER 2: Deep Inspection & Gap Analysis for Selected Pillar */}
      <CollapsibleSection
        title={`2. Deep Architectural Inspection: ${selectedPillar.name}`}
        subtitle={`Current Level ${selectedPillar.currentMaturity} → Target Level ${selectedPillar.targetMaturity} · ${selectedPillar.readinessScore}% Compliance`}
        badge={selectedPillar.status}
        badgeColor={selectedPillar.status === 'Ready' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'}
        icon={Layers}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Sub-Capability Gap Analysis & Priority Matrix
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedPillar.subCapabilities.map((sub, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      {sub.name}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      sub.priority === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {sub.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span>Current: L{sub.currentLevel}</span>
                    <ChevronRight className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-300 font-bold">Target: L{sub.targetLevel}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-900">
                    {sub.gapAnalysis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* COLLAPSIBLE SUB-HEADER 3: Remediation Actions Table */}
      <CollapsibleSection
        title={`3. Key Remediation Actions & Implementation Track: ${selectedPillar.name}`}
        subtitle="Assigned enterprise leads, execution timelines, and measurable architecture impacts"
        badge={`${selectedPillar.keyRemediationActions.length} Actions Assigned`}
        badgeColor="bg-cyan-950 text-cyan-400 border border-cyan-800/60"
        icon={AlertCircle}
        defaultOpen={true}
      >
        <div className="rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Required Remediation Action</th>
                <th className="p-3">Timeline</th>
                <th className="p-3">Responsible Lead</th>
                <th className="p-3">Impact & Architecture Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {selectedPillar.keyRemediationActions.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-medium text-white flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item.action}</span>
                  </td>
                  <td className="p-3 font-mono text-cyan-400 whitespace-nowrap">{item.timeline}</td>
                  <td className="p-3 font-mono text-slate-300 whitespace-nowrap">{item.owner}</td>
                  <td className="p-3 text-slate-400">{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  );
};
