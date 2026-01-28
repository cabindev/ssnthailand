// app/api/public/ethnic-groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/ethnic-groups - ดึงรายการกลุ่มชาติพันธุ์
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const categoryId = searchParams.get('categoryId');
    const region = searchParams.get('region');
    const province = searchParams.get('province');
    const year = searchParams.get('year');

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (region && region !== 'all') where.type = region;
    if (province && province !== 'all') where.province = province;
    if (year && year !== 'all') where.startYear = parseInt(year);

    const skip = (page - 1) * limit;

    const [ethnicGroups, total] = await Promise.all([
      prisma.ethnicGroup.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            take: 1,
            select: { id: true, url: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.ethnicGroup.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: ethnicGroups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ethnic groups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ethnic groups' },
      { status: 500 }
    );
  }
}
