// app/api/public/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/categories - ดึงรายการหมวดหมู่ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // creative, tradition, ethnic

    let result: any = {};

    if (!type || type === 'creative') {
      const creativeCategories = await prisma.creativeCategory.findMany({
        include: {
          subCategories: {
            select: { id: true, name: true }
          },
          _count: { select: { activities: true } }
        },
        orderBy: { name: 'asc' }
      });
      result.creative = creativeCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        subCategories: cat.subCategories,
        activityCount: cat._count.activities
      }));
    }

    if (!type || type === 'tradition') {
      const traditionCategories = await prisma.traditionCategory.findMany({
        include: {
          _count: { select: { traditions: true } }
        },
        orderBy: { name: 'asc' }
      });
      result.tradition = traditionCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        traditionCount: cat._count.traditions
      }));
    }

    if (!type || type === 'ethnic') {
      const ethnicCategories = await prisma.ethnicCategory.findMany({
        include: {
          _count: { select: { ethnicGroups: true } }
        },
        orderBy: { name: 'asc' }
      });
      result.ethnic = ethnicCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        ethnicGroupCount: cat._count.ethnicGroups
      }));
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
