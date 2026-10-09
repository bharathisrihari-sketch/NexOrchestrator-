import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-slate-800 text-slate-300',
  defaultOpen = true,
  icon: Icon,
  headerRight,
  children,
  className = '',
  headerClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all duration-200 ${className}`}>
      {/* Clickable Collapsible Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-850/80 transition-colors border-b ${
          isOpen ? 'border-slate-800/80 bg-slate-900/90' : 'border-transparent bg-slate-900/50'
        } ${headerClassName}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-slate-400 hover:text-white transition-colors shrink-0">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          {Icon && (
            <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-tight truncate">
                {title}
              </h3>
              {badge && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {headerRight && (
          <div onClick={(e) => e.stopPropagation()} className="shrink-0 ml-2">
            {headerRight}
          </div>
        )}
      </div>

      {/* Collapsible Content Body */}
      {isOpen && (
        <div className="p-4 lg:p-5 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
