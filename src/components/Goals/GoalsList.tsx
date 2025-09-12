'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Goal, Checkin, Locale } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { Plus, Edit, Trash2, Calendar, Target, CheckCircle, Circle } from 'lucide-react';
import GoalForm from './GoalForm';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface GoalsListProps {
  locale: Locale;
  sessionId: string;
  onLocaleChange?: (locale: Locale) => void;
}

export default function GoalsList({ locale, sessionId, onLocaleChange }: GoalsListProps) {
  const { t } = useTranslation(locale);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 目標を取得
  const fetchGoals = useCallback(async () => {
    try {
      const response = await fetch(`/api/goals?sessionId=${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setGoals(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to fetch goals');
    }
  }, [sessionId]);

  // チェックインを取得
  const fetchCheckins = useCallback(async () => {
    try {
      const response = await fetch(`/api/checkins?sessionId=${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setCheckins(data.data);
      }
    } catch (err) {
      console.error('Error fetching checkins:', err);
    }
  }, [sessionId]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchGoals(), fetchCheckins()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [sessionId, fetchGoals, fetchCheckins]);

  // 目標を作成
  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goalData, sessionId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGoals(prev => [...prev, data.data]);
        setShowGoalForm(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      setError('Failed to create goal');
    }
  };

  // 目標を更新
  const handleUpdateGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingGoal) return;

    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goalData, id: editingGoal.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGoals(prev => prev.map(goal => 
          goal.id === editingGoal.id ? data.data : goal
        ));
        setEditingGoal(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  };

  // 目標を削除
  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm(t('goals.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        setCheckins(prev => prev.filter(checkin => checkin.goalId !== goalId));
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  // チェックインを切り替え
  const handleToggleCheckin = async (goalId: string, date: string) => {
    const existingCheckin = checkins.find(
      c => c.goalId === goalId && c.date === date
    );

    try {
      if (existingCheckin) {
        // 既存のチェックインを更新
        const response = await fetch('/api/checkins', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existingCheckin.id,
            completed: !existingCheckin.completed,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setCheckins(prev => prev.map(c => 
            c.id === existingCheckin.id ? data.data : c
          ));
        }
      } else {
        // 新しいチェックインを作成
        const response = await fetch('/api/checkins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId,
            date,
            completed: true,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setCheckins(prev => [...prev, data.data]);
        }
      }
    } catch (err) {
      console.error('Error toggling checkin:', err);
    }
  };

  // 今日の日付
  const today = new Date().toISOString().split('T')[0];

  // 過去7日間の日付配列
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('goals.title')}</h1>
        <div className="flex items-center space-x-4">
          {onLocaleChange && (
            <LanguageSwitcher 
              locale={locale} 
              onLocaleChange={onLocaleChange}
            />
          )}
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('goals.createGoal')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t('goals.noGoals')}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('goals.createFirstGoal')}
          </p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('goals.createFirstGoal')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {goal.sdgTags.map((sdg) => (
                      <span
                        key={sdg}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        SDG {sdg}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-4">
                      {goal.cadence === 'daily' ? '毎日' : '毎週'}
                      {goal.cadence === 'weekly' && ` (${goal.targetPerWeek}回)`}
                    </span>
                    <span>開始: {new Date(goal.startAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* チェックインカレンダー（過去7日間） */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t('goals.last7Days')}</h4>
                <div className="flex space-x-2">
                  {getLast7Days().map((date) => {
                    const checkin = checkins.find(
                      c => c.goalId === goal.id && c.date === date
                    );
                    const isToday = date === today;
                    
                    return (
                      <button
                        key={date}
                        onClick={() => handleToggleCheckin(goal.id, date)}
                        className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                          checkin?.completed
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : isToday
                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                        }`}
                      >
                        {checkin?.completed ? (
                          <CheckCircle className="w-5 h-5 mb-1" />
                        ) : (
                          <Circle className="w-5 h-5 mb-1" />
                        )}
                        <span className="text-xs">
                          {new Date(date).getDate()}
                        </span>
                        <span className="text-xs">
                          {new Date(date).toLocaleDateString('ja-JP', { weekday: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 目標フォーム */}
      {showGoalForm && (
        <GoalForm
          locale={locale}
          onSave={handleCreateGoal}
          onCancel={() => setShowGoalForm(false)}
        />
      )}

      {/* 編集フォーム */}
      {editingGoal && (
        <GoalForm
          locale={locale}
          onSave={handleUpdateGoal}
          onCancel={() => setEditingGoal(null)}
          initialGoal={editingGoal}
          isEditing={true}
        />
      )}
    </div>
  );
}
