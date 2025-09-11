'use client';

import React, { useState } from 'react';
import { Question, Option, Intensity, Locale } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  locale: Locale;
  onAnswer: (questionId: string, optionId: string, intensity: Intensity) => void;
  onSkip: (questionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  initialAnswer?: {
    optionId: string;
    intensity: Intensity;
  };
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  locale,
  onAnswer,
  onSkip,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  initialAnswer,
}: QuizCardProps) {
  const { t } = useTranslation(locale);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialAnswer?.optionId || null
  );
  const [intensity, setIntensity] = useState<Intensity>(
    initialAnswer?.intensity || 1
  );
  const [showIntensitySlider, setShowIntensitySlider] = useState(
    !!initialAnswer?.optionId
  );

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowIntensitySlider(true);
  };

  const handleIntensityChange = (value: number) => {
    const intensityValue = Math.max(0, Math.min(3, value)) as Intensity;
    setIntensity(intensityValue);
  };

  const handleNext = () => {
    if (selectedOption) {
      onAnswer(question.id, selectedOption, intensity);
    }
    // 少し遅延してから次の問題に遷移（ユーザーにフィードバックを提供）
    setTimeout(() => {
      onNext();
    }, 200);
  };

  const handleSkip = () => {
    onSkip(question.id);
    onNext();
  };

  const intensityLabels = {
    0: t('quiz.intensityLabels.0'),
    1: t('quiz.intensityLabels.1'),
    2: t('quiz.intensityLabels.2'),
    3: t('quiz.intensityLabels.3'),
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* プログレスバー */}
      <div className="mb-8">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-lg font-semibold text-gray-800">
                   {questionNumber}/{totalQuestions}
                 </span>
          <span className="text-lg font-semibold text-blue-600">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
               <div className="mt-2 text-center">
                 <span className="text-sm text-gray-600">
                   {questionNumber === totalQuestions ? t('quiz.lastQuestion') : t('quiz.nextQuestionHint')}
                 </span>
               </div>
      </div>

      {/* 質問カード */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {question.title[locale]}
        </h2>

        {/* 選択肢 */}
        <div className="space-y-4 mb-8">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedOption === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
                <span className="text-lg font-medium">{option.label[locale]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 強度スライダー */}
        {showIntensitySlider && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('quiz.intensity')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('quiz.intensityDescription')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 w-20">
                  {intensityLabels[intensity]}
                </span>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={intensity}
                  onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-lg font-bold text-blue-600 w-8 text-center">
                  {intensity}
                </span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('common.previous')}
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSkip}
            className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            {t('quiz.skipQuestion')}
          </button>

          {selectedOption && (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {questionNumber === totalQuestions ? t('quiz.submitQuiz') : t('common.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
