// app/api/public/public-policies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/public-policies - ดึงรายการนโยบายสาธารณะ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const level = searchParams.get('level');
    const healthRegion = searchParams.get('healthRegion');
    const region = searchParams.get('region');
    const province = searchParams.get('province');
    const year = searchParams.get('year');

    const where: any = {};

    if (level) where.level = level;
    if (healthRegion) where.healthRegion = healthRegion;
    if (region && region !== 'all') where.type = region;
    if (province && province !== 'all') where.province = province;
    if (year && year !== 'all') {
      const yearNumber = parseInt(year);
      const adYear = yearNumber - 543;
      where.signingDate = {
        gte: new Date(`${adYear}-01-01`),
        lt: new Date(`${adYear + 1}-01-01`)
      };
    }

    const skip = (page - 1) * limit;

    const [policies, total] = await Promise.all([
      prisma.publicPolicy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { signingDate: 'desc' },
        include: {
          images: {
            take: 1,
            select: { id: true, url: true }
          }
        }
      }),
      prisma.publicPolicy.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: policies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public policies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public policies' },
      { status: 500 }
    );
  }
}
