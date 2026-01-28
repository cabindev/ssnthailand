# SSN Thailand Public API Documentation

## Base URL

- **Production**: `https://database.ssnthailand.com`
- **Development**: `http://localhost:3000`

## Overview

SSN Thailand API ให้บริการข้อมูลเกี่ยวกับ:
- **กิจกรรมสร้างสรรค์ (Creative Activities)** - กิจกรรมทางวัฒนธรรมที่ปลอดเครื่องดื่มแอลกอฮอล์
- **ประเพณี (Traditions)** - ประเพณีไทยที่ปลอดเครื่องดื่มแอลกอฮอล์
- **กลุ่มชาติพันธุ์ (Ethnic Groups)** - ข้อมูลกลุ่มชาติพันธุ์และกิจกรรมปลอดเหล้า
- **นโยบายสาธารณะ (Public Policies)** - นโยบายที่เกี่ยวข้องกับการควบคุมเครื่องดื่มแอลกอฮอล์

---

## API Endpoints

### 1. Dashboard Overview

ดึงข้อมูลสรุปภาพรวมทั้งหมด พร้อมข้อมูล chart

```
GET /api/public/dashboard
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| year | string | ปี พ.ศ. (เช่น "2567") หรือ "all" |
| region | string | ภูมิภาค (เช่น "ภาคเหนือ") หรือ "all" |
| province | string | จังหวัด (เช่น "เชียงใหม่") หรือ "all" |

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "creativeActivityCount": 150,
      "traditionCount": 200,
      "publicPolicyCount": 100,
      "ethnicGroupCount": 50,
      "totalCount": 500
    },
    "charts": {
      "creativeActivity": [
        { "category": "พื้นที่สร้างสรรค์", "count": 50 }
      ],
      "tradition": [
        { "category": "ประเพณีท้องถิ่น", "count": 80 }
      ],
      "ethnicGroup": [
        { "category": "กลุ่มชาติพันธุ์ภาคเหนือ", "count": 20 }
      ],
      "publicPolicy": [
        { "level": "NATIONAL", "count": 10 },
        { "level": "PROVINCIAL", "count": 45 }
      ]
    },
    "locations": {
      "regions": ["ภาคเหนือ", "ภาคกลาง", "ภาคใต้", "ภาคอีสาน"],
      "provinces": ["กรุงเทพมหานคร", "เชียงใหม่", "ขอนแก่น"]
    },
    "filters": { "year": null, "region": null, "province": null }
  }
}
```

---

### 2. Creative Activities (กิจกรรมสร้างสรรค์)

#### รายการกิจกรรมสร้างสรรค์

```
GET /api/public/creative-activities
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | หน้าที่ต้องการ (default: 1) |
| limit | number | จำนวนรายการต่อหน้า (default: 10) |
| categoryId | string | ID หมวดหมู่ |
| subCategoryId | string | ID หมวดหมู่ย่อย |
| region | string | ภูมิภาค |
| province | string | จังหวัด |
| year | string | ปี พ.ศ. |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "name": "งานวิ่งปลอดเหล้า",
      "district": "เมือง",
      "amphoe": "เมืองเชียงใหม่",
      "province": "เชียงใหม่",
      "type": "ภาคเหนือ",
      "startYear": 2567,
      "description": "...",
      "summary": "...",
      "images": [{ "id": "...", "url": "/uploads/..." }],
      "category": { "id": "...", "name": "พื้นที่สร้างสรรค์" },
      "subCategory": { "id": "...", "name": "กิจกรรมกีฬา" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

#### รายละเอียดกิจกรรมสร้างสรรค์

```
GET /api/public/creative-activities/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "name": "งานวิ่งปลอดเหล้า",
    "district": "เมือง",
    "amphoe": "เมืองเชียงใหม่",
    "province": "เชียงใหม่",
    "type": "ภาคเหนือ",
    "village": "บ้านป่าแดด",
    "coordinatorName": "นายสมชาย",
    "phone": "081-xxx-xxxx",
    "description": "รายละเอียดกิจกรรม...",
    "summary": "สรุปกิจกรรม...",
    "results": "ผลลัพธ์...",
    "startYear": 2567,
    "videoLink": "https://youtube.com/...",
    "reportFileUrl": "/uploads/...",
    "viewCount": 100,
    "images": [{ "id": "...", "url": "/uploads/..." }],
    "category": { "id": "...", "name": "พื้นที่สร้างสรรค์" },
    "subCategory": { "id": "...", "name": "กิจกรรมกีฬา" },
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### 3. Traditions (ประเพณี)

