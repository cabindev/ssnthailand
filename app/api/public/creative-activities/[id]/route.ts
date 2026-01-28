// app/api/public/creative-activities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/creative-activities/:id - ดึงรายละเอียดกิจกรรมสร้างสรรค์
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activity = await prisma.creativeActivity.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true, url: true }
        },
        category: {
          select: { id: true, name: true }
        },
        subCategory: {
          select: { id: true, name: true }
        }
      }
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Creative activity not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.creativeActivity.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching creative activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creative activity' },
      { status: 500 }
    );
  }
}
