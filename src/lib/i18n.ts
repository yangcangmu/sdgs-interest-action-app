import { Locale } from '@/types';

// 国際化キーとメッセージの定義
export const messages = {
  ja: {
    // 共通
    common: {
      next: '次へ',
      previous: '前へ',
      submit: '送信',
      skip: 'スキップ',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      retry: '再試行',
      close: '閉じる',
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      edit: '編集',
      share: 'シェア',
      copy: 'コピー',
      back: '戻る',
    },
    
    // ナビゲーション
    nav: {
      home: 'ホーム',
      quiz: 'クイズ',
      results: '結果',
      goals: '目標',
      dashboard: 'ダッシュボード',
      profile: 'プロフィール',
      settings: '設定',
    },

    // オンボーディング
    onboarding: {
      welcome: 'SDGs関心度・行動アプリへようこそ',
      title: 'SDGs関心度・行動アプリ',
      description: 'あなたのSDGsへの関心度を測定し、具体的な行動目標を設定しましょう',
      consent: 'プライバシーポリシーに同意します',
      locale: '言語を選択してください',
      startQuiz: 'クイズを開始',
      anonymousMode: '匿名モードで開始',
      signUp: 'アカウントを作成',
      features: {
        questions: '質問',
        time: '分で完了',
        analysis: 'SDGs分析',
      },
    },

    // クイズ
    quiz: {
      title: 'SDGs関心度クイズ',
      subtitle: '25問の質問に答えて、あなたのSDGsへの関心度を測定しましょう',
      question: '質問',
      of: 'の',
      selectOption: '選択してください',
      intensity: '関心度',
      intensityDescription: '選択した内容への関心度を0-3で設定してください',
      intensityLabels: {
        0: '全く関心なし',
        1: '少し関心あり',
        2: 'かなり関心あり',
        3: '非常に強く関心あり',
      },
      skipQuestion: 'この質問をスキップ',
      nextQuestion: '次の質問',
      submitQuiz: 'クイズを完了',
      progress: '進捗',
      lastQuestion: '最後の問題です',
      nextQuestionHint: '次の問題に進みます',
    },

    // 結果
    results: {
      title: 'あなたのSDGs関心度結果',
      overallScore: '総合関心度',
      sdgProfile: 'SDG別プロフィール',
      top3: '最も関心の高いSDGs',
      bottom3: '関心の低いSDGs',
      actionRecommendations: 'おすすめアクション',
      setGoals: '目標を設定する',
      retakeQuiz: 'クイズを再受験',
      shareResults: '結果をシェア',
      downloadImage: '画像をダウンロード',
    },

    // 目標設定
    goals: {
      title: '目標設定',
      createGoal: '新しい目標を作成',
      editGoal: '目標を編集',
      goalTitle: '目標タイトル',
      goalDescription: '説明（任意）',
      sdgTags: '関連するSDGs',
      cadence: '頻度',
      cadenceOptions: {
        daily: '毎日',
        weekly: '毎週',
      },
      targetPerWeek: '週間目標回数',
      startDate: '開始日',
      isActive: 'アクティブ',
      saveGoal: '目標を保存',
      deleteGoal: '目標を削除',
      noGoals: 'まだ目標が設定されていません',
      createFirstGoal: '最初の目標を作成しましょう',
      validation: {
        titleRequired: 'タイトルは必須です',
        sdgRequired: '少なくとも1つのSDGを選択してください',
        targetRequired: '週間目標は1以上である必要があります',
      },
      placeholders: {
        title: '例: 毎日10分間の省エネ活動',
        description: '目標の詳細や具体的な行動内容を記入してください',
      },
      last7Days: '過去7日間の進捗',
      confirmDelete: 'この目標を削除しますか？',
      creatingGoal: '目標を作成中...',
    },

    // ダッシュボード
    dashboard: {
      title: 'ダッシュボード',
      stats: '統計',
      recentGoals: '最近の目標',
      upcomingCheckins: '今後のチェックイン',
      badges: 'バッジ',
      streaks: 'ストリーク',
      weeklyProgress: '週間進捗',
      sdgProgress: 'SDG別進捗',
      level: 'レベル',
      xp: 'XP',
      totalGoals: '総目標数',
      completedGoals: '完了目標数',
      currentStreak: '現在のストリーク',
      longestStreak: '最長ストリーク',
      badgesEarned: '獲得バッジ数',
    },

    // バッジ
    badges: {
      title: 'バッジ',
      earned: '獲得済み',
      available: '利用可能',
      criteria: '獲得条件',
      firstQuiz: '初回クイズ完了',
      firstQuizDescription: '初回のSDGsクイズを完了しました',
      focusedSdg: 'SDG{number}に集中',
      focusedSdgDescription: 'SDG{number}が上位3位に入りました',
      consistentStreak: '{weeks}週間継続',
      consistentStreakDescription: '{weeks}週間連続で目標を達成しました',
      goalHatTrick: '目標ハットトリック',
      goalHatTrickDescription: '1週間で3つの目標を完了しました',
    },

    // エラー
    errors: {
      networkError: 'ネットワークエラーが発生しました',
      serverError: 'サーバーエラーが発生しました',
      validationError: '入力内容に誤りがあります',
      notFound: 'リソースが見つかりません',
      unauthorized: '認証が必要です',
      forbidden: 'アクセス権限がありません',
    },

    // SDGs
    sdgs: {
      1: '貧困をなくそう',
      2: '飢餓をゼロに',
      3: 'すべての人に健康と福祉を',
      4: '質の高い教育をみんなに',
      5: 'ジェンダー平等を実現しよう',
      6: '安全な水とトイレを世界中に',
      7: 'エネルギーをみんなに そしてクリーンに',
      8: '働きがいも経済成長も',
      9: '産業と技術革新の基盤をつくろう',
      10: '人や国の不平等をなくそう',
      11: '住み続けられるまちづくりを',
      12: 'つくる責任 つかう責任',
      13: '気候変動に具体的な対策を',
      14: '海の豊かさを守ろう',
      15: '陸の豊かさも守ろう',
      16: '平和と公正をすべての人に',
      17: 'パートナーシップで目標を達成しよう',
    },
  },
  en: {
    // Common
    common: {
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      skip: 'Skip',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      share: 'Share',
      copy: 'Copy',
      back: 'Back',
    },
    
    // Navigation
    nav: {
      home: 'Home',
      quiz: 'Quiz',
      results: 'Results',
      goals: 'Goals',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
    },

    // Onboarding
    onboarding: {
      welcome: 'Welcome to SDGs Interest & Action App',
      title: 'SDGs Interest & Action App',
      description: 'Measure your interest in SDGs and set concrete action goals',
      consent: 'I agree to the privacy policy',
      locale: 'Select language',
      startQuiz: 'Start Quiz',
      anonymousMode: 'Start in Anonymous Mode',
      signUp: 'Create Account',
      features: {
        questions: 'Questions',
        time: 'minutes to complete',
        analysis: 'SDGs Analysis',
      },
    },

    // Quiz
    quiz: {
      title: 'SDGs Interest Quiz',
      subtitle: 'Answer 25 questions to measure your interest in SDGs',
      question: 'Question',
      of: 'of',
      selectOption: 'Select an option',
      intensity: 'Interest Level',
      intensityDescription: 'Set your interest level for the selected option from 0-3',
      intensityLabels: {
        0: 'No interest',
        1: 'Slight interest',
        2: 'Moderate interest',
        3: 'Strong interest',
      },
      skipQuestion: 'Skip this question',
      nextQuestion: 'Next question',
      submitQuiz: 'Complete Quiz',
      progress: 'Progress',
      lastQuestion: 'Last question',
      nextQuestionHint: 'Moving to next question',
    },

    // Results
    results: {
      title: 'Your SDGs Interest Results',
      overallScore: 'Overall Interest',
      sdgProfile: 'SDG Profile',
      top3: 'Most Interested SDGs',
      bottom3: 'Least Interested SDGs',
      actionRecommendations: 'Recommended Actions',
      setGoals: 'Set Goals',
      retakeQuiz: 'Retake Quiz',
      shareResults: 'Share Results',
      downloadImage: 'Download Image',
    },

    // Goals
    goals: {
      title: 'Goal Setting',
      createGoal: 'Create New Goal',
      editGoal: 'Edit Goal',
      goalTitle: 'Goal Title',
      goalDescription: 'Description (optional)',
      sdgTags: 'Related SDGs',
      cadence: 'Frequency',
      cadenceOptions: {
        daily: 'Daily',
        weekly: 'Weekly',
      },
      targetPerWeek: 'Weekly Target',
      startDate: 'Start Date',
      isActive: 'Active',
      saveGoal: 'Save Goal',
      deleteGoal: 'Delete Goal',
      noGoals: 'No goals set yet',
      createFirstGoal: 'Create your first goal',
      validation: {
        titleRequired: 'Title is required',
        sdgRequired: 'Please select at least one SDG',
        targetRequired: 'Weekly target must be at least 1',
      },
      placeholders: {
        title: 'e.g., Daily 10-minute energy saving activities',
        description: 'Enter goal details and specific actions',
      },
      last7Days: 'Last 7 Days Progress',
      confirmDelete: 'Are you sure you want to delete this goal?',
      creatingGoal: 'Creating your goal...',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      stats: 'Statistics',
      recentGoals: 'Recent Goals',
      upcomingCheckins: 'Upcoming Check-ins',
      badges: 'Badges',
      streaks: 'Streaks',
      weeklyProgress: 'Weekly Progress',
      sdgProgress: 'SDG Progress',
      level: 'Level',
      xp: 'XP',
      totalGoals: 'Total Goals',
      completedGoals: 'Completed Goals',
      currentStreak: 'Current Streak',
      longestStreak: 'Longest Streak',
      badgesEarned: 'Badges Earned',
    },

    // Badges
    badges: {
      title: 'Badges',
      earned: 'Earned',
      available: 'Available',
      criteria: 'Criteria',
      firstQuiz: 'First Quiz Complete',
      firstQuizDescription: 'Completed your first SDGs quiz',
      focusedSdg: 'Focused on SDG {number}',
      focusedSdgDescription: 'SDG {number} is in your top 3',
      consistentStreak: '{weeks} Week Streak',
      consistentStreakDescription: 'Achieved goals for {weeks} consecutive weeks',
      goalHatTrick: 'Goal Hat Trick',
      goalHatTrickDescription: 'Completed 3 goals in one week',
    },

    // Errors
    errors: {
      networkError: 'Network error occurred',
      serverError: 'Server error occurred',
      validationError: 'Invalid input data',
      notFound: 'Resource not found',
      unauthorized: 'Authentication required',
      forbidden: 'Access denied',
    },

    // SDGs
    sdgs: {
      1: 'No Poverty',
      2: 'Zero Hunger',
      3: 'Good Health and Well-being',
      4: 'Quality Education',
      5: 'Gender Equality',
      6: 'Clean Water and Sanitation',
      7: 'Affordable and Clean Energy',
      8: 'Decent Work and Economic Growth',
      9: 'Industry, Innovation and Infrastructure',
      10: 'Reduced Inequalities',
      11: 'Sustainable Cities and Communities',
      12: 'Responsible Consumption and Production',
      13: 'Climate Action',
      14: 'Life Below Water',
      15: 'Life on Land',
      16: 'Peace, Justice and Strong Institutions',
      17: 'Partnerships for the Goals',
    },
  },
};

// 国際化フック
export function useTranslation(locale: Locale = 'en') {
  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key.split('.');
      let value: unknown = messages[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && value !== null && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }
      
      if (typeof value !== 'string') {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    
      // パラメータ置換
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      
      return value;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };
  
  return { t, locale };
}

// デフォルトロケール
export const defaultLocale: Locale = 'en';

// 利用可能なロケール
export const availableLocales: Locale[] = ['ja', 'en'];