#### รายการประเพณี

```
GET /api/public/traditions
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | หน้าที่ต้องการ (default: 1) |
| limit | number | จำนวนรายการต่อหน้า (default: 10) |
| categoryId | string | ID หมวดหมู่ |
| region | string | ภูมิภาค |
| province | string | จังหวัด |
| year | string | ปี พ.ศ. |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx456...",
      "name": "ประเพณีสงกรานต์ปลอดเหล้า",
      "district": "เมือง",
      "amphoe": "เมืองเชียงใหม่",
      "province": "เชียงใหม่",
      "type": "ภาคเหนือ",
      "startYear": 2560,
      "hasPolicy": true,
      "hasAnnouncement": true,
      "images": [{ "id": "...", "url": "/uploads/..." }],
      "category": { "id": "...", "name": "ประเพณีท้องถิ่น" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 200,
    "totalPages": 20
  }
}
```

#### รายละเอียดประเพณี

```
GET /api/public/traditions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx456...",
    "name": "ประเพณีสงกรานต์ปลอดเหล้า",
    "district": "เมือง",
    "amphoe": "เมืองเชียงใหม่",
    "province": "เชียงใหม่",
    "type": "ภาคเหนือ",
    "village": "บ้านป่าแดด",
    "coordinatorName": "นางสมหญิง",
    "phone": "082-xxx-xxxx",
    "history": "ประวัติความเป็นมา...",
    "alcoholFreeApproach": "แนวทางการจัดงานปลอดเหล้า...",
    "results": "ผลลัพธ์...",
    "startYear": 2560,
    "videoLink": "https://youtube.com/...",
    "policyFileUrl": "/uploads/...",
    "viewCount": 250,
    "hasPolicy": true,
    "hasAnnouncement": true,
    "hasInspector": true,
    "hasMonitoring": true,
    "hasCampaign": true,
    "hasAlcoholPromote": false,
    "images": [{ "id": "...", "url": "/uploads/..." }],
    "category": { "id": "...", "name": "ประเพณีท้องถิ่น" },
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
}
```

---

### 4. Ethnic Groups (กลุ่มชาติพันธุ์)

#### รายการกลุ่มชาติพันธุ์

