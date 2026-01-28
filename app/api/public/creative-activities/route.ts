// app/api/public/creative-activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/creative-activities - ดึงรายการกิจกรรมสร้างสรรค์
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');
    const region = searchParams.get('region');
    const province = searchParams.get('province');
    const year = searchParams.get('year');

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (region && region !== 'all') where.type = region;
    if (province && province !== 'all') where.province = province;
    if (year && year !== 'all') where.startYear = parseInt(year);

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.creativeActivity.findMany({
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
          },
          subCategory: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.creativeActivity.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching creative activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch creative activities' },
      { status: 500 }
    );
  }
}
