@echo off
echo 大学レポート提出用ZIPファイルを作成中...

REM 既存のZIPファイルを削除
if exist "SDGs-App-Submission.zip" del "SDGs-App-Submission.zip"

REM 提出用フォルダを作成
if exist "submission" rmdir /s /q "submission"
mkdir "submission"

REM 必要なファイルをコピー
echo ファイルをコピー中...
xcopy "src" "submission\src" /E /I /Q
xcopy "public" "submission\public" /E /I /Q
copy "package.json" "submission\"
copy "package-lock.json" "submission\"
copy "tsconfig.json" "submission\"
copy "next.config.mjs" "submission\"
copy "postcss.config.mjs" "submission\"
copy "tailwind.config.ts" "submission\"
copy "README.md" "submission\"
copy "firebase.json" "submission\"
copy "firestore.rules" "submission\"

REM 不要なファイルを除外
if exist "submission\node_modules" rmdir /s /q "submission\node_modules"
if exist "submission\.next" rmdir /s /q "submission\.next"
if exist "submission\firestore-debug.log" del "submission\firestore-debug.log"

REM ZIPファイルを作成
echo ZIPファイルを作成中...
powershell Compress-Archive -Path "submission\*" -DestinationPath "SDGs-App-Submission.zip" -Force

REM 一時フォルダを削除
rmdir /s /q "submission"

echo 完了！SDGs-App-Submission.zip が作成されました。
pause
