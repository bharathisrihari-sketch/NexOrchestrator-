import React, { useState } from 'react';
import { 
  CalendarRange, 
  CheckCircle2, 
  Flag, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  GitBranch, 
  Server,
  Milestone
} from 'lucide-react';
import { ROADMAP_PHASES } from '../../data/blueprintData';
import { CollapsibleSection } from '../common/CollapsibleSection';

export const RoadmapView: React.FC = () => {
  const [selectedPhaseNum, setSelectedPhaseNum] = useState<number>(1);
  const [workstreamFilter, setWorkstreamFilter] = useState<'all' | 'architecture' | 'security' | 'platform' | 'governance'>('all');

  const selectedPhase = ROADMAP_PHASES.find(p => p.phase === selectedPhaseNum) || ROADMAP_PHASES[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
            Section 6 · 90-Day Enterprise Execution Roadmap
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-teal-400" />
            <span>90-Day Implementation Roadmap</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            Structured 12-week execution schedule partitioned into three 30-day phases. Each week details deliverables across Architecture, Security, Platform Engineering, and Governance workstreams.
          </p>
        </div>

        {/* Phase Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0 text-xs font-medium">
          {ROADMAP_PHASES.map((phase) => (
            <button
              key={phase.phase}
              onClick={() => setSelectedPhaseNum(phase.phase)}
              className={`px-3 py-1.5 rounded transition-colors ${
                selectedPhaseNum === phase.phase
                  ? 'bg-slate-800 text-teal-300 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phase {phase.phase}
            </button>
          ))}
        </div>
      </div>

      {/* COLLAPSIBLE SUB-HEADER 1: Phase Mission & Exit Criteria */}
      <CollapsibleSection
        title={`${selectedPhase.name} (${selectedPhase.timeframe})`}
        subtitle={selectedPhase.objective}
        badge="Phase Profile"
        badgeColor="bg-teal-950 text-teal-400 border border-teal-800/60"
        icon={Milestone}
        defaultOpen={true}
      >
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Phase Exit Criteria & Mandatory Quality Gates:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {selectedPhase.exitCriteria.map((crit, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{crit}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Workstream Filter Controls */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">Filter Workstream:</span>
        {(['all', 'architecture', 'security', 'platform', 'governance'] as const).map((ws) => (
          <button
            key={ws}
            onClick={() => setWorkstreamFilter(ws)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize ${
              workstreamFilter === ws
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white bg-slate-900/50'
            }`}
          >
            {ws}
          </button>
        ))}
      </div>

      {/* COLLAPSIBLE SUB-HEADER 2+: Week-by-Week Breakdown with Collapsible Weeks */}
      <div className="space-y-3">
        {selectedPhase.weeks.map((week) => (
          <CollapsibleSection
            key={week.week}
            title={`Week ${week.week}: ${week.title}`}
            subtitle={`Focus: ${week.focus}`}
            badge={week.milestone || `Week ${week.week}`}
            badgeColor={week.milestone ? 'bg-teal-950 text-teal-300 border border-teal-700 font-bold' : 'bg-slate-800 text-slate-300'}
            icon={CalendarRange}
            defaultOpen={true}
          >
            <div className="space-y-3">
              {/* Deliverables List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Primary Weekly Deliverables:
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200">
                  {week.deliverables.map((deliv, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Workstream Matrix */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {(workstreamFilter === 'all' || workstreamFilter === 'architecture') && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Architecture</span>
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {week.workstreams.architecture}
                    </p>
                  </div>
                )}

                {(workstreamFilter === 'all' || workstreamFilter === 'security') && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Security</span>
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {week.workstreams.security}
                    </p>
                  </div>
                )}

                {(workstreamFilter === 'all' || workstreamFilter === 'platform') && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      <span>Platform Eng</span>
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {week.workstreams.platform}
                    </p>
                  </div>
                )}

                {(workstreamFilter === 'all' || workstreamFilter === 'governance') && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-purple-400 flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>Governance</span>
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {week.workstreams.governance}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
};
