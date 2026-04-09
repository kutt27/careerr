/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import RoadmapInput from './components/RoadmapInput';
import RoadmapDisplay from './components/RoadmapDisplay';
import IntakeForm from './components/IntakeForm';
import { Roadmap, Level, IntakeQuestions, IntakeAnswer } from './types';
import { generateRoadmap } from './services/geminiService';
import { getIntakeQuestions } from './services/groqService';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<string>('');
  const [level, setLevel] = useState<Level | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [intake, setIntake] = useState<IntakeQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialGenerate = async (topic: string, level: Level) => {
    setIsLoading(true);
    setError(null);
    setTopic(topic);
    setLevel(level);
    try {
      const result = await getIntakeQuestions(topic, level);
      setIntake(result);
      setRoadmap(null); // Clear roadmap if we are re-generating
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntakeSubmit = async (answers: IntakeAnswer[]) => {
    if (!level) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateRoadmap(topic, level, answers);
      setRoadmap(result);
      setIntake(null); // Done with intake
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelIntake = () => {
    setIntake(null);
    setTopic('');
    setLevel(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col justify-center py-12">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          {!intake && !roadmap && (
            <RoadmapInput onGenerate={handleInitialGenerate} isLoading={isLoading} />
          )}

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
                  {intake ? "Building your personalized roadmap..." : "Analyzing your needs..."}
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

            {intake && !roadmap && !isLoading && (
              <IntakeForm 
                intake={intake} 
                onSubmit={handleIntakeSubmit} 
                onCancel={handleCancelIntake}
                isLoading={isLoading} 
              />
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

