'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FaUser, FaPhone, FaCalendar, FaEye, FaVideo, FaFilePdf, FaMapMarkerAlt, FaEdit, FaHome, FaList } from 'react-icons/fa';
import { Spin, message, Modal } from 'antd';

interface CreativeActivity {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  category: { name: string };
  subCategory: { name: string };
  district: string;
  amphoe: string;
  province: string;
  type: string;
  village?: string;
  coordinatorName: string;
  phone?: string;
  description: string;
  summary: string;
  results?: string;
  startYear: number;
  images: { id: string; url: string }[];
  videoLink?: string;
  reportFileUrl?: string;
  viewCount: number;
}

export default function CreativeActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState<CreativeActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const fetchActivity = useCallback(async () => {
    try {
      const response = await axios.get(`/api/creative-activity/${id}`);
      setActivity(response.data);
      await axios.put(`/api/creative-activity/${id}`, { action: 'incrementViewCount' }, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching activity:', error);
      message.error('ไม่สามารถโหลดข้อมูลกิจกรรมสร้างสรรค์ได้');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!activity) {
    return <div className="text-center text-2xl mt-10">ไม่พบข้อมูลกิจกรรมสร้างสรรค์</div>;
  }

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/creative-activity" className="inline-block mb-8">
          <div className="text-green-600 hover:text-green-700 transition-colors duration-300">
            <FaHome className="inline mr-2" />
            กลับสู่หน้ารวมกิจกรรมสร้างสรรค์
          </div>
        </Link>

        {/* Hero Section */}
        <div className="relative aspect-video mb-12 rounded-lg overflow-hidden shadow-xl">
          {activity.images && activity.images.length > 0 ? (
            <img
              src={activity.images[0].url}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">ไม่มีรูปภาพ</p>
            </div>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t 
                       from-black via-transparent to-transparent
                        flex items-end"
          >
            <h1 className="text-2xl md:text-md font-bold text-white p-8">
              {activity.name}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-medium mb-6 text-green-600 border-b pb-2">
              ข้อมูลทั่วไป
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="mb-4 text-gray-700">
                  <span className="font-medium">ประเภท:</span>
                  <span className="font-extralight ml-2">
                    {activity.category.name}
                  </span>
                </p>
                <p className="mb-4 text-gray-700">
                  <span className="font-medium">หมวดหมู่ย่อย:</span>
                  <span className="font-extralight ml-2">
                    {activity.subCategory.name}
                  </span>
                </p>
                <p className="mb-4 flex items-start">
                  <FaMapMarkerAlt className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    <span className="font-medium">พื้นที่:</span>
                    <span className="font-extralight ml-2">
                      {activity.village ? `${activity.village}, ` : ""}
                      {activity.district}, {activity.amphoe},{" "}
                      {activity.province}
                    </span>
                  </span>
                </p>
                <p className="mb-4 text-gray-700">
                  <span className="font-medium">ภาค:</span>
                  <span className="font-extralight ml-2">{activity.type}</span>
                </p>
              </div>
              <div>
                <p className="mb-4 flex items-center">
                  <FaCalendar className="mr-2 text-green-500" />
                  <span className="font-medium">ปีที่เริ่มดำเนินการ:</span>
                  <span className="font-extralight ml-2">
                    {activity.startYear}
                  </span>
                </p>
                <p className="mb-4 flex items-center">
                  <FaUser className="mr-2 text-green-500" />
                  <span className="font-medium">ผู้ประสานงาน:</span>
                  <span className="font-extralight ml-2">
                    {activity.coordinatorName}
                  </span>
                </p>
                {activity.phone && (
                  <p className="mb-4 flex items-center">
                    <FaPhone className="mr-2 text-green-500" />
                    <span className="font-medium">เบอร์ติดต่อ:</span>
                    <span className="font-extralight ml-2">
                      {activity.phone}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <h2 className="text-3xl font-medium my-6 text-green-600 border-b pb-2">
              รายละเอียดกิจกรรม
            </h2>
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700">
                รายละเอียด
              </h3>
              <p className="text-gray-600 leading-relaxed font-extralight">
                {activity.description}
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700">สรุป</h3>
              <p className="text-gray-600 leading-relaxed font-extralight">
                {activity.summary}
              </p>
            </div>
            {activity.results && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-gray-700">
                  ผลลัพธ์
                </h3>
                <p className="text-gray-800 leading-relaxed font-light">
                  {activity.results}
                </p>
              </div>
            )}
          </div>

          {activity.images && activity.images.length > 1 && (
            <div className="p-8 bg-gray-50">
              <h2 className="text-3xl font-medium mb-6 text-green-600 border-b pb-2">
                รูปภาพประกอบเพิ่มเติม
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activity.images.slice(1).map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt="รูปภาพประกอบ"
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleImageClick(img.url)}
                  />
                ))}
              </div>
            </div>
          )}

          {(activity.videoLink || activity.reportFileUrl) && (
            <div className="p-8">
              <h2 className="text-3xl font-medium mb-6 text-green-600 border-b pb-2">
                ไฟล์และลิงก์ที่เกี่ยวข้อง
              </h2>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                {activity.videoLink && (
                  <a
                    href={activity.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-100 text-green-700 px-6 py-3 rounded-full hover:bg-green-200 transition duration-300 mb-4 sm:mb-0 font-medium"
                  >
                    <FaVideo className="mr-2" />
                    ดูวิดีโอประกอบ
                  </a>
                )}
                {activity.reportFileUrl && (
                  <a
                    href={activity.reportFileUrl}
                    download
                    className="flex items-center justify-center bg-green-100 text-green-700 px-6 py-3 rounded-full hover:bg-green-200 transition duration-300 font-medium"
                  >
                    <FaFilePdf className="mr-2" />
                    ดาวน์โหลดไฟล์รายงาน
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between items-center text-gray-600">
          <Link
            href={`/dashboard/creative-activity/edit/${activity.id}`}
            className="flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
          >
            <FaEdit className="mr-2" />
            แก้ไขกิจกรรม
          </Link>
          <div className="flex items-center">
            <FaEye className="mr-2" />
            <p className="font-extralight">
              เข้าชมทั้งหมด {activity.viewCount} ครั้ง
            </p>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        footer={null}
        onCancel={() => setSelectedImage(null)}
        width="auto"
        className="max-w-[95%] md:max-w-[80%] lg:max-w-[60%] mx-auto"
        styles={{
          body: { padding: 0 },
          content: {
            borderRadius: "0.5rem",
            overflow: "hidden",
          },
        }}
        centered
      >
        {selectedImage && (
          <div className="relative aspect-auto max-h-[90vh] overflow-hidden">
            <img
              src={selectedImage}
              alt="รูปภาพขยาย"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}