// 基本型定義
export type Locale = 'ja' | 'en';
export type Intensity = 0 | 1 | 2 | 3;
export type Cadence = 'daily' | 'weekly';
export type StreakKind = 'daily' | 'weekly';

// 質問・選択肢の型
export interface Question {
  id: string;
  title: {
    ja: string;
    en: string;
  };
  options: Option[];
}

export interface Option {
  id: string;
  label: {
    ja: string;
    en: string;
  };
  sdgTags: number[];
}

// 質問セット
export interface QuestionSet {
  version: string;
  locales: Locale[];
  questions: Question[];
}

// 回答データ
export interface Response {
  sessionId: string;
  questionId: string;
  optionId: string;
  intensity: Intensity;
  createdAt: Date;
}

// スコア計算結果
export interface ScoreSnapshot {
  sessionId?: string;
  userId?: string;
  overall: number;
  sdg_scores_raw: Record<string, number>;
  sdg_scores_norm: Record<string, number>;
  top3: number[];
  bottom3: number[];
  createdAt: Date;
}

// 目標設定
export interface Goal {
  id: string;
  userId?: string;
  sessionId?: string;
  title: string;
  description?: string;
  sdgTags: number[];
  cadence: Cadence;
  targetPerWeek?: number;
  startAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// チェックイン
export interface Checkin {
  id: string;
  goalId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: Date;
}

// バッジ
export interface Badge {
  id: string;
  key: string;
  name: {
    ja: string;
    en: string;
  };
  description: {
    ja: string;
    en: string;
  };
  iconKey: string;
  criteria: Record<string, unknown>; // JSONLogic criteria
}

// ユーザーバッジ
export interface UserBadge {
  id: string;
  userId?: string;
  sessionId?: string;
  badgeKey: string;
  awardedAt: Date;
}

// ストリーク
export interface Streak {
  id: string;
  userId?: string;
  sessionId?: string;
  kind: StreakKind;
  length: number;
  lastCheckinDate: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}

// シェアカード
export interface ShareCard {
  id: string;
  snapshotId: string;
  imageUrl: string;
  createdAt: Date;
}

// ユーザー情報
export interface User {
  id: string;
  displayName?: string;
  email?: string;
  locale: Locale;
  createdAt: Date;
  updatedAt: Date;
}

// セッション情報
export interface Session {
  id: string;
  locale: Locale;
  createdAt: Date;
  lastActivityAt: Date;
}

// クイズ回答データ（API用）
export interface QuizSubmission {
  questionId: string;
  optionId: string;
  intensity: Intensity;
}

// スコア結果（API用）
export interface QuizResult {
  overall_interest: number;
  sdg_scores_raw: Record<string, number>;
  sdg_scores_norm: Record<string, number>;
  top3: number[];
  bottom3: number[];
  actionRecommendations: ActionRecommendation[];
}

// アクション推奨
export interface ActionRecommendation {
  id: string;
  title: {
    ja: string;
    en: string;
  };
  description: {
    ja: string;
    en: string;
  };
  sdgTags: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "5分", "30分"
}

// レベルシステム
export interface Level {
  level: number;
  name: {
    ja: string;
    en: string;
  };
  xpRequired: number;
  color: string;
}

// 統計データ
export interface UserStats {
  totalXp: number;
  currentLevel: number;
  totalGoals: number;
  completedGoals: number;
  currentStreak: number;
  longestStreak: number;
  badgesEarned: number;
  totalCheckins: number;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// フィルター・ソート用
export interface GoalFilters {
  sdgTags?: number[];
  cadence?: Cadence[];
  isActive?: boolean;
}

export interface CheckinFilters {
  goalId?: string;
  from?: string;
  to?: string;
  completed?: boolean;
}

// ダッシュボード用データ
export interface DashboardData {
  stats: UserStats;
  recentGoals: Goal[];
  upcomingCheckins: Checkin[];
  recentBadges: UserBadge[];
  weeklyProgress: {
    date: string;
    completed: number;
    total: number;
  }[];
  sdgProgress: {
    sdg: number;
    score: number;
    goals: number;
    completed: number;
  }[];
}

// エラーハンドリング
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// 設定
export interface AppSettings {
  locale: Locale;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    dailyReminder: boolean;
    weeklyReport: boolean;
    badgeEarned: boolean;
  };
  privacy: {
    shareProfile: boolean;
    showOnLeaderboard: boolean;
  };
}
