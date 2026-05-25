import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Level, IntakeAnswer } from '../types';

interface IntakeFormProps {
  topic: string;
  level: Level;
  onSubmit: (answers: IntakeAnswer[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface QuestionDef {
  id: string;
  label: string;
  sublabel?: string;
  type: 'text' | 'textarea' | 'single-select' | 'multi-select';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const STATIC_QUESTIONS: QuestionDef[] = [
  {
    id: 'whyNow',
    label: 'Why this topic now?',
    sublabel: 'What triggered your interest in this subject at this particular moment?',
    type: 'text',
    placeholder: 'e.g., Changing career paths, preparing for an upcoming project...',
    required: true,
  },
  {
    id: 'learningStyle',
    label: 'Preferred learning style',
    sublabel: 'Since we focus on text-based roadmaps, select your structural layout preferences:',
    type: 'multi-select',
    options: [
      'Concise Outlines & Key Milestones',
      'Deep Conceptual Explanations',
      'Action-Oriented Practice & Exercises',
      'Key Terms & Quick References'
    ],
    required: true,
  },
  {
    id: 'previousExposure',
    label: 'Previous exposure',
    sublabel: 'How familiar are you with this topic already?',
    type: 'single-select',
    options: [
      'Beginner: Completely new to this',
      'Novice: Know some basic concepts',
      'Intermediate: Have built some small projects',
      'Advanced: Professional level, looking to refine'
    ],
    required: true,
  },
  {
    id: 'primaryGoal',
    label: 'Primary goal',
    sublabel: 'What is your ultimate objective after learning this?',
    type: 'text',
    placeholder: 'e.g., Build a SaaS product, pass a technical interview, write an essay...',
    required: true,
  },
  {
    id: 'successDefinition',
    label: 'Success definition',
    sublabel: 'How will you measure your success?',
    type: 'text',
    placeholder: 'e.g., Able to build a complete app independently, explain it to a novice...',
    required: true,
  },
  {
    id: 'additionalInfo',
    label: 'Any other information you want to share?',
    sublabel: 'Share any specific constraints, tools, or contexts (optional).',
    type: 'textarea',
    placeholder: 'e.g., I have 3 hours per week, focus on backend rather than UI...',
    required: false,
  }
];

export default function IntakeForm({ topic, level, onSubmit, onCancel, isLoading }: IntakeFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('careerr_intake_answers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved answers:", e);
      }
    }
    return {
      whyNow: '',
      learningStyle: '',
      previousExposure: '',
      primaryGoal: '',
      successDefinition: '',
      additionalInfo: ''
    };
  });

  const [activeStep, setActiveStep] = useState(() => {
    const saved = localStorage.getItem('careerr_active_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [maxStepReached, setMaxStepReached] = useState(() => {
    const saved = localStorage.getItem('careerr_max_step_reached');
    return saved ? parseInt(saved, 10) : 0;
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    localStorage.setItem('careerr_intake_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('careerr_active_step', activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    localStorage.setItem('careerr_max_step_reached', maxStepReached.toString());
  }, [maxStepReached]);

  useEffect(() => {
    if (activeStep > maxStepReached) {
      setMaxStepReached(activeStep);
    }
  }, [activeStep, maxStepReached]);

  useEffect(() => {
    // Smoothly scroll the active step into center focus
    const timer = setTimeout(() => {
      if (cardRefs.current[activeStep + 1]) {
        cardRefs.current[activeStep + 1]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const currentQuestion = STATIC_QUESTIONS[activeStep];
    const val = answers[currentQuestion.id] || '';
    if (currentQuestion.required && !val.trim()) {
      return; // Stop if required and empty
    }

    if (activeStep < STATIC_QUESTIONS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Completed last step! Trigger submit
      handleSubmitAll();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= maxStepReached) {
      setActiveStep(index);
    }
  };

  const handleSubmitAll = () => {
    const formattedAnswers: IntakeAnswer[] = STATIC_QUESTIONS.map(q => ({
      question: q.label,
      answer: answers[q.id] || '(No answer provided)'
    }));
    onSubmit(formattedAnswers);
  };

  const isCurrentStepValid = () => {
    const currentQuestion = STATIC_QUESTIONS[activeStep];
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id] || '';
    return val.trim().length > 0;
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 pb-24 relative">
      <div className="flex flex-col">
        
        {/* Step 0: Goal Summary Card (Visual Root of the Thread) */}
        <div className="flex gap-6 items-stretch" ref={el => { cardRefs.current[0] = el; }}>
          <div className="flex flex-col items-center">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-100 flex-shrink-0"
              title="Edit initial goal"
            >
              <Check className="w-5 h-5" />
            </button>
            <div className="w-[2px] flex-grow bg-blue-600 my-2" />
          </div>
          <div className="flex-grow pb-8 text-left">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-250 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Goal Topic & Mode</span>
                <h3 className="text-xl font-semibold text-[#1f1f1f]">{topic}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-[#444746] font-medium bg-[#f0f4f9] px-3 py-1 rounded-full">
                    {level} Mode
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Edit Goal
              </button>
            </div>
          </div>
        </div>

        {/* 6 Customization Questions */}
        {STATIC_QUESTIONS.map((question, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isPending = index > activeStep;
          const isVisited = index <= maxStepReached;

          const val = answers[question.id] || '';

          return (
            <div 
              key={question.id} 
              className="flex gap-6 items-stretch"
              ref={el => { cardRefs.current[index + 1] = el; }}
            >
              {/* Timeline Connector Column */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 relative">
                  {isCompleted ? (
                    <button
                      onClick={() => handleStepClick(index)}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title={`Go back to step ${index + 1}`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : isActive ? (
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60" />
                      <div className="relative w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled={!isVisited}
                      onClick={() => handleStepClick(index)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isVisited 
                          ? 'bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-600' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </button>
                  )}
                </div>
                {index < STATIC_QUESTIONS.length - 1 && (
                  <div className={`w-[2px] flex-grow my-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>

              {/* Card Container Column */}
              <div className="flex-grow pb-8 text-left">
                <motion.div
                  onClick={() => !isActive && isVisited && handleStepClick(index)}
                  className={`bg-white rounded-[24px] p-6 shadow-sm border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-500 shadow-md scale-[1.01]' 
                      : isVisited 
                        ? 'border-gray-200 hover:border-gray-300 cursor-pointer opacity-85' 
                        : 'border-gray-100 opacity-40 select-none pointer-events-none'
                  }`}
                >
                  {/* Step Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        Question {index + 1} of {STATIC_QUESTIONS.length}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#1f1f1f]">{question.label}</h4>
                    {question.sublabel && (
                      <p className="text-xs text-[#444746] mt-0.5 leading-relaxed">{question.sublabel}</p>
                    )}
                  </div>

                  {/* Step Input Content (Only visible if active or showing summary when completed) */}
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 pt-2"
                        onClick={(e) => e.stopPropagation()} // Prevent card click triggering card click handler
                      >
                        {/* Render Input controls based on question type */}
                        {question.type === 'text' && (
                          <div className="relative">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                              placeholder={question.placeholder}
                              autoFocus
                              required={question.required}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (isCurrentStepValid()) handleNext();
                                }
                              }}
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 placeholder:text-slate-400"
                            />
                            <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-medium hidden md:block">
                              Press Enter ↵
                            </div>
                          </div>
                        )}

                        {question.type === 'textarea' && (
                          <div className="relative">
                            <textarea
                              value={val}
                              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                              placeholder={question.placeholder}
                              autoFocus
                              rows={3}
                              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 placeholder:text-slate-400 resize-none"
                            />
                          </div>
                        )}

                        {question.type === 'single-select' && (
                          <div className="flex flex-col gap-2.5">
                            {question.options?.map((option) => {
                              const isSelected = val === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setAnswers({ ...answers, [question.id]: option });
                                    setTimeout(() => {
                                      if (index < STATIC_QUESTIONS.length - 1) {
                                        setActiveStep(index + 1);
                                      }
                                    }, 250);
                                  }}
                                  className={`w-full px-4 py-3.5 text-left border rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-sm ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold shadow-sm'
                                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                                  }`}
                                >
                                  <span>{option}</span>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {question.type === 'multi-select' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {question.options?.map((option) => {
                              const selectedList = val ? val.split(', ') : [];
                              const isSelected = selectedList.includes(option);

                              const toggleOption = () => {
                                let newList;
                                if (isSelected) {
                                  newList = selectedList.filter(o => o !== option);
                                } else {
                                  newList = [...selectedList, option];
                                }
                                setAnswers({ ...answers, [question.id]: newList.join(', ') });
                              };

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={toggleOption}
                                  className={`px-4 py-3.5 text-left border rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-sm ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold shadow-sm'
                                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                                  }`}
                                >
                                  <span className="leading-tight">{option}</span>
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Navigation Actions within the active card */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={index === 0}
                            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            Back
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleNext()}
                            disabled={!isCurrentStepValid()}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            {index === STATIC_QUESTIONS.length - 1 ? 'Finish Profile' : 'Continue'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </motion.div>
                    ) : isVisited ? (
                      <motion.div
                        key="summary-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-slate-600 font-medium bg-slate-50/70 border border-slate-100 px-4 py-2.5 rounded-xl inline-block"
                      >
                        {val || <span className="text-slate-400 italic">No answer provided</span>}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          );
        })}

        {/* Generate Button Container at the bottom */}
        {maxStepReached === STATIC_QUESTIONS.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-6 pl-16 text-center"
          >
            <div className="max-w-md space-y-4">
              <p className="text-sm text-slate-500">
                Your roadmap preferences are set! We will construct a custom path suited to your goal and mode.
              </p>
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={isLoading}
                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
                    Generate Personal Roadmap
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
