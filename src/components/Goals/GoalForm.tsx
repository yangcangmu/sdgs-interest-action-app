'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Goal, Cadence, Locale } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { X, Target } from 'lucide-react';

interface GoalFormProps {
  locale: Locale;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onSaveDraft?: (goal: Partial<Goal>) => void;
  initialGoal?: Partial<Goal>;
  isEditing?: boolean;
}

const SDG_OPTIONS = [
  { value: 1, label: '貧困をなくそう', color: 'bg-red-500' },
  { value: 2, label: '飢餓をゼロに', color: 'bg-orange-500' },
  { value: 3, label: 'すべての人に健康と福祉を', color: 'bg-green-500' },
  { value: 4, label: '質の高い教育をみんなに', color: 'bg-red-600' },
  { value: 5, label: 'ジェンダー平等を実現しよう', color: 'bg-orange-600' },
  { value: 6, label: '安全な水とトイレを世界中に', color: 'bg-cyan-500' },
  { value: 7, label: 'エネルギーをみんなに そしてクリーンに', color: 'bg-yellow-500' },
  { value: 8, label: '働きがいも経済成長も', color: 'bg-red-700' },
  { value: 9, label: '産業と技術革新の基盤をつくろう', color: 'bg-orange-700' },
  { value: 10, label: '人や国の不平等をなくそう', color: 'bg-pink-500' },
  { value: 11, label: '住み続けられるまちづくりを', color: 'bg-orange-500' },
  { value: 12, label: 'つくる責任 つかう責任', color: 'bg-yellow-600' },
  { value: 13, label: '気候変動に具体的な対策を', color: 'bg-green-600' },
  { value: 14, label: '海の豊かさを守ろう', color: 'bg-blue-500' },
  { value: 15, label: '陸の豊かさも守ろう', color: 'bg-green-700' },
  { value: 16, label: '平和と公正をすべての人に', color: 'bg-blue-600' },
  { value: 17, label: 'パートナーシップで目標を達成しよう', color: 'bg-blue-700' },
];

const GoalForm = React.memo(function GoalForm({ 
  locale, 
  onSave, 
  onCancel, 
  onSaveDraft,
  initialGoal,
  isEditing = false 
}: GoalFormProps) {
  const { t } = useTranslation(locale);
  
  console.log('GoalForm initialized with initialGoal:', initialGoal);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sdgTags: [],
    cadence: 'daily' as Cadence,
    targetPerWeek: 1,
    startAt: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  // initialGoalが変更された時にフォームデータを更新
  useEffect(() => {
    if (initialGoal) {
      console.log('Updating form data with initialGoal:', initialGoal);
      setFormData({
        title: initialGoal.title || '',
        description: initialGoal.description || '',
        sdgTags: initialGoal.sdgTags || [],
        cadence: (initialGoal.cadence || 'daily') as Cadence,
        targetPerWeek: initialGoal.targetPerWeek || 1,
        startAt: initialGoal.startAt ? 
          (initialGoal.startAt instanceof Date ? 
            initialGoal.startAt.toISOString().split('T')[0] : 
            new Date(initialGoal.startAt).toISOString().split('T')[0]) : 
          new Date().toISOString().split('T')[0],
        isActive: initialGoal.isActive ?? true,
      });
    }
  }, [initialGoal]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((field: string, value: string | number | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // ドラフトを保存（日付は文字列として保存）
    if (onSaveDraft) {
      const draftData = {
        ...newFormData,
        startAt: newFormData.startAt instanceof Date ? 
          newFormData.startAt : 
          new Date(newFormData.startAt)
      };
      onSaveDraft(draftData);
    }
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formData, onSaveDraft, errors]);

  const handleSdgTagToggle = (sdgValue: number) => {
    const newFormData = {
      ...formData,
      sdgTags: formData.sdgTags.includes(sdgValue)
        ? formData.sdgTags.filter(tag => tag !== sdgValue)
        : [...formData.sdgTags, sdgValue]
    };
    setFormData(newFormData);
    
    // ドラフトを保存（日付は文字列として保存）
    if (onSaveDraft) {
      const draftData = {
        ...newFormData,
        startAt: newFormData.startAt instanceof Date ? 
          newFormData.startAt : 
          new Date(newFormData.startAt)
      };
      onSaveDraft(draftData);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('goals.validation.titleRequired');
    }

    if (formData.sdgTags.length === 0) {
      newErrors.sdgTags = t('goals.validation.sdgRequired');
    }

    if (formData.cadence === 'weekly' && (!formData.targetPerWeek || formData.targetPerWeek < 1)) {
      newErrors.targetPerWeek = t('goals.validation.targetRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const goalData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      sdgTags: formData.sdgTags,
      cadence: formData.cadence,
      targetPerWeek: formData.cadence === 'weekly' ? formData.targetPerWeek : undefined,
      startAt: new Date(formData.startAt),
      isActive: formData.isActive,
    };

    onSave(goalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? t('goals.editGoal') : t('goals.createGoal')}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.goalTitle')} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('goals.placeholders.title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.goalDescription')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder={t('goals.placeholders.description')}
              />
            </div>

            {/* SDGタグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.sdgTags')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {SDG_OPTIONS.map((sdg) => (
                  <button
                    key={sdg.value}
                    type="button"
                    onClick={() => handleSdgTagToggle(sdg.value)}
                    className={`flex items-center p-2 rounded-lg border-2 transition-all ${
                      formData.sdgTags.includes(sdg.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${sdg.color}`} />
                    <span className="text-xs font-medium">SDG {sdg.value}</span>
                  </button>
                ))}
              </div>
              {errors.sdgTags && (
                <p className="mt-1 text-sm text-red-600">{errors.sdgTags}</p>
              )}
            </div>

            {/* 頻度と目標 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('goals.cadence')} *
                </label>
                <select
                  value={formData.cadence}
                  onChange={(e) => handleInputChange('cadence', e.target.value as Cadence)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="daily">{t('goals.cadenceOptions.daily')}</option>
                  <option value="weekly">{t('goals.cadenceOptions.weekly')}</option>
                </select>
              </div>

              {formData.cadence === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('goals.targetPerWeek')} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetPerWeek}
                    onChange={(e) => handleInputChange('targetPerWeek', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      errors.targetPerWeek ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.targetPerWeek && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetPerWeek}</p>
                  )}
                </div>
              )}
            </div>

            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.startDate')} *
              </label>
              <input
                type="date"
                value={formData.startAt}
                onChange={(e) => handleInputChange('startAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            {/* アクティブ状態 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                {t('goals.isActive')}
              </label>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Target className="w-4 h-4 mr-2" />
                {isEditing ? t('goals.saveGoal') : t('goals.createGoal')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default GoalForm;
