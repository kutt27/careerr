import React from 'react';
import { Roadmap } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Clock } from 'lucide-react';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto mt-16 space-y-12"
    >
      <div className="text-center space-y-3">
        <div className="text-blue-600 text-sm font-bold uppercase tracking-widest">
          {roadmap.level} Roadmap
        </div>
        <h2 className="text-[32px] font-semibold text-[#1f1f1f] tracking-tight">
          {roadmap.topic}
        </h2>
        <p className="text-[#444746] max-w-xl mx-auto leading-relaxed">
          {roadmap.overview}
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-6 p-8 bg-white rounded-[24px] shadow-sm border border-transparent hover:border-gray-100 transition-all"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f0f4f9] text-blue-600">
                <span className="text-base font-bold">{index + 1}</span>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-[#1f1f1f] leading-tight">
                  {step.title}
                </h3>
                {step.estimatedTime && (
                  <div className="flex items-center gap-1.5 text-sm text-[#444746] whitespace-nowrap bg-[#f0f4f9] px-3 py-1 rounded-full">
                    <Clock size={14} />
                    {step.estimatedTime}
                  </div>
                )}
              </div>
              
              <p className="text-[#444746] text-base leading-relaxed">
                {step.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {step.topics.map((topic, tIndex) => (
                  <span
                    key={tIndex}
                    className="px-3 py-1 bg-[#f0f4f9] text-[#444746] rounded-full text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
