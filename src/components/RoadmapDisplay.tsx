import React from 'react';
import { Roadmap } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Check, Sparkles } from 'lucide-react';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
  onReset: () => void;
}

export default function RoadmapDisplay({ roadmap, onReset }: RoadmapDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto mt-8 space-y-12 pb-24"
    >
      {/* Header section summarizing the personal roadmap */}
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

      {/* Vertical list of phases with connecting line layout */}
      <div className="space-y-6 relative">
        {roadmap.phases.map((phase, index) => (
          <motion.div
            key={phase.id || index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-6 p-6 md:p-8 bg-white rounded-[24px] shadow-sm border border-gray-150 hover:border-blue-200 transition-all group"
          >
            {/* Phase Node Circle */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                <span className="text-sm tracking-tight">{phase.id || `P${index + 1}`}</span>
              </div>
            </div>

            {/* Phase Core Contents */}
            <div className="flex-grow space-y-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-[#1f1f1f] leading-tight">
                  {phase.title}
                </h3>
                <span className="px-3 py-1 bg-slate-100/80 border border-slate-200/50 text-[#444746] text-xs font-semibold rounded-full group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  {phase.style}
                </span>
              </div>
              
              {/* Motivation Hook Callout */}
              {phase.motivation_hook && (
                <div className="pl-3.5 border-l-2 border-blue-500 italic text-slate-500 text-[13px] leading-relaxed my-2">
                  "{phase.motivation_hook}"
                </div>
              )}

              {/* Tasks Checklist Grid */}
              {phase.tasks && phase.tasks.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Milestones & Keyword Focus
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
