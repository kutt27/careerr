import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Plus, Settings2, Mic } from 'lucide-react';
import { Level } from '../types';
import { motion } from 'motion/react';

interface RoadmapInputProps {
  onGenerate: (topic: string, level: Level) => void;
  isLoading: boolean;
  readOnly?: boolean;
  onEdit?: () => void;
  initialTopic?: string;
  initialLevel?: Level;
}

const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

export default function RoadmapInput({ 
  onGenerate, 
  isLoading, 
  readOnly = false, 
  onEdit, 
  initialTopic = '', 
  initialLevel = 'Beginner' 
}: RoadmapInputProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [level, setLevel] = useState<Level>(initialLevel);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    setLevel(initialLevel);
  }, [initialLevel]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [topic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic.trim(), level);
    }
  };

  if (readOnly) {
    return (
      <div className="w-full max-w-[800px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-[24px] p-6 shadow-sm border border-gray-200 flex items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-1 align-left text-left">
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Goal Topic & Level</span>
            <h3 className="text-xl font-semibold text-[#1f1f1f]">{topic}</h3>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-[#444746] font-medium bg-[#f0f4f9] px-3 py-1 rounded-full">
                {level} Level
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Edit Goal
          </button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <div className="mb-8 space-y-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-[2px] opacity-80" />
          <span className="text-[#444746] font-medium">Hi there</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[44px] md:text-[56px] font-medium text-[#1f1f1f] leading-tight tracking-tight"
        >
          Where should we start?
        </motion.h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-[28px] p-4 shadow-sm hover:shadow-md transition-all border border-transparent focus-within:border-gray-200"
      >
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ask careerr"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none px-4 pt-2 pb-16 text-lg text-[#1f1f1f] placeholder-[#444746] min-h-[60px] max-h-[400px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button type="button" className="p-2.5 text-[#444746] hover:bg-gray-100 rounded-full transition-colors">
                <Plus size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative inline-block">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="appearance-none bg-transparent border-none py-2 pl-4 pr-10 text-sm font-medium text-[#444746] cursor-pointer outline-none hover:bg-gray-100 rounded-full transition-colors"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#444746]">
                  <ChevronDown size={14} />
                </div>
              </div>

              <button type="button" className="p-2.5 text-[#444746] hover:bg-gray-100 rounded-full transition-colors">
                <Mic size={20} />
              </button>

              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="p-2.5 text-[#444746] hover:bg-gray-100 disabled:opacity-30 rounded-full transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Suggestion Chips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap gap-3 justify-center"
      >
        {['Learn React', 'Python Roadmap', 'Career in AI', 'Digital Marketing'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setTopic(suggestion)}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#444746] text-sm font-medium rounded-full transition-all shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
