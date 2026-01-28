# SSN Thailand - New Frontend Application

## Project Overview

สร้างเว็บไซต์ใหม่ชื่อ **ssnthailand** เพื่อแสดงข้อมูลจากระบบฐานข้อมูล SSN Thailand โดยดึงข้อมูลผ่าน Public API

## Tech Stack

```json
{
  "framework": "Next.js 14+",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui": "Ant Design",
  "charts": "@ant-design/charts",
  "router": "App Router",
  "dataFetching": "Server Actions + Server Components",
  "icons": "lucide-react หรือ @ant-design/icons"
}
```

## Setup Command

```bash
npx create-next-app@latest ssnthailand --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

## Dependencies to Install

```bash
npm install antd @ant-design/charts @ant-design/icons lucide-react
```

## Project Structure

```
ssnthailand/
├── app/
│   ├── layout.tsx              # Root layout พร้อม AntdRegistry
│   ├── page.tsx                # หน้าแรก (Homepage)
│   ├── globals.css             # Tailwind + Custom styles
│   ├── creative-activities/
│   │   ├── page.tsx            # รายการกิจกรรมสร้างสรรค์
│   │   └── [id]/page.tsx       # รายละเอียดกิจกรรม
│   ├── traditions/
│   │   ├── page.tsx            # รายการประเพณี
│   │   └── [id]/page.tsx       # รายละเอียดประเพณี
│   ├── ethnic-groups/
│   │   ├── page.tsx            # รายการกลุ่มชาติพันธุ์
│   │   └── [id]/page.tsx       # รายละเอียดกลุ่มชาติพันธุ์
│   └── public-policies/
│       ├── page.tsx            # รายการนโยบายสาธารณะ
│       └── [id]/page.tsx       # รายละเอียดนโยบาย
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Footer
│   ├── home/
│   │   ├── HeroSection.tsx     # Hero banner
│   │   ├── StatsCards.tsx      # การ์ดแสดงสถิติ
│   │   ├── ChartsSection.tsx   # กราฟแสดงข้อมูล
│   │   ├── RecentItems.tsx     # รายการล่าสุด
│   │   └── MapSection.tsx      # แผนที่ (optional)
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx
│   └── charts/
│       ├── PieChart.tsx
│       ├── BarChart.tsx
│       └── ColumnChart.tsx
├── lib/
│   ├── api.ts                  # API functions
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript types
├── public/
│   └── images/
├── tailwind.config.ts
└── next.config.js
```

---

## API Configuration

### Base URL

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://database.ssnthailand.com';

// API Endpoints
export const API_ENDPOINTS = {
  dashboard: `${API_BASE_URL}/api/public/dashboard`,
  creativeActivities: `${API_BASE_URL}/api/public/creative-activities`,
  traditions: `${API_BASE_URL}/api/public/traditions`,
  ethnicGroups: `${API_BASE_URL}/api/public/ethnic-groups`,
  publicPolicies: `${API_BASE_URL}/api/public/public-policies`,
  categories: `${API_BASE_URL}/api/public/categories`,
};
```

### API Response Types

```typescript
// types/index.ts

// Dashboard Overview
interface DashboardOverview {
  creativeActivityCount: number;
  traditionCount: number;
  publicPolicyCount: number;
  ethnicGroupCount: number;
  totalCount: number;
}

// Chart Data
interface ChartItem {
  category?: string;
  level?: string;
  count: number;
}

interface DashboardCharts {
  creativeActivity: ChartItem[];
  tradition: ChartItem[];
  ethnicGroup: ChartItem[];
  publicPolicy: ChartItem[];
}

// Creative Activity
interface CreativeActivity {
  id: string;
  name: string;
  district: string;
  amphoe: string;
  province: string;
  type: string;
  startYear: number;
  description: string;
  summary: string;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
  subCategory: { id: string; name: string };
}

// Tradition
interface Tradition {
  id: string;
  name: string;
  district: string;
  amphoe: string;
  province: string;
  type: string;
  startYear: number;
  history: string;
  alcoholFreeApproach: string;
  hasPolicy: boolean;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
}

// Ethnic Group
interface EthnicGroup {
  id: string;
  name: string;
  activityName: string;
  province: string;
  amphoe: string;
  district: string;
  type: string;
  startYear: number;
  history: string;
  images: { id: string; url: string }[];
  category: { id: string; name: string };
}

// Public Policy
interface PublicPolicy {
  id: string;
  name: string;
  signingDate: string;
  level: 'NATIONAL' | 'HEALTH_REGION' | 'PROVINCIAL' | 'DISTRICT' | 'SUB_DISTRICT' | 'VILLAGE';
  province: string;
  type: string;
  summary: string;
  images: { id: string; url: string }[];
}

// Pagination
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  error?: string;
}
```

---

## Design Specifications

