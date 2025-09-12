import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Checkin, ApiResponse } from '@/types';

export const dynamic = 'force-static';

// バリデーションスキーマ
const CheckinCreateSchema = z.object({
  goalId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  completed: z.boolean(),
});

const CheckinBulkCreateSchema = z.object({
  checkins: z.array(CheckinCreateSchema),
});

// メモリ内ストレージ（実際のアプリではデータベースを使用）
  const checkins: Checkin[] = [];
let nextId = 1;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const completed = searchParams.get('completed');

    let filteredCheckins = checkins;

    if (goalId) {
      filteredCheckins = filteredCheckins.filter(checkin => checkin.goalId === goalId);
    }

    if (from) {
      filteredCheckins = filteredCheckins.filter(checkin => checkin.date >= from);
    }

    if (to) {
      filteredCheckins = filteredCheckins.filter(checkin => checkin.date <= to);
    }

    if (completed !== null) {
      const isCompleted = completed === 'true';
      filteredCheckins = filteredCheckins.filter(checkin => checkin.completed === isCompleted);
    }

    // 日付順でソート
    filteredCheckins.sort((a, b) => b.date.localeCompare(a.date));

    const response: ApiResponse<Checkin[]> = {
      success: true,
      data: filteredCheckins,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching checkins:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch checkins',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 単一チェックインかバルクチェックインかを判定
    if (body.checkins && Array.isArray(body.checkins)) {
      // バルクチェックイン
      const validatedData = CheckinBulkCreateSchema.parse(body);
      
      const newCheckins: Checkin[] = validatedData.checkins.map(checkinData => ({
        id: `checkin_${nextId++}`,
        goalId: checkinData.goalId,
        date: checkinData.date,
        completed: checkinData.completed,
        createdAt: new Date(),
      }));

      checkins.push(...newCheckins);

      const response: ApiResponse<Checkin[]> = {
        success: true,
        data: newCheckins,
        message: 'Checkins created successfully',
      };

      return NextResponse.json(response, { status: 201 });
    } else {
      // 単一チェックイン
      const validatedData = CheckinCreateSchema.parse(body);

      const newCheckin: Checkin = {
        id: `checkin_${nextId++}`,
        goalId: validatedData.goalId,
        date: validatedData.date,
        completed: validatedData.completed,
        createdAt: new Date(),
      };

      checkins.push(newCheckin);

      const response: ApiResponse<Checkin> = {
        success: true,
        data: newCheckin,
        message: 'Checkin created successfully',
      };

      return NextResponse.json(response, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating checkin:', error);

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
        error: 'Failed to create checkin',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Checkin ID is required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const checkinIndex = checkins.findIndex(checkin => checkin.id === id);
    
    if (checkinIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Checkin not found',
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const updatedCheckin: Checkin = {
      ...checkins[checkinIndex],
      ...updateData,
    };

    checkins[checkinIndex] = updatedCheckin;

    const response: ApiResponse<Checkin> = {
      success: true,
      data: updatedCheckin,
      message: 'Checkin updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating checkin:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update checkin',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkinId = searchParams.get('id');

    if (!checkinId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Checkin ID is required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const checkinIndex = checkins.findIndex(checkin => checkin.id === checkinId);
    
    if (checkinIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Checkin not found',
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    checkins.splice(checkinIndex, 1);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Checkin deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting checkin:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete checkin',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
