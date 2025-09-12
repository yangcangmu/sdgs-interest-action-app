import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateQuizScores } from '@/lib/scoring';
import questionsData from '@/data/questions.v1.0.json';
import { QuizResult, ApiResponse } from '@/types';

// バリデーションスキーマ
const QuizSubmissionSchema = z.object({
  questionId: z.string(),
  optionId: z.string(),
  intensity: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

const QuizSubmitRequestSchema = z.object({
  submissions: z.array(QuizSubmissionSchema),
  sessionId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // リクエストボディをバリデーション
    const validatedData = QuizSubmitRequestSchema.parse(body);
    const { submissions } = validatedData;

    // 質問データを取得
    const questions = questionsData.questions;

    // スコアを計算
    const result: QuizResult = calculateQuizScores(questions, submissions);

    // TODO: 実際のデータベースに保存する処理を追加
    // - Response レコードの保存
    // - ScoreSnapshot の保存
    // - セッション管理

    const response: ApiResponse<QuizResult> = {
      success: true,
      data: result,
      message: 'Quiz submitted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error submitting quiz:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit quiz',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
