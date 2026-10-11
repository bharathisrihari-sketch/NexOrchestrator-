import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Info } from 'lucide-react';

interface ArchitectureAssumptionNoteProps {
  title?: string;
  assumptions: string[];
  openQuestions?: string[];
  className?: string;
  defaultOpen?: boolean;
}

export const ArchitectureAssumptionNote: React.FC<ArchitectureAssumptionNoteProps> = ({
  title = "Architectural Assumptions & Open Questions",
  assumptions,
  openQuestions = [],
  className = "",
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs overflow-hidden transition-all ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-amber-950/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{title}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-200 border border-amber-700/50">
            ARB Note
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-[11px]">
          <span>{isOpen ? 'Collapse' : 'Expand Notes'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 space-y-3 border-t border-amber-900/30 animate-in fade-in duration-150">
          {assumptions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Validated Design Assumptions:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {assumptions.map((a, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {openQuestions.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-amber-900/30">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Open Architecture Questions for Review:
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {openQuestions.map((q, idx) => (
                  <li key={idx} className="leading-relaxed text-amber-200/90">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