```
GET /api/public/ethnic-groups
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | หน้าที่ต้องการ (default: 1) |
| limit | number | จำนวนรายการต่อหน้า (default: 10) |
| categoryId | string | ID หมวดหมู่ |
| region | string | ภูมิภาค |
| province | string | จังหวัด |
| year | string | ปี พ.ศ. |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx789...",
      "name": "กลุ่มชาติพันธุ์ม้ง",
      "activityName": "ประเพณีปีใหม่ม้ง",
      "province": "เชียงราย",
      "amphoe": "แม่สาย",
      "district": "แม่สาย",
      "type": "ภาคเหนือ",
      "startYear": 2565,
      "images": [{ "id": "...", "url": "/uploads/..." }],
      "category": { "id": "...", "name": "กลุ่มชาติพันธุ์ภาคเหนือ" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### รายละเอียดกลุ่มชาติพันธุ์

```
GET /api/public/ethnic-groups/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx789...",
    "name": "กลุ่มชาติพันธุ์ม้ง",
    "history": "ประวัติความเป็นมา...",
    "activityName": "ประเพณีปีใหม่ม้ง",
    "activityOrigin": "ที่มาของกิจกรรม...",
    "activityDetails": "รายละเอียดกิจกรรม...",
    "alcoholFreeApproach": "แนวทางปลอดเหล้า...",
    "results": "ผลลัพธ์...",
    "province": "เชียงราย",
    "amphoe": "แม่สาย",
    "district": "แม่สาย",
    "village": "บ้านดอยตุง",
    "type": "ภาคเหนือ",
    "startYear": 2565,
    "videoLink": "https://youtube.com/...",
    "fileUrl": "/uploads/...",
    "viewCount": 75,
    "images": [{ "id": "...", "url": "/uploads/..." }],
    "category": { "id": "...", "name": "กลุ่มชาติพันธุ์ภาคเหนือ" },
    "createdAt": "2024-02-01T00:00:00.000Z",
    "updatedAt": "2024-02-01T00:00:00.000Z"
  }
}
```

---

### 5. Public Policies (นโยบายสาธารณะ)

#### รายการนโยบายสาธารณะ

```
GET /api/public/public-policies
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | หน้าที่ต้องการ (default: 1) |
| limit | number | จำนวนรายการต่อหน้า (default: 10) |
| level | string | ระดับนโยบาย (ดู Policy Levels) |
| healthRegion | string | เขตสุขภาพ |
| region | string | ภูมิภาค |
| province | string | จังหวัด |
| year | string | ปี พ.ศ. |

**Policy Levels:**
- `NATIONAL` - ระดับชาติ
- `HEALTH_REGION` - ระดับเขตสุขภาพ
- `PROVINCIAL` - ระดับจังหวัด
- `DISTRICT` - ระดับอำเภอ
- `SUB_DISTRICT` - ระดับตำบล
- `VILLAGE` - ระดับหมู่บ้าน

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxabc...",
      "name": "ประกาศเขตปลอดเหล้า",
      "signingDate": "2024-01-01T00:00:00.000Z",
      "level": "PROVINCIAL",
      "healthRegion": "เขต 1",
      "district": "เมือง",
      "amphoe": "เมืองเชียงใหม่",
      "province": "เชียงใหม่",
      "type": "ภาคเหนือ",
      "images": [{ "id": "...", "url": "/uploads/..." }]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### รายละเอียดนโยบายสาธารณะ

```
GET /api/public/public-policies/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxabc...",
    "name": "ประกาศเขตปลอดเหล้า",
    "signingDate": "2024-01-01T00:00:00.000Z",
    "level": "PROVINCIAL",
    "healthRegion": "เขต 1",
    "district": "เมือง",
    "amphoe": "เมืองเชียงใหม่",
    "province": "เชียงใหม่",
    "village": null,
    "type": "ภาคเหนือ",
    "content": ["LAW_ENFORCEMENT", "ALCOHOL_FREE_TRADITION"],
    "summary": "สรุปนโยบาย...",
    "results": "ผลลัพธ์...",
    "videoLink": "https://youtube.com/...",
    "policyFileUrl": "/uploads/...",
    "viewCount": 150,
    "images": [{ "id": "...", "url": "/uploads/..." }],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Categories (หมวดหมู่)

ดึงรายการหมวดหมู่ทั้งหมด

```
GET /api/public/categories
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | ประเภทหมวดหมู่: `creative`, `tradition`, `ethnic` หรือไม่ระบุเพื่อดึงทั้งหมด |

**Response:**
```json
{
  "success": true,
  "data": {
    "creative": [
      {
        "id": "...",
        "name": "พื้นที่สร้างสรรค์",
        "subCategories": [
          { "id": "...", "name": "กิจกรรมกีฬา" },
          { "id": "...", "name": "กิจกรรมศิลปะ" }
        ],
        "activityCount": 50
      }
    ],
    "tradition": [
      {
        "id": "...",
        "name": "ประเพณีท้องถิ่น",
        "traditionCount": 80
      }
    ],
    "ethnic": [
      {
        "id": "...",
        "name": "กลุ่มชาติพันธุ์ภาคเหนือ",
        "ethnicGroupCount": 20
      }
    ]
  }
}
```

