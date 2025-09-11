'use client';

import React, { useState, useEffect } from 'react';
import { Question, QuizSubmission, Locale } from '@/types';
import { useTranslation } from '@/lib/i18n';
import QuizCard from './QuizCard';
import LoadingSpinner from '../common/LoadingSpinner';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface QuizContainerProps {
  questions: Question[];
  locale: Locale;
  onComplete: (submissions: QuizSubmission[]) => void;
  onError: (error: string) => void;
  onLocaleChange?: (locale: Locale) => void;
}

interface Answer {
  questionId: string;
  optionId: string;
  intensity: number;
}

export default function QuizContainer({
  questions,
  locale,
  onComplete,
  onError,
  onLocaleChange,
}: QuizContainerProps) {
  const { t } = useTranslation(locale);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // 現在の質問の回答を取得
  const currentAnswer = answers.get(currentQuestion.id);

  const handleAnswer = (questionId: string, optionId: string, intensity: number) => {
    setAnswers(prev => new Map(prev).set(questionId, {
      questionId,
      optionId,
      intensity,
    }));
  };

  const handleSkip = (questionId: string) => {
    setSkippedQuestions(prev => new Set(prev).add(questionId));
    // スキップした質問の回答を削除
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.delete(questionId);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 最後の質問の場合、クイズを完了
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // 回答をQuizSubmission形式に変換
      const submissions: QuizSubmission[] = Array.from(answers.values()).map(answer => ({
        questionId: answer.questionId,
        optionId: answer.optionId,
        intensity: answer.intensity as 0 | 1 | 2 | 3,
      }));

      onComplete(submissions);
    } catch (error) {
      console.error('Error completing quiz:', error);
      onError(t('errors.serverError'));
    } finally {
      setIsLoading(false);
    }
  };

  const canGoNext = currentQuestionIndex < totalQuestions - 1;
  const canGoPrevious = currentQuestionIndex > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('errors.notFound')}
          </h2>
          <p className="text-gray-600">
            {t('errors.notFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 言語切り替えボタン */}
      {onLocaleChange && (
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher 
            locale={locale} 
            onLocaleChange={onLocaleChange}
          />
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div
          key={currentQuestionIndex}
          className="animate-fade-in"
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <QuizCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            locale={locale}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            initialAnswer={currentAnswer ? {
              optionId: currentAnswer.optionId,
              intensity: currentAnswer.intensity as 0 | 1 | 2 | 3,
            } : undefined}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
