import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RoadmapInput from './components/RoadmapInput';
import RoadmapDisplay from './components/RoadmapDisplay';
import IntakeForm from './components/IntakeForm';
import { Roadmap, Level, IntakeAnswer } from './types';
import { generateRoadmap } from './services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState<string>(() => {
    return localStorage.getItem('careerr_topic') || '';
  });
  const [level, setLevel] = useState<Level | null>(() => {
    return (localStorage.getItem('careerr_level') as Level) || null;
  });
  const [roadmap, setRoadmap] = useState<Roadmap | null>(() => {
    const saved = localStorage.getItem('careerr_roadmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.phases) && parsed.phases.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved roadmap:", e);
      }
    }
    return null;
  });
  const [showIntake, setShowIntake] = useState<boolean>(() => {
    return localStorage.getItem('careerr_show_intake') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (topic) {
      localStorage.setItem('careerr_topic', topic);
    } else {
      localStorage.removeItem('careerr_topic');
    }
  }, [topic]);

  useEffect(() => {
    if (level) {
      localStorage.setItem('careerr_level', level);
    } else {
      localStorage.removeItem('careerr_level');
    }
  }, [level]);

  useEffect(() => {
    localStorage.setItem('careerr_show_intake', showIntake.toString());
  }, [showIntake]);

  useEffect(() => {
    if (roadmap) {
      localStorage.setItem('careerr_roadmap', JSON.stringify(roadmap));
    } else {
      localStorage.removeItem('careerr_roadmap');
    }
  }, [roadmap]);

  const handleInitialGenerate = async (topic: string, level: Level) => {
    setTopic(topic);
    setLevel(level);
    setError(null);
    setRoadmap(null); // Clear roadmap if we are re-generating
    localStorage.removeItem('careerr_intake_answers');
    localStorage.removeItem('careerr_active_step');
    localStorage.removeItem('careerr_max_step_reached');

    if (level === 'Quick') {
      setShowIntake(false);
      setIsLoading(true);
      try {
        const result = await generateRoadmap(topic, level, []);
        console.log('generateRoadmap result:', result);
        console.log('result.phases:', result?.phases);
        console.log('result keys:', Object.keys(result || {}));
        if (result && Array.isArray(result.phases) && result.phases.length > 0) {
          setRoadmap(result);
        } else {
          setError(`Received invalid roadmap (phases: ${Array.isArray(result?.phases) ? result.phases.length : 'not an array'}, keys: ${Object.keys(result || {}).join(',')})`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowIntake(true);
    }
  };

  const handleIntakeSubmit = async (answers: IntakeAnswer[]) => {
    if (!level) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateRoadmap(topic, level, answers);
      if (result && Array.isArray(result.phases) && result.phases.length > 0) {
        setRoadmap(result);
      } else {
        setError('Received an invalid roadmap from the AI. Please try again.');
      }
      setShowIntake(false); // Done with intake
      localStorage.removeItem('careerr_intake_answers');
      localStorage.removeItem('careerr_active_step');
      localStorage.removeItem('careerr_max_step_reached');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelIntake = () => {
    setShowIntake(false);
    localStorage.removeItem('careerr_intake_answers');
    localStorage.removeItem('careerr_active_step');
    localStorage.removeItem('careerr_max_step_reached');
  };

  const handleReset = () => {
    setRoadmap(null);
    setShowIntake(false);
    setTopic('');
    setLevel(null);
    localStorage.removeItem('careerr_topic');
    localStorage.removeItem('careerr_level');
    localStorage.removeItem('careerr_show_intake');
    localStorage.removeItem('careerr_roadmap');
    localStorage.removeItem('careerr_intake_answers');
    localStorage.removeItem('careerr_active_step');
    localStorage.removeItem('careerr_max_step_reached');
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f4f9] flex flex-col">
      <Header onLogoClick={handleReset} />

      <main className="grow flex flex-col justify-center py-12">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          {!showIntake && !roadmap && (
            <RoadmapInput
              onGenerate={handleInitialGenerate}
              isLoading={isLoading}
              initialTopic={topic}
              initialLevel={level || 'Quick'}
            />
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
                  {level === 'Quick' ? "Building your 80/20 roadmap..." : showIntake ? "Building your personalized roadmap..." : "Analyzing your needs..."}
                </p>
              </motion.div>
            )}

          </AnimatePresence>

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-650 text-sm"
            >
              <AlertCircle size={18} />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {showIntake && !roadmap && !isLoading && (
            <IntakeForm
              topic={topic}
              level={level || 'Planning'}
              onSubmit={handleIntakeSubmit}
              onCancel={handleCancelIntake}
              isLoading={isLoading}
            />
          )}

          {roadmap && !isLoading && (
            <div className="px-4">
              <RoadmapDisplay roadmap={roadmap} onReset={handleReset} onUpdateRoadmap={setRoadmap} />
            </div>
          )}
        </div>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-[#444746] text-xs">
          <p>Careerr © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
