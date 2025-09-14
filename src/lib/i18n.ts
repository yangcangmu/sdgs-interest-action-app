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

    // 認証
    auth: {
      login: 'ログイン',
      register: '新規登録',
      logout: 'ログアウト',
      profile: 'プロフィール',
      username: 'ユーザー名',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      usernamePlaceholder: 'ユーザー名を入力',
      emailPlaceholder: 'メールアドレスを入力',
      passwordPlaceholder: 'パスワードを入力',
      confirmPasswordPlaceholder: 'パスワードを再入力',
      loggingIn: 'ログイン中...',
      registering: '登録中...',
      switchToRegister: '新規登録はこちら',
      switchToLogin: 'ログインはこちら',
      continueAsGuest: 'ゲストとして続行',
      usernameMinLength: 'ユーザー名は2文字以上で入力してください',
      invalidEmail: '有効なメールアドレスを入力してください',
      passwordMinLength: 'パスワードは6文字以上で入力してください',
      passwordMismatch: 'パスワードが一致しません',
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
      startAsGuest: 'ゲストとして開始',
      chooseOption: '利用方法を選択してください',
      or: 'または',
      loginToSave: 'ログインしてデータを保存',
      loginHint: '右上のボタンからログインできます',
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
      timesPerWeek: '回',
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

    // SDGs詳細説明
    sdgsDescription: {
      1: 'あらゆる場所で、あらゆる形態の貧困を終わらせる',
      2: '飢餓を終わらせ、食料安全保障と栄養改善を実現し、持続可能な農業を促進する',
      3: 'あらゆる年齢のすべての人々の健康的な生活を確保し、福祉を促進する',
      4: 'すべての人々に包摂的かつ公平で質の高い教育を提供し、生涯学習の機会を促進する',
      5: 'ジェンダー平等を達成し、すべての女性と女児のエンパワーメントを図る',
      6: 'すべての人々の水と衛生へのアクセスと持続可能な管理を確保する',
      7: 'すべての人々に手ごろで信頼でき、持続可能かつ近代的なエネルギーへのアクセスを確保する',
      8: '包摂的かつ持続可能な経済成長、雇用、ディーセント・ワークを促進する',
      9: '強靭なインフラを整備し、包摂的で持続可能な産業化を促進し、イノベーションを推進する',
      10: '国内および国家間の不平等を是正する',
      11: '包摂的で安全、強靭かつ持続可能な都市と人間居住を実現する',
      12: '持続可能な消費と生産のパターンを確保する',
      13: '気候変動とその影響に立ち向かうため、緊急対策を取る',
      14: '海洋と海洋資源を保全し、持続可能な形で利用する',
      15: '陸域生態系の保護、回復、持続可能な利用の推進、森林の持続可能な管理、砂漠化への対処、土地劣化の阻止・回復、生物多様性の損失を阻止する',
      16: '持続可能な開発のための平和で包摂的な社会を促進し、すべての人々に司法へのアクセスを提供し、あらゆるレベルにおいて効果的で説明責任のある包摂的な制度を構築する',
      17: '持続可能な開発のための実施手段を強化し、グローバル・パートナーシップを活性化する',
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

    // Authentication
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      usernamePlaceholder: 'Enter username',
      emailPlaceholder: 'Enter email address',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Re-enter password',
      loggingIn: 'Logging in...',
      registering: 'Registering...',
      switchToRegister: 'Sign up here',
      switchToLogin: 'Login here',
      continueAsGuest: 'Continue as Guest',
      usernameMinLength: 'Username must be at least 2 characters',
      invalidEmail: 'Please enter a valid email address',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
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
      startAsGuest: 'Start as Guest',
      chooseOption: 'Choose how to proceed',
      or: 'or',
      loginToSave: 'Login to save data',
      loginHint: 'Use the button in the top right to login',
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
      timesPerWeek: 'times',
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

    // SDGs詳細説明
    sdgsDescription: {
      1: 'End poverty in all its forms everywhere',
      2: 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture',
      3: 'Ensure healthy lives and promote well-being for all at all ages',
      4: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all',
      5: 'Achieve gender equality and empower all women and girls',
      6: 'Ensure availability and sustainable management of water and sanitation for all',
      7: 'Ensure access to affordable, reliable, sustainable and modern energy for all',
      8: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all',
      9: 'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation',
      10: 'Reduce inequality within and among countries',
      11: 'Make cities and human settlements inclusive, safe, resilient and sustainable',
      12: 'Ensure sustainable consumption and production patterns',
      13: 'Take urgent action to combat climate change and its impacts',
      14: 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development',
      15: 'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss',
      16: 'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels',
      17: 'Strengthen the means of implementation and revitalize the global partnership for sustainable development',
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
