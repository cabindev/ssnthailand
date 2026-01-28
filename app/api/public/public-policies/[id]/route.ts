// app/api/public/public-policies/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/public-policies/:id - ดึงรายละเอียดนโยบายสาธารณะ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const policy = await prisma.publicPolicy.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true, url: true }
        }
      }
    });

    if (!policy) {
      return NextResponse.json(
        { success: false, error: 'Public policy not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.publicPolicy.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Error fetching public policy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public policy' },
      { status: 500 }
    );
  }
}
