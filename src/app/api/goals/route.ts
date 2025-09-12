import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Goal, ApiResponse } from '@/types';

// バリデーションスキーマ
const GoalCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sdgTags: z.array(z.number().min(1).max(17)),
  cadence: z.enum(['daily', 'weekly']),
  targetPerWeek: z.number().min(1).optional(),
  startAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});

const GoalUpdateSchema = GoalCreateSchema.partial().extend({
  id: z.string(),
});

// メモリ内ストレージ（実際のアプリではデータベースを使用）
const goals: Goal[] = [];
let nextId = 1;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const isActive = searchParams.get('isActive');

    let filteredGoals = goals;
    
    if (sessionId) {
      filteredGoals = goals.filter(goal => goal.sessionId === sessionId);
    }
    
    if (isActive !== null) {
      const active = isActive === 'true';
      filteredGoals = filteredGoals.filter(goal => goal.isActive === active);
    }

    const response: ApiResponse<Goal[]> = {
      success: true,
      data: filteredGoals,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch goals',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GoalCreateSchema.parse(body);

    const newGoal: Goal = {
      id: `goal_${nextId++}`,
      sessionId: body.sessionId || `session_${Date.now()}`,
      title: validatedData.title,
      description: validatedData.description,
      sdgTags: validatedData.sdgTags,
      cadence: validatedData.cadence,
      targetPerWeek: validatedData.targetPerWeek,
      startAt: new Date(validatedData.startAt),
      isActive: validatedData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    goals.push(newGoal);

    const response: ApiResponse<Goal> = {
      success: true,
      data: newGoal,
      message: 'Goal created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);

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
        error: 'Failed to create goal',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GoalUpdateSchema.parse(body);

    const goalIndex = goals.findIndex(goal => goal.id === validatedData.id);
    
    if (goalIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Goal not found',
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const updatedGoal: Goal = {
      ...goals[goalIndex],
      ...validatedData,
      startAt: validatedData.startAt ? new Date(validatedData.startAt) : goals[goalIndex].startAt,
      updatedAt: new Date(),
    };

    goals[goalIndex] = updatedGoal;

    const response: ApiResponse<Goal> = {
      success: true,
      data: updatedGoal,
      message: 'Goal updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating goal:', error);

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
        error: 'Failed to update goal',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('id');

    if (!goalId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Goal ID is required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    
    if (goalIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Goal not found',
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    goals.splice(goalIndex, 1);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Goal deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete goal',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
