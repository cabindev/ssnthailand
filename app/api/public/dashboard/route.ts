// app/api/public/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/public/dashboard - ดึงข้อมูล dashboard overview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const region = searchParams.get('region');
    const province = searchParams.get('province');

    // Build where clauses
    const buildWhereClause = (tableName: string) => {
      const where: any = {};

      if (region && region !== 'all') {
        where.type = region;
      }

      if (province && province !== 'all') {
        where.province = province;
      }

      if (year && year !== 'all') {
        const yearNumber = parseInt(year);
        if (tableName === 'publicPolicy') {
          const adYear = yearNumber - 543;
          where.signingDate = {
            gte: new Date(`${adYear}-01-01`),
            lt: new Date(`${adYear + 1}-01-01`)
          };
        } else {
          where.startYear = yearNumber;
        }
      }

      return where;
    };

    // Fetch counts
    const [
      creativeActivityCount,
      traditionCount,
      publicPolicyCount,
      ethnicGroupCount
    ] = await Promise.all([
      prisma.creativeActivity.count({ where: buildWhereClause('creativeActivity') }),
      prisma.tradition.count({ where: buildWhereClause('tradition') }),
      prisma.publicPolicy.count({ where: buildWhereClause('publicPolicy') }),
      prisma.ethnicGroup.count({ where: buildWhereClause('ethnicGroup') })
    ]);

    // Fetch chart data
    const [
      creativeCategories,
      traditionCategories,
      ethnicCategories,
      policyLevels
    ] = await Promise.all([
      prisma.creativeCategory.findMany({
        include: {
          _count: { select: { activities: true } }
        }
      }),
      prisma.traditionCategory.findMany({
        include: {
          _count: { select: { traditions: true } }
        }
      }),
      prisma.ethnicCategory.findMany({
        include: {
          _count: { select: { ethnicGroups: true } }
        }
      }),
      prisma.publicPolicy.groupBy({
        by: ['level'],
        _count: { _all: true }
      })
    ]);

    // Fetch locations data
    const [traditionData, policyData, ethnicData, creativeData] = await Promise.all([
      prisma.tradition.findMany({
        select: { type: true, province: true },
        distinct: ['type', 'province']
      }),
      prisma.publicPolicy.findMany({
        select: { type: true, province: true },
        distinct: ['type', 'province']
      }),
      prisma.ethnicGroup.findMany({
        select: { type: true, province: true },
        distinct: ['type', 'province']
      }),
      prisma.creativeActivity.findMany({
        select: { type: true, province: true },
        distinct: ['type', 'province']
      })
    ]);

    const allLocations = [...traditionData, ...policyData, ...ethnicData, ...creativeData];
    const regions = [...new Set(allLocations.map(item => item.type).filter(Boolean))].sort();
    const provinces = [...new Set(allLocations.map(item => item.province).filter(Boolean))].sort();

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          creativeActivityCount,
          traditionCount,
          publicPolicyCount,
          ethnicGroupCount,
          totalCount: creativeActivityCount + traditionCount + publicPolicyCount + ethnicGroupCount
        },
        charts: {
          creativeActivity: creativeCategories.map(cat => ({
            category: cat.name,
            count: cat._count.activities
          })),
          tradition: traditionCategories.map(cat => ({
            category: cat.name,
            count: cat._count.traditions
          })),
          ethnicGroup: ethnicCategories.map(cat => ({
            category: cat.name,
            count: cat._count.ethnicGroups
          })),
          publicPolicy: policyLevels.map(level => ({
            level: level.level,
            count: level._count._all
          }))
        },
        locations: {
          regions,
          provinces
        },
        filters: { year, region, province }
      }
    });
  } catch (error) {
    console.error('Error fetching public dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
