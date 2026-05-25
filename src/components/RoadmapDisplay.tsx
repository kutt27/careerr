import React, { useState } from 'react';
import { Roadmap } from '../types';
import { motion } from 'motion/react';
import { Check, Sparkles, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { expandAllPhases } from '../services/aiService';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onReset: () => void;
  onUpdateRoadmap: (updated: Roadmap) => void;
}

export default function RoadmapDisplay({ roadmap, onReset, onUpdateRoadmap }: RoadmapDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandError, setExpandError] = useState<string | null>(null);

  const handleExpandAll = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    const allAlreadyExpanded = roadmap.phases.every(p => p.enriched_tasks && p.enriched_tasks.length > 0);
    if (allAlreadyExpanded) {
      setIsExpanded(true);
      return;
    }

    setIsExpanding(true);
    setExpandError(null);

    try {
      const enriched = await expandAllPhases(roadmap.topic, roadmap.phases);

      if (!enriched || enriched.length === 0) {
        setExpandError('Received empty enrichment from AI');
        return;
      }

      const updatedPhases = roadmap.phases.map((phase, i) => {
        const matchById = enriched.find(e => e.id === phase.id);
        if (matchById) return { ...phase, enriched_tasks: matchById.enriched_tasks };
        if (enriched[i]) return { ...phase, enriched_tasks: enriched[i].enriched_tasks };
        return phase;
      });

      if (!updatedPhases.some(p => p.enriched_tasks && p.enriched_tasks.length > 0)) {
        setExpandError('No enrichment data was returned from the AI');
        return;
      }

      onUpdateRoadmap({ ...roadmap, phases: updatedPhases });
      setIsExpanded(true);
    } catch (err) {
      setExpandError(err instanceof Error ? err.message : 'Failed to enrich roadmap');
    } finally {
      setIsExpanding(false);
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
            {roadmap.phase_count} Phases
          </div>
          <button
            onClick={handleExpandAll}
            disabled={isExpanding}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm border ${
              isExpanded
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isExpanding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Enriching...
              </>
            ) : isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                Show Overview
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                Deep Dive
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-1.5 bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50/20 text-[#444746] hover:text-blue-700 text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm"
          >
            Create New Roadmap
          </button>
        </div>
        {expandError && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2.5 border border-red-100 max-w-md mx-auto">
            {expandError}
          </p>
        )}
      </div>

      <div className="space-y-6 relative">
        {roadmap.phases.map((phase, index) => {
          const key = phase.id || `P${index + 1}`;
          const tasks = isExpanded && phase.enriched_tasks?.length
            ? phase.enriched_tasks
            : phase.tasks;

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

                {tasks && tasks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {isExpanded ? 'Enriched Milestones' : 'Milestones &amp; Keywords'}
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {tasks.map((task, tIndex) => (
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

                {isExpanded && !phase.enriched_tasks?.length && isExpanding && (
                  <p className="text-xs text-slate-400 italic pt-1">Enriching...</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
