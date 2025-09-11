# SDGs関心度・行動アプリ - 技術文書

## アーキテクチャ概要

### システム構成
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   フロントエンド   │    │   バックエンド    │    │   データ層      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (JSON Files)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック詳細

#### フロントエンド
- **Next.js 15.5.0**: React ベースのフルスタックフレームワーク
- **React 18.3.1**: ユーザーインターフェースライブラリ
- **TypeScript 5.6.3**: 静的型付け言語
- **Tailwind CSS 3.4.15**: ユーティリティファーストCSSフレームワーク

#### 開発ツール
- **ESLint**: コード品質管理
- **PostCSS**: CSS処理
- **next-themes**: テーマ管理

## データフロー

### 1. クイズ回答フロー
```
ユーザー入力 → バリデーション → スコア計算 → 結果表示
     ↓              ↓              ↓           ↓
  選択肢+強度    → 型チェック    → アルゴリズム → UI更新
```

### 2. スコアリングアルゴリズム

#### Raw Score計算
```typescript
rawScore[sdg] = Σ(intensity) for each selected SDG tag
```

#### Exposure Score計算
```typescript
exposureScore[sdg] = Σ(3) for each SDG tag in answered questions
```

#### Normalized Score計算
```typescript
normalizedScore[sdg] = Math.floor(100 * (rawScore[sdg] / exposureScore[sdg]) + 0.5)
```

#### Overall Score計算
```typescript
overallScore = Math.floor(100 * (totalIntensity / (3 * answeredCount)) + 0.5)
```

## コンポーネント設計

### 1. 階層構造
```
App (page.tsx)
├── QuizContainer
│   ├── QuizCard
│   └── LanguageSwitcher
├── ResultsDisplay
│   ├── SDGProfile
│   ├── TopBottomSDGs
│   └── ActionRecommendations
└── GoalsList
    ├── GoalForm
    └── GoalItem
```

### 2. 状態管理
- **ローカル状態**: React Hooks (useState, useEffect)
- **グローバル状態**: React Context (AuthContext)
- **サーバー状態**: API Routes + クライアントサイドキャッシュ

## API設計

### エンドポイント一覧

#### クイズ関連
- `GET /api/quiz/questions` - 質問一覧取得
- `POST /api/quiz/submit` - 回答送信・スコア計算

#### 目標管理
- `GET /api/goals` - 目標一覧取得
- `POST /api/goals` - 目標作成
- `PUT /api/goals/[id]` - 目標更新
- `DELETE /api/goals/[id]` - 目標削除

#### チェックイン
- `GET /api/checkins` - チェックイン一覧取得
- `POST /api/checkins` - チェックイン作成
- `PUT /api/checkins/[id]` - チェックイン更新

## データモデル

### 1. 型定義 (types/index.ts)

```typescript
interface Question {
  id: string;
  title: LocalizedString;
  options: Option[];
}

interface Option {
  id: string;
  text: LocalizedString;
  sdgTags: number[];
}

interface Response {
  questionId: string;
  optionId: string;
  intensity: number;
}

interface ScoreSnapshot {
  overall: number;
  sdg_scores_raw: Record<number, number>;
  sdg_scores_norm: Record<number, number>;
  top3: number[];
  bottom3: number[];
  createdAt: Date;
}
```

### 2. データファイル
- `questions.v1.0.json`: 25問のクイズ問題データ
- 各問題に4つの選択肢とSDGタグを設定

## 国際化 (i18n) 実装

### 1. 翻訳キー構造
```typescript
interface Translations {
  common: { [key: string]: string };
  quiz: { [key: string]: string };
  results: { [key: string]: string };
  goals: { [key: string]: string };
}
```

### 2. 言語切り替え
- リアルタイム切り替え
- ローカルストレージでの設定保持
- 全UI要素の完全翻訳

## パフォーマンス最適化

### 1. コード分割
- 動的インポートによる遅延読み込み
- コンポーネント単位での最適化

### 2. キャッシュ戦略
- クイズ問題のクライアントサイドキャッシュ
- API応答の最適化

### 3. バンドルサイズ最適化
- 不要な依存関係の削除
- Tree shakingの活用

## セキュリティ考慮事項

### 1. 入力検証
- TypeScript型チェック
- ランタイムバリデーション
- XSS対策

### 2. データ保護
- 個人情報の最小化
- 匿名化されたセッション管理
- 90日間のデータ保持ポリシー

## テスト戦略

### 1. 単体テスト
- スコアリングアルゴリズムのテスト
- ユーティリティ関数のテスト

### 2. 統合テスト
- API エンドポイントのテスト
- コンポーネント間の連携テスト

### 3. E2Eテスト
- ユーザーフローのテスト
- クロスブラウザテスト

## デプロイメント

### 1. ビルドプロセス
```bash
npm run build  # プロダクションビルド
npm run start  # 本番サーバー起動
```

### 2. 環境設定
- 開発環境: `npm run dev`
- 本番環境: `npm run build && npm start`

### 3. 静的ファイル
- 画像: `public/icons/`
- マニフェスト: `public/manifest.webmanifest`
- サービスワーカー: `public/sw.js`

## 今後の技術的改善点

### 1. 短期
- ユーザー認証システムの実装
- データベース統合（PostgreSQL）
- リアルタイム更新機能

### 2. 中期
- PWA機能の完全実装
- オフライン対応
- プッシュ通知

### 3. 長期
- マイクロサービス化
- AI/ML統合
- スケーラビリティの向上

## 開発環境セットアップ

### 1. 前提条件
- Node.js 18.0.0以上
- npm または yarn
- Git

### 2. セットアップ手順
```bash
# リポジトリクローン
git clone [repository-url]
cd attendance-with-ai-driven

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### 3. 開発コマンド
```bash
npm run dev      # 開発サーバー
npm run build    # プロダクションビルド
npm run start    # 本番サーバー
npm run lint     # リント実行
```

## トラブルシューティング

### 1. よくある問題
- **TypeScriptエラー**: 型定義の確認
- **ビルドエラー**: 依存関係の再インストール
- **APIエラー**: エンドポイントの確認

### 2. デバッグ方法
- ブラウザ開発者ツール
- コンソールログの活用
- ネットワークタブでのAPI確認

---

**技術責任者**: [あなたの名前]  
**最終更新**: [日付]  
**バージョン**: 1.0.0
