import React, { useState } from 'react';
import { Roadmap, ExpandedPhase } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Check, Sparkles, ChevronDown, ChevronUp, Loader2, Search, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { expandPhase } from '../services/aiService';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onReset: () => void;
  onUpdateRoadmap: (updated: Roadmap) => void;
}

export default function RoadmapDisplay({ roadmap, onReset, onUpdateRoadmap }: RoadmapDisplayProps) {
  const [expandingPhases, setExpandingPhases] = useState<Set<string>>(new Set());
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [errorPhases, setErrorPhases] = useState<Record<string, string>>({});

  const handleToggleExpand = async (phaseIndex: number) => {
    const phase = roadmap.phases[phaseIndex];
    const key = phase.id || `P${phaseIndex + 1}`;

    if (expandedPhases.has(key)) {
      setExpandedPhases(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      return;
    }

    if (phase.expanded) {
      setExpandedPhases(prev => new Set(prev).add(key));
      return;
    }

    setExpandingPhases(prev => new Set(prev).add(key));
    setErrorPhases(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    try {
      const expanded = await expandPhase(
        roadmap.topic,
        phase.id || `P${phaseIndex + 1}`,
        phase.title,
        phase.style,
        phase.motivation_hook || '',
        phase.tasks || []
      );

      const updatedPhases = [...roadmap.phases];
      updatedPhases[phaseIndex] = { ...phase, expanded };

      onUpdateRoadmap({ ...roadmap, phases: updatedPhases });
      setExpandedPhases(prev => new Set(prev).add(key));
    } catch (err) {
      setErrorPhases(prev => ({
        ...prev,
        [key]: err instanceof Error ? err.message : 'Failed to expand'
      }));
    } finally {
      setExpandingPhases(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto mt-8 space-y-12 pb-24"
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-blue-600 text-sm font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>{roadmap.level} Roadmap</span>
        </div>
        <h2 className="text-[36px] font-semibold text-[#1f1f1f] tracking-tight leading-tight">
          {roadmap.topic}
        </h2>
        <p className="text-[#444746] max-w-xl mx-auto leading-relaxed text-base font-medium">
          {roadmap.overview}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold rounded-full">
            Structured into {roadmap.phase_count} Custom Phases
          </div>
          <button
            onClick={onReset}
            className="px-4 py-1.5 bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50/20 text-[#444746] hover:text-blue-700 text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm"
          >
            Create New Roadmap
          </button>
        </div>
      </div>

      <div className="space-y-6 relative">
        {roadmap.phases.map((phase, index) => {
          const key = phase.id || `P${index + 1}`;
          const isExpanded = expandedPhases.has(key);
          const isLoading = expandingPhases.has(key);
          const error = errorPhases[key];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-6 p-6 md:p-8 bg-white rounded-[24px] shadow-sm border border-gray-150 hover:border-blue-200 transition-all group"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                  <span className="text-sm tracking-tight">{key}</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#1f1f1f] leading-tight">
                    {phase.title}
                  </h3>
                  <span className="px-3 py-1 bg-slate-100/80 border border-slate-200/50 text-[#444746] text-xs font-semibold rounded-full group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    {phase.style}
                  </span>
                </div>
                
                {phase.motivation_hook && (
                  <div className="pl-3.5 border-l-2 border-blue-500 italic text-slate-500 text-[13px] leading-relaxed my-2">
                    &ldquo;{phase.motivation_hook}&rdquo;
                  </div>
                )}

                {/* Compact task list when collapsed */}
                {!isExpanded && phase.tasks && phase.tasks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Milestones &amp; Keyword Focus
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {phase.tasks.map((task, tIndex) => (
                        <div
                          key={tIndex}
                          className="flex items-start gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs text-slate-650 hover:bg-slate-100/50 hover:border-slate-200 transition-all duration-200"
                        >
                          <div className="w-4 h-4 rounded border border-slate-350 bg-white flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer hover:border-blue-500 transition-colors">
                            <Check className="w-3 h-3 text-blue-600 opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="leading-relaxed font-medium">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded detailed view */}
                <AnimatePresence>
                  {isExpanded && phase.expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-5 pt-2 overflow-hidden"
                    >
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">
                        Deep Dive &mdash; Task Breakdown
                      </span>
                      {phase.expanded.expanded_tasks.map((et, tIndex) => (
                        <motion.div
                          key={tIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tIndex * 0.08 }}
                          className="bg-slate-50/60 border border-slate-150 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {tIndex + 1}
                            </div>
                            <p className="text-sm font-bold text-[#1f1f1f] leading-snug">
                              {et.original}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Why</span>
                                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{et.why}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outcome</span>
                                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{et.outcome}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">How</span>
                            <p className="text-xs text-slate-700 leading-relaxed bg-white rounded-xl p-3 border border-slate-100">
                              {et.how}
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Common Pitfall</span>
                              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{et.pitfall}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            {et.keywords.map((kw, kIndex) => (
                              <span
                                key={kIndex}
                                className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-medium rounded-full"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error state */}
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2.5 border border-red-100">
                    {error}
                  </p>
                )}

                {/* Expand / Collapse button */}
                <div className="pt-1">
                  <button
                    onClick={() => handleToggleExpand(index)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Expanding...
                      </>
                    ) : isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Collapse details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Expand details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
