/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import RoadmapInput from './components/RoadmapInput';
import RoadmapDisplay from './components/RoadmapDisplay';
import { Roadmap, Level } from './types';
import { generateRoadmap } from './services/geminiService';
import { analyzeTopic } from './services/groqService';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (topic: string, level: Level) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeTopic(topic, level);
      const result = await generateRoadmap(topic, level, analysis);
      setRoadmap(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col justify-center py-12">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <RoadmapInput onGenerate={handleGenerate} isLoading={isLoading} />

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-[#444746] text-sm font-medium">
                  Generating your roadmap...
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            {roadmap && !isLoading && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4"
              >
                <RoadmapDisplay roadmap={roadmap} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-[#444746] text-xs">
          <p>© {new Date().getFullYear()} careerr. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}