### Color Palette (Green & White Theme)

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',  // Emerald
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'sans-serif'],
      },
    },
  },
};
```

### Typography (Small, Professional)

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

:root {
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.8125rem; /* 13px */
  --font-size-base: 0.875rem; /* 14px - default */
  --font-size-lg: 1rem;      /* 16px */
  --font-size-xl: 1.125rem;  /* 18px */
}

body {
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.6;
  color: #374151;
  background-color: #f9fafb;
}

h1 { font-size: 1.5rem; font-weight: 600; }
h2 { font-size: 1.25rem; font-weight: 600; }
h3 { font-size: 1.125rem; font-weight: 500; }
h4 { font-size: 1rem; font-weight: 500; }

.text-muted { color: #6b7280; font-size: 0.8125rem; }
```

---

## Homepage Layout Design

### Section 1: Hero Banner

```tsx
// components/home/HeroSection.tsx
// - พื้นหลังสีเขียวไล่เฉด (gradient)
// - หัวข้อ: "สำนักงานเครือข่ายองค์กรงดเหล้า"
// - คำอธิบายสั้นๆ
// - ปุ่ม CTA: "ดูข้อมูลทั้งหมด" / "เกี่ยวกับเรา"
```

### Section 2: Stats Cards (4 การ์ด)

```tsx
// components/home/StatsCards.tsx
// แสดง 4 การ์ดสถิติจาก dashboard.overview:
// 1. กิจกรรมสร้างสรรค์ (creativeActivityCount) - icon: Palette
// 2. ประเพณี (traditionCount) - icon: Heart
// 3. นโยบายสาธารณะ (publicPolicyCount) - icon: FileText
// 4. กลุ่มชาติพันธุ์ (ethnicGroupCount) - icon: Users

// Design:
// - การ์ดสีขาว border เขียวอ่อน
// - ตัวเลขใหญ่สีเขียว
// - Icon เล็กๆ มุมขวาบน
// - Hover effect เล็กน้อย
```

### Section 3: Charts Section (2x2 Grid)

```tsx
// components/home/ChartsSection.tsx
// ใช้ @ant-design/charts แสดง 4 กราฟ:

// 1. Pie Chart - กิจกรรมสร้างสรรค์ตามหมวดหมู่
// 2. Pie Chart - กลุ่มชาติพันธุ์ตามหมวดหมู่
// 3. Bar Chart - ประเพณีตามหมวดหมู่
// 4. Column Chart - นโยบายตามระดับ

// Design:
// - สีเขียวหลายเฉด
// - Legend ด้านล่าง
// - Tooltip แสดงรายละเอียด
```

### Section 4: Recent Items (Tabs)

```tsx
// components/home/RecentItems.tsx
// Tabs: กิจกรรมล่าสุด | ประเพณีล่าสุด | นโยบายล่าสุด

// แต่ละ Tab แสดง:
// - รายการ 6 items (Grid 3 columns)
// - แต่ละ item มี: รูปภาพ, ชื่อ, จังหวัด, วันที่
// - ปุ่ม "ดูทั้งหมด" ลิงก์ไปหน้า list
```

### Section 5: Quick Links / Features

```tsx
// components/home/FeaturesSection.tsx
// แสดง 4 features หลัก:
// 1. กิจกรรมสร้างสรรค์ - ลิงก์ไป /creative-activities
// 2. ประเพณีปลอดเหล้า - ลิงก์ไป /traditions
// 3. กลุ่มชาติพันธุ์ - ลิงก์ไป /ethnic-groups
// 4. นโยบายสาธารณะ - ลิงก์ไป /public-policies
```

---

## Sample Code

### API Functions

```typescript
// lib/api.ts
const API_BASE_URL = 'https://database.ssnthailand.com';

export async function getDashboard() {
  const res = await fetch(`${API_BASE_URL}/api/public/dashboard`, {
    next: { revalidate: 60 } // Cache 60 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function getCreativeActivities(params?: {
  page?: number;
  limit?: number;
  region?: string;
  province?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.region) searchParams.set('region', params.region);
  if (params?.province) searchParams.set('province', params.province);

  const res = await fetch(
    `${API_BASE_URL}/api/public/creative-activities?${searchParams}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function getCreativeActivityById(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/public/creative-activities/${id}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json();
}

// เพิ่ม functions สำหรับ traditions, ethnic-groups, public-policies ในรูปแบบเดียวกัน
```

### Homepage (Server Component)

```tsx
// app/page.tsx
import { getDashboard, getCreativeActivities, getTraditions } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import StatsCards from '@/components/home/StatsCards';
import ChartsSection from '@/components/home/ChartsSection';
import RecentItems from '@/components/home/RecentItems';
import FeaturesSection from '@/components/home/FeaturesSection';

export default async function HomePage() {
  const [dashboardRes, activitiesRes, traditionsRes] = await Promise.all([
    getDashboard(),
    getCreativeActivities({ limit: 6 }),
    getTraditions({ limit: 6 })
  ]);

  const dashboard = dashboardRes.data;
  const recentActivities = activitiesRes.data;
  const recentTraditions = traditionsRes.data;

  return (
    <main className="min-h-screen">
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <StatsCards overview={dashboard.overview} />
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            ภาพรวมข้อมูล
          </h2>
          <ChartsSection charts={dashboard.charts} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <RecentItems
          activities={recentActivities}
          traditions={recentTraditions}
        />
      </section>

      <FeaturesSection />
    </main>
  );
}
```

### Stats Cards Component

```tsx
// components/home/StatsCards.tsx
import { Palette, Heart, FileText, Users } from 'lucide-react';

