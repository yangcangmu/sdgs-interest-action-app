# サークル出欠管理システム

サークルメンバーの出欠状況と全体連絡を管理するWebアプリケーションです。

## 機能

- 🔐 メンバー認証（ログイン/ログアウト）
- 🪑 座席状況のリアルタイム管理
- 📢 全体連絡掲示板
- 📱 レスポンシブデザイン

## セットアップ

### 1. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を設定してください：

```bash
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# ローカル開発用（本番では削除またはfalse）
NEXT_PUBLIC_USE_FIRESTORE_EMULATOR=false
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8081

# Auth エミュレータ（本番では削除またはfalse）
NEXT_PUBLIC_USE_AUTH_EMULATOR=false
NEXT_PUBLIC_AUTH_EMULATOR_HOST=127.0.0.1
NEXT_PUBLIC_AUTH_EMULATOR_PORT=9099
```

### 2. Firebase設定

1. Firebaseコンソールでプロジェクトを作成
2. Authentication を有効化し、メール/パスワード認証を設定
3. Firestore を有効化
4. 初期データとして `seats` コレクションを作成：
   - `seat-01`: `{ occupied: false, occupantName: "" }`
   - `seat-02`: `{ occupied: false, occupantName: "" }`
   - `seat-03`: `{ occupied: false, occupantName: "" }`

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## デプロイ（Vercel推奨）

1. GitHubにリポジトリをプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定（`NEXT_PUBLIC_` プレフィックス付き）
4. デプロイ完了後、URLをメンバーに共有

## 使用方法

1. メンバーがログイン
2. 座席をクリックして着席/退席を切り替え
3. 全体連絡掲示板で情報を共有
4. ログアウトでセッション終了

## 技術スタック

- Next.js 14
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS（インラインスタイルで実装）
