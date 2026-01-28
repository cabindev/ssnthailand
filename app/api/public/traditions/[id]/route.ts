// app/api/public/traditions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/traditions/:id - ดึงรายละเอียดประเพณี
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tradition = await prisma.tradition.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true, url: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    });

    if (!tradition) {
      return NextResponse.json(
        { success: false, error: 'Tradition not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.tradition.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: tradition
    });
  } catch (error) {
    console.error('Error fetching tradition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tradition' },
      { status: 500 }
    );
  }
}
