import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, ArrowRight, X } from 'lucide-react';
import { IntakeQuestions, IntakeAnswer } from '../types';

interface IntakeFormProps {
  intake: IntakeQuestions;
  onSubmit: (answers: IntakeAnswer[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function IntakeForm({ intake, onSubmit, onCancel, isLoading }: IntakeFormProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(intake.questions.length).fill(''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswers: IntakeAnswer[] = intake.questions.map((q, i) => ({
      question: q,
      answer: answers[i]
    }));
    onSubmit(formattedAnswers);
  };

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-blue-50/50 overflow-hidden relative">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-[2px] opacity-80" />
            <h2 className="text-2xl font-bold tracking-tight">Personalizing Your Journey</h2>
          </div>
          <p className="text-blue-100 leading-relaxed max-w-lg">
            {intake.summary}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            {intake.questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-slate-700 ml-1">
                  {question}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all duration-200 text-slate-700 placeholder:text-slate-400 group-hover:border-slate-200"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || answers.some(a => !a.trim())}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-slate-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Generate Final Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
