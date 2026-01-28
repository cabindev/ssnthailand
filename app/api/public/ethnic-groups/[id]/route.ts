// app/api/public/ethnic-groups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/ethnic-groups/:id - ดึงรายละเอียดกลุ่มชาติพันธุ์
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ethnicGroup = await prisma.ethnicGroup.findUnique({
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

    if (!ethnicGroup) {
      return NextResponse.json(
        { success: false, error: 'Ethnic group not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.ethnicGroup.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: ethnicGroup
    });
  } catch (error) {
    console.error('Error fetching ethnic group:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ethnic group' },
      { status: 500 }
    );
  }
}