---

## Error Response

ทุก endpoint จะส่ง error response ในรูปแบบเดียวกัน:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `404` - Not Found
- `500` - Internal Server Error

---

## Usage Examples

### JavaScript/TypeScript (Fetch)

```typescript
const BASE_URL = 'https://database.ssnthailand.com';

// ดึงข้อมูล dashboard
async function getDashboard() {
  const response = await fetch(`${BASE_URL}/api/public/dashboard`);
  const data = await response.json();
  return data;
}

// ดึงรายการกิจกรรมสร้างสรรค์พร้อม pagination
async function getCreativeActivities(page = 1, limit = 10) {
  const response = await fetch(
    `${BASE_URL}/api/public/creative-activities?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data;
}

// ดึงรายละเอียดประเพณีตาม ID
async function getTraditionById(id: string) {
  const response = await fetch(`${BASE_URL}/api/public/traditions/${id}`);
  const data = await response.json();
  return data;
}

// ดึงนโยบายตามระดับ
async function getPoliciesByLevel(level: string) {
  const response = await fetch(
    `${BASE_URL}/api/public/public-policies?level=${level}`
  );
  const data = await response.json();
  return data;
}
```

### Next.js (Server Component)

```tsx
// app/page.tsx
const BASE_URL = 'https://database.ssnthailand.com';

async function getData() {
  const [dashboard, traditions, activities] = await Promise.all([
    fetch(`${BASE_URL}/api/public/dashboard`).then(res => res.json()),
    fetch(`${BASE_URL}/api/public/traditions?limit=5`).then(res => res.json()),
    fetch(`${BASE_URL}/api/public/creative-activities?limit=5`).then(res => res.json())
  ]);

  return { dashboard, traditions, activities };
}

export default async function HomePage() {
  const { dashboard, traditions, activities } = await getData();

  return (
    <div>
      <h1>SSN Thailand Data</h1>
      <p>Total Records: {dashboard.data.overview.totalCount}</p>
      {/* ... */}
    </div>
  );
}
```

### React Query

```tsx
import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://database.ssnthailand.com';

function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/public/dashboard`);
      return res.json();
    }
  });
}

function useCreativeActivities(page: number, filters?: {
  region?: string;
  province?: string;
  categoryId?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    ...filters
  });

  return useQuery({
    queryKey: ['creative-activities', page, filters],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/public/creative-activities?${params}`);
      return res.json();
    }
  });
}
```

---

## Image URLs

รูปภาพถูกเก็บใน `/uploads/` directory และสามารถเข้าถึงได้โดยใช้ URL เต็ม:

```
https://database.ssnthailand.com/uploads/creative-activity-images/example.jpg
https://database.ssnthailand.com/uploads/tradition-images/example.jpg
https://database.ssnthailand.com/uploads/ethnic-group-images/example.jpg
https://database.ssnthailand.com/uploads/public-policy-images/example.jpg
```

---

## Notes for Frontend Development

1. **CORS**: API รองรับ CORS สำหรับการเรียกใช้จาก frontend
2. **Caching**: แนะนำให้ใช้ client-side caching เพื่อลด API calls
3. **Pagination**: ทุก list endpoint รองรับ pagination ผ่าน `page` และ `limit` parameters
4. **Filtering**: สามารถกรองข้อมูลตาม region, province, year และ category
5. **View Count**: การเรียกดูรายละเอียด (/:id) จะเพิ่ม viewCount อัตโนมัติ

---

## Contact

หากมีปัญหาหรือข้อสงสัยเกี่ยวกับ API กรุณาติดต่อทีมพัฒนา SSN Thailand
