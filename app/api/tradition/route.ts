// app/api/tradition/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const traditionData: any = {
      categoryId: formData.get('categoryId') as string,
      name: formData.get('name') as string,
      district: formData.get('district') as string,
      amphoe: formData.get('amphoe') as string,
      province: formData.get('province') as string,
      type: formData.get('type') as string,
      village: formData.get('village') as string || null,
      coordinatorName: formData.get('coordinatorName') as string || null,
      phone: formData.get('phone') as string || null,
      history: formData.get('history') as string,
      alcoholFreeApproach: formData.get('alcoholFreeApproach') as string,
      results: formData.get('results') as string || null,
      startYear: parseInt(formData.get('startYear') as string),
      videoLink: formData.get('videoLink') as string || null,
    };

    // Handle numeric fields
    ['zipcode', 'district_code', 'amphoe_code', 'province_code'].forEach(field => {
      const value = formData.get(field);
      if (value && !isNaN(Number(value))) {
        traditionData[field] = Number(value);
      }
    });

    console.log('Tradition Data to be created:', traditionData); // For debugging

    // Create the tradition
    const tradition = await prisma.tradition.create({
      data: traditionData,
    });

    // Handle image uploads
    const images = formData.getAll('images') as File[];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + '-' + image.name.replace(/\s+/g, '-');
      const filepath = path.join(process.cwd(), 'public/uploads/tradition-images', filename);
      await writeFile(filepath, buffer);
      await prisma.image.create({
        data: {
          url: `/uploads/tradition-images/${filename}`,
          traditionId: tradition.id,
        },
      });
    }

    // Handle policy file upload
    const policyFile = formData.get('policyFile') as File;
    if (policyFile) {
      const buffer = Buffer.from(await policyFile.arrayBuffer());
      const filename = Date.now() + '-' + policyFile.name.replace(/\s+/g, '-');
      const filepath = path.join(process.cwd(), 'public/uploads/tradition-policy-files', filename);
      await writeFile(filepath, buffer);
      await prisma.tradition.update({
        where: { id: tradition.id },
        data: { policyFileUrl: `/uploads/tradition-policy-files/${filename}` },
      });
    }

    return NextResponse.json(tradition, { status: 201 });
  } catch (error) {
    console.error('Error creating tradition:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const traditions = await prisma.tradition.findMany({
      include: { images: true, category: true },
    });
    return NextResponse.json(traditions);
  } catch (error) {
    console.error('Error fetching traditions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}