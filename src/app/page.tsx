'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizSubmission, Locale, QuizResult } from '@/types';
import { useTranslation } from '@/lib/i18n';
import QuizContainer from '@/components/Quiz/QuizContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import GoalsList from '@/components/Goals/GoalsList';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [locale, setLocale] = useState<Locale>('ja');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'welcome' | 'quiz' | 'results' | 'goals'>('welcome');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { t } = useTranslation(locale);

  // 質問データを取得（初回のみ or locale変更時）
  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const response = await fetch(`${base}/api/quiz/questions`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.success && data?.data?.questions) {
          setQuestions(data.data.questions);
        } else {
          setError(data?.error || 'Failed to load questions');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(t('errors.networkError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [locale, t]);

  const handleStartQuiz = () => {
    setQuizState('quiz');
  };

  const handleQuizComplete = async (submissions: QuizSubmission[]) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissions,
          sessionId: `session_${Date.now()}`,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQuizResult(data.data);
        setQuizState('results');
      } else {
        setError(data.error || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizError = (error: string) => {
    setError(error);
  };

  const handleRetakeQuiz = () => {
    setQuizState('quiz');
    setQuizResult(null);
  };

  const handleSetGoals = () => {
    setQuizState('goals');
  };

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    // 言語変更時は質問を再取得
    setQuestions([]);
    didFetchRef.current = false;
  };

  if (isLoading && quizState === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'quiz') {
    return (
      <QuizContainer
        questions={questions}
        locale={locale}
        onComplete={handleQuizComplete}
        onError={handleQuizError}
        onLocaleChange={handleLocaleChange}
      />
    );
  }

  if (quizState === 'goals') {
    return (
      <GoalsList
        locale={locale}
        sessionId={`session_${Date.now()}`}
        onLocaleChange={handleLocaleChange}
      />
    );
  }


  if (quizState === 'results' && quizResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 言語切り替えボタン */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher 
            locale={locale} 
            onLocaleChange={handleLocaleChange}
          />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
              {t('results.title')}
            </h1>
            
            {/* 全体スコア */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {t('results.overallScore')}
              </h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {quizResult.overall_interest}
                </div>
                <div className="text-gray-800">/ 100</div>
              </div>
            </div>

            {/* SDGプロフィール */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t('results.sdgProfile')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(quizResult.sdg_scores_norm).map(([sdg, score]) => (
                  <div key={sdg} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">SDG {sdg}</span>
                      <span className="text-lg font-bold text-blue-700">{score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top3 & Bottom3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {t('results.top3')}
                </h3>
                <div className="space-y-2">
                  {quizResult.top3.map((sdg) => (
                    <div key={sdg} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-semibold text-gray-900">SDG {sdg}</span>
                      <span className="text-green-700 font-bold">
                        {quizResult.sdg_scores_norm[sdg.toString()]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {t('results.bottom3')}
                </h3>
                <div className="space-y-2">
                  {quizResult.bottom3.map((sdg) => (
                    <div key={sdg} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">SDG {sdg}</span>
                      <span className="text-gray-800 font-bold">
                        {quizResult.sdg_scores_norm[sdg.toString()]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* アクション推奨 */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t('results.actionRecommendations')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizResult.actionRecommendations.map((action) => (
                  <div key={action.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {action.title[locale]}
                    </h3>
                    <p className="text-sm text-gray-800 mb-3">
                      {action.description[locale]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-700 font-medium">
                        {action.estimatedTime}
                      </span>
                      <span className="text-xs text-gray-700">
                        {action.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSetGoals}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('results.setGoals')}
              </button>
              <button
                onClick={handleRetakeQuiz}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                {t('results.retakeQuiz')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ウェルカム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 言語切り替えボタン */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher 
          locale={locale} 
          onLocaleChange={handleLocaleChange}
        />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🌍 {t('onboarding.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('onboarding.description')}
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('quiz.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('quiz.subtitle')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
                <div className="text-gray-600">{t('onboarding.features.questions')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3-5</div>
                <div className="text-gray-600">{t('onboarding.features.time')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">17</div>
                <div className="text-gray-600">{t('onboarding.features.analysis')}</div>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {t('onboarding.startQuiz')}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            {t('onboarding.consent')}
          </div>
        </div>
      </div>
    </div>
  );
}
