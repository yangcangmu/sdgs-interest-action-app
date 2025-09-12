import { NextResponse } from 'next/server';
import questionsData from '@/data/questions.v1.0.json';

export const dynamic = 'force-static';
import { QuestionSet } from '@/types';

export async function GET() {
  try {
    const questionSet: QuestionSet = questionsData as QuestionSet;
    
    return NextResponse.json({
      success: true,
      data: questionSet,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch questions',
      },
      { status: 500 }
    );
  }
}