interface StatsCardsProps {
  overview: {
    creativeActivityCount: number;
    traditionCount: number;
    publicPolicyCount: number;
    ethnicGroupCount: number;
  };
}

const stats = [
  { key: 'creativeActivityCount', label: 'กิจกรรมสร้างสรรค์', icon: Palette, color: 'text-emerald-600' },
  { key: 'traditionCount', label: 'ประเพณี', icon: Heart, color: 'text-green-600' },
  { key: 'publicPolicyCount', label: 'นโยบายสาธารณะ', icon: FileText, color: 'text-teal-600' },
  { key: 'ethnicGroupCount', label: 'กลุ่มชาติพันธุ์', icon: Users, color: 'text-lime-600' },
];

export default function StatsCards({ overview }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const count = overview[stat.key as keyof typeof overview];

        return (
          <div
            key={stat.key}
            className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-semibold ${stat.color}`}>
                  {count.toLocaleString()}
                </p>
              </div>
              <Icon className={`w-5 h-5 ${stat.color} opacity-60`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Charts Section Component

```tsx
// components/home/ChartsSection.tsx
'use client';

import { Pie, Bar, Column } from '@ant-design/charts';

interface ChartsSectionProps {
  charts: {
    creativeActivity: { category: string; count: number }[];
    tradition: { category: string; count: number }[];
    ethnicGroup: { category: string; count: number }[];
    publicPolicy: { level: string; count: number }[];
  };
}

const greenColors = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#10b981', '#059669'];

export default function ChartsSection({ charts }: ChartsSectionProps) {
  const pieConfig = (data: any[], angleField: string = 'count', colorField: string = 'category') => ({
    data,
    angleField,
    colorField,
    radius: 0.8,
    innerRadius: 0.6,
    color: greenColors,
    label: {
      type: 'spider',
      content: '{name}: {value}',
      style: { fontSize: 11 },
    },
    legend: {
      position: 'bottom' as const,
      itemName: { style: { fontSize: 11 } },
    },
    interactions: [{ type: 'element-active' }],
  });

  const barConfig = (data: any[]) => ({
    data,
    xField: 'count',
    yField: 'category',
    color: '#22c55e',
    barWidthRatio: 0.6,
    label: {
      position: 'right' as const,
      style: { fontSize: 11 },
    },
  });

  const columnConfig = (data: any[]) => ({
    data: data.map(d => ({ ...d, category: translateLevel(d.level) })),
    xField: 'category',
    yField: 'count',
    color: '#16a34a',
    columnWidthRatio: 0.5,
    label: {
      position: 'top' as const,
      style: { fontSize: 11 },
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">กิจกรรมสร้างสรรค์ตามหมวดหมู่</h3>
        <Pie {...pieConfig(charts.creativeActivity)} height={250} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">กลุ่มชาติพันธุ์ตามหมวดหมู่</h3>
        <Pie {...pieConfig(charts.ethnicGroup)} height={250} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">ประเพณีตามหมวดหมู่</h3>
        <Bar {...barConfig(charts.tradition)} height={250} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">นโยบายตามระดับ</h3>
        <Column {...columnConfig(charts.publicPolicy)} height={250} />
      </div>
    </div>
  );
}

function translateLevel(level: string): string {
  const levels: Record<string, string> = {
    NATIONAL: 'ระดับชาติ',
    HEALTH_REGION: 'เขตสุขภาพ',
    PROVINCIAL: 'จังหวัด',
    DISTRICT: 'อำเภอ',
    SUB_DISTRICT: 'ตำบล',
    VILLAGE: 'หมู่บ้าน',
  };
  return levels[level] || level;
}
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://database.ssnthailand.com
```

---

## Additional Notes

1. **Server Components**: ใช้ Server Components เป็นหลักเพื่อ SEO และ performance
2. **Client Components**: ใช้เฉพาะส่วนที่ต้อง interactive (charts, tabs, filters)
3. **Caching**: ใช้ `next: { revalidate: 60 }` สำหรับ ISR
4. **Error Handling**: เพิ่ม error boundaries และ loading states
5. **Responsive**: รองรับ mobile, tablet, desktop
6. **Accessibility**: ใส่ aria-labels และ semantic HTML
7. **Image Optimization**: ใช้ next/image สำหรับรูปภาพจาก API

---

## Checklist

- [ ] Setup Next.js project ด้วย TypeScript + Tailwind
- [ ] Install Ant Design และ @ant-design/charts
- [ ] สร้าง API functions ใน lib/api.ts
- [ ] สร้าง Types ใน types/index.ts
- [ ] สร้าง Layout (Header, Footer)
- [ ] สร้าง Homepage components ทั้งหมด
- [ ] สร้างหน้า list สำหรับแต่ละประเภทข้อมูล
- [ ] สร้างหน้า detail สำหรับแต่ละประเภทข้อมูล
- [ ] เพิ่ม Loading states และ Error handling
- [ ] Test responsive design
- [ ] Deploy
