"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import { useLearningStore } from "@/lib/store";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Props {
  topicSlug: string;
  questions: Question[];
}

export function QuizBlock({ topicSlug, questions }: Props) {
  const { setQuizScore, markComplete } = useLearningStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = questions[currentQ];
  const isAnswered = answers[currentQ] !== null;
  const isCorrect = answers[currentQ] === question.correct;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    setSelected(idx);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      const score = answers.filter((a, i) => a === questions[i].correct).length;
      const percentage = Math.round((score / questions.length) * 100);
      setQuizScore(topicSlug, percentage);
      if (percentage >= 70) {
        markComplete(topicSlug);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowResults(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#1e293b] bg-[#111827] overflow-hidden my-8"
      >
        {showConfetti && <Confetti />}
        <div className="p-6 text-center">
          <Trophy className={`w-12 h-12 mx-auto mb-4 ${percentage >= 70 ? "text-[#f59e0b]" : "text-[#475569]"}`} />
          <h3 className="text-xl font-bold font-heading text-[#f1f5f9] mb-2">
            {percentage >= 100 ? "Perfect Score!" : percentage >= 70 ? "Great Job!" : "Keep Practicing"}
          </h3>
          <div className="text-4xl font-bold gradient-text mb-4 font-heading">
            {score}/{questions.length}
          </div>
          <p className="text-[#94a3b8] text-sm mb-6">
            {percentage >= 70 ? "Topic marked as complete! 🎉" : "Review the material and try again."}
          </p>

          <div className="space-y-3 text-left mb-6">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.correct;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${correct ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"}`}>
                  {correct ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs text-[#f1f5f9] font-medium">{q.question}</div>
                    {!correct && (
                      <div className="text-xs text-[#94a3b8] mt-1">
                        Correct: <span className="text-[#10b981]">{q.options[q.correct]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#111827] overflow-hidden my-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#f59e0b]" />
          <span className="font-semibold text-[#f1f5f9] text-sm font-heading">Knowledge Check</span>
        </div>
        <span className="text-xs text-[#475569]">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1 bg-[#1e293b]">
        <div
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] transition-all duration-300"
          style={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-[#f1f5f9] font-medium mb-5 leading-relaxed">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {question.options.map((option, idx) => {
                const isSelected = selected === idx || answers[currentQ] === idx;
                const isRight = idx === question.correct;
                let optionStyle = "border-[#1e293b] bg-[#1a2332] text-[#94a3b8] hover:border-[#3b82f6]/40 hover:text-[#f1f5f9]";

                if (isAnswered) {
                  if (isRight) optionStyle = "border-[#10b981] bg-[#10b981]/10 text-[#10b981]";
                  else if (isSelected && !isRight) optionStyle = "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]";
                  else optionStyle = "border-[#1e293b] bg-[#111827] text-[#475569] opacity-50";
                } else if (isSelected) {
                  optionStyle = "border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${optionStyle} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                      {isAnswered && isRight && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />}
                      {isAnswered && isSelected && !isRight && <XCircle className="w-4 h-4 ml-auto shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-sm mb-5 ${isCorrect ? "bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]" : "bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]"}`}
                >
                  <strong>{isCorrect ? "Correct! " : "Not quite. "}</strong>
                  <span className="text-[#94a3b8]">{question.explanation}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * window.innerWidth - window.innerWidth / 2, opacity: 1 }}
          animate={{ y: window.innerHeight + 20, opacity: 0, rotate: Math.random() * 360 }}
          transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"][Math.floor(Math.random() * 5)] }}
        />
      ))}
    </div>
  );
}
