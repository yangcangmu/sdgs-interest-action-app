# SDGs Interest & Action App 技術仕様書

## 1. アプリケーション概要

**アプリ名**: SDGs Interest & Action App  
**バージョン**: 1.0.0  
**フレームワーク**: Next.js 15.5.0 (App Router)  
**言語**: TypeScript  
**スタイリング**: Tailwind CSS  
**デプロイ**: Vercel  

## 2. 主要機能

### 2.1 クイズ機能
- **質問数**: 25問
- **所要時間**: 3-5分
- **回答形式**: 
  - 選択肢から1つ選択
  - 関心度スライダー（0-3、デフォルト1）
- **言語対応**: 日本語・英語切り替え可能
- **初期言語**: 英語

### 2.2 スコアリングシステム
- **17のSDG別スコア計算**
- **総合関心度スコア（0-100）**
- **Top3/Bottom3 SDG表示**

### 2.3 目標設定機能
- **個人目標の作成・編集・削除**
- **SDGタグ付け**
- **頻度設定（Daily/Weekly）**

### 2.4 チェックイン機能
- **日次・週次の進捗記録**
- **目標別の進捗管理**

## 3. 技術構成

### 3.1 フロントエンド
```
src/
├── app/
│   ├── api/
│   │   ├── quiz/
│   │   │   ├── questions/route.ts
│   │   │   └── submit/route.ts
│   │   ├── goals/route.ts
│   │   └── checkins/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Quiz/
│   │   ├── QuizCard.tsx
│   │   └── QuizContainer.tsx
│   ├── Goals/
│   │   ├── GoalForm.tsx
│   │   └── GoalsList.tsx
│   └── common/
│       ├── LanguageSwitcher.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── scoring.ts
│   └── i18n.ts
├── types/
│   └── index.ts
└── data/
    └── questions.v1.0.json
```

### 3.2 データモデル

**Question型**:
```typescript
interface Question {
  id: string;
  text: { ja: string; en: string };
  options: Option[];
  sdgTags: number[];
}
```

**Option型**:
```typescript
interface Option {
  id: string;
  text: { ja: string; en: string };
  sdgWeights: Record<number, number>;
}
```

**Goal型**:
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  sdgTags: number[];
  cadence: 'daily' | 'weekly';
  targetPerWeek?: number;
  startAt: Date;
  isActive: boolean;
  userId?: string;
  sessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. スコアリングアルゴリズム

### 4.1 基本計算式

**Raw Score (生スコア)**:
```
raw[s] = Σ(選択した選択肢のSDG重み × 関心度スライダー値)
```

**Exposure Score (露出スコア)**:
```
exp[s] = そのSDGがタグ付けされた質問の数 × 3
```

**Normalized Score (正規化スコア)**:
```
norm[s] = (raw[s] / exp[s]) × 100
```

**Overall Score (総合スコア)**:
```
overall = Σ(norm[s] × exp[s]) / Σ(exp[s])
```

### 4.2 Top3/Bottom3選択アルゴリズム

1. **全17SDGを正規化スコア降順でランキング**
2. **Top3**: ランキング1-3位のSDG
3. **Bottom3**: ランキング15-17位のSDG（総数が17未満の場合は最後の3つ）

## 5. Recommended Actionsアルゴリズム

### 5.1 基本ロジック
```typescript
private generateActionRecommendations(top3Sdgs: number[]): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];
  
  // 各Top3 SDGに対して3-5個のアクションを推奨
  top3Sdgs.forEach(sdg => {
    const actions = this.getActionRecommendationsForSdg(sdg);
    recommendations.push(...actions);
  });

  return recommendations.slice(0, 15); // 最大15個
}
```

### 5.2 アクション特徴
- **難易度**: easy, medium, hard
- **所要時間**: 具体的な時間（例：「10分」「2時間」）
- **SDGタグ**: 関連するSDG番号
- **多言語対応**: 日本語・英語のタイトル・説明

## 6. 国際化システム

### 6.1 実装方式
- **カスタムi18n実装**（外部ライブラリ不使用）
- **翻訳キー**: ドット記法（例：`quiz.progress`）
- **パラメータ置換**: `{count}`形式

### 6.2 対応言語
- **日本語 (ja)**
- **英語 (en)**
- **デフォルト言語**: 英語

## 7. API設計

### 7.1 エンドポイント

**GET /api/quiz/questions**
- クイズ質問データを取得

**POST /api/quiz/submit**
- クイズ回答を送信
- スコア計算と結果返却

**GET /api/goals**
- 目標一覧取得

**POST /api/goals**
- 目標作成

**PUT /api/goals/[id]**
- 目標更新

**DELETE /api/goals/[id]**
- 目標削除

**GET /api/checkins**
- チェックイン一覧取得

**POST /api/checkins**
- チェックイン作成

## 8. 画面遷移フロー

### 8.1 基本フロー
1. **ウェルカム画面** → クイズ開始
2. **クイズ画面** → 結果表示
3. **結果画面** → 目標設定
4. **目標設定画面** → 目標一覧

### 8.2 状態管理
```typescript
type QuizState = 'welcome' | 'quiz' | 'results' | 'goals';
```

## 9. データ永続化

### 9.1 現在の実装
- **メモリベース**（サーバー再起動でデータ消失）
- **セッションID**によるユーザー識別

### 9.2 データ保持期間
- **90日間**（設計上、実装は未完了）

## 10. エラーハンドリング

### 10.1 実装済み
- **ネットワークエラー**: 接続失敗時の処理
- **バリデーションエラー**: 入力値検証
- **言語切り替えエラー**: try-catch文による保護

### 10.2 エラー表示
- **ユーザーフレンドリーなメッセージ**
- **多言語対応**

## 11. パフォーマンス最適化

### 11.1 実装済み
- **useCallback**: 関数の再レンダリング防止
- **useRef**: 無限ループ防止
- **条件付きレンダリング**: 不要なコンポーネント描画回避

## 12. アクセシビリティ

### 12.1 実装状況
- **基本的なHTMLセマンティクス**
- **キーボードナビゲーション**: 未実装
- **スクリーンリーダー対応**: 未実装

---

