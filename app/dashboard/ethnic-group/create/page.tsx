// app/dashboard/ethnic-group/create/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Upload, Button, message, Card, Col, Row } from 'antd';
import { UploadOutlined, LinkOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { data } from '@/app/data/regions';
import { UploadFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';
import { useSession } from 'next-auth/react';

const { Option } = Select;
const { TextArea } = Input;

interface EthnicCategory {
  id: string;
  name: string;
}

interface RegionData {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
  district_code: number;
  amphoe_code: number;
  province_code: number;
  type: string;
}

interface FormValues {
  categoryId: string;
  name: string;
  location: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode?: number;
  district_code?: number;
  amphoe_code?: number;
  province_code?: number;
  type: string;
  village?: string;
  history: string;
  activityName: string;
  activityOrigin: string;
  activityDetails: string;
  alcoholFreeApproach: string;
  results?: string;
  startYear: number;
  images?: UploadFile[];
  videoLink?: string;
  fileUrl?: UploadFile;
}

export default function CreateEthnicGroup() {
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<EthnicCategory[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [file, setFile] = useState<UploadFile[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
    const uniqueDistricts = Array.from(new Set(data.map(item => `${item.district}, ${item.amphoe}, ${item.province}`)));
    setDistricts(uniqueDistricts);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<EthnicCategory[]>('/api/ethnic-category');
      setCategories(response.data);
    } catch (error) {
      message.error('ไม่สามารถโหลดประเภทกลุ่มชาติพันธุ์ได้');
    }
  };

  const handleDistrictChange = (value: string) => {
    const [district, amphoe, province] = value.split(', ');
    const regionData = data.find(d => d.district === district && d.amphoe === amphoe && d.province === province) as RegionData | undefined;
    if (regionData) {
      const formValues: any = {
        location: value,
        district: regionData.district,
        amphoe: regionData.amphoe,
        province: regionData.province,
        type: regionData.type,
        zipcode: regionData.zipcode,
        district_code: regionData.district_code,
        amphoe_code: regionData.amphoe_code,
        province_code: regionData.province_code,
      };

      form.setFieldsValue(formValues);
      setAutoFilledFields(new Set(['district', 'amphoe', 'province', 'type', 'zipcode', 'district_code', 'amphoe_code', 'province_code']));
    }
  };

  const handleImageChange = async (info: any) => {
    const { fileList } = info;
    const compressedFileList = await Promise.all(
      fileList.map(async (file: UploadFile) => {
        if (file.originFileObj) {
          const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/webp',
          };
          try {
            const compressedFile = await imageCompression(file.originFileObj, options);
            const webpFile = new File([compressedFile], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
            return {
              ...file,
              originFileObj: webpFile,
              name: webpFile.name,
              type: 'image/webp',
            };
          } catch (error) {
            console.error('Error compressing image:', error);
            return file;
          }
        }
        return file;
      })
    );
    setFileList(compressedFileList);
  };

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      if (!session?.user?.email) {
        message.error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'images') {
          fileList.forEach((file) => {
            if (file.originFileObj) {
              formData.append('images', file.originFileObj);
            }
          });
        } else if (key === 'fileUrl' && file.length > 0) {
          formData.append('fileUrl', file[0].originFileObj as File);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      await axios.post('/api/ethnic-group', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('สร้างข้อมูลกลุ่มชาติพันธุ์สำเร็จ');
      router.push('/dashboard/ethnic-group');
    } catch (error) {
      console.error('Error creating ethnic group:', error);
      message.error('ไม่สามารถสร้างข้อมูลกลุ่มชาติพันธุ์ได้');
    } finally {
      setLoading(false);
    }
  };



  const renderFormItem = (name: string, label: string, component: React.ReactNode, rules?: any[], hidden: boolean = false) => (
    <Form.Item 
      name={name} 
      label={hidden ? undefined : label} 
      rules={rules}
      className={autoFilledFields.has(name) ? 'auto-filled' : ''}
      hidden={hidden}
    >
      {component}
    </Form.Item>
  );

  return (
    <div className="container mx-auto p-4">
      <style jsx global>{`
        .auto-filled .ant-input,
        .auto-filled .ant-input-number-input,
        .auto-filled .ant-select-selector {
          background-color: #e6f7e6 !important;
        }
      `}</style>
      <h1 className="text-2xl font-bold mb-4">สร้างข้อมูลกลุ่มชาติพันธุ์ใหม่</h1>
      <Form<FormValues> form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="ข้อมูลทั่วไป" className="mb-4">
              {renderFormItem("categoryId", "ประเภทกลุ่มชาติพันธุ์", 
                <Select placeholder="เลือกประเภทกลุ่มชาติพันธุ์">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>,
                [{ required: true, message: "กรุณาเลือกประเภทกลุ่มชาติพันธุ์" }]
              )}

              {renderFormItem("name", "ชื่อกลุ่มชาติพันธุ์", 
                <Input />,
                [{ required: true, message: "กรุณากรอกชื่อกลุ่มชาติพันธุ์" }]
              )}

              {renderFormItem("location", "ตำบล > อำเภอ > จังหวัด", 
                <Select
                  showSearch
                  placeholder="เลือกตำบล > อำเภอ > จังหวัด"
                  optionFilterProp="children"
                  onChange={handleDistrictChange}
                  filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                >
                  {districts.map((district) => (
                    <Option key={district} value={district}>{district}</Option>
                  ))}
                </Select>,
                [{ required: true, message: "กรุณาเลือกตำบล" }]
              )}

              {renderFormItem("district", "ตำบล", <Input readOnly />, [{ required: true }])}
              {renderFormItem("amphoe", "อำเภอ", <Input readOnly />, [{ required: true }])}
              {renderFormItem("province", "จังหวัด", <Input readOnly />, [{ required: true }])}
              {renderFormItem("type", "ภาค", <Input readOnly />, [{ required: true }])}

              {renderFormItem("zipcode", "รหัสไปรษณีย์", <InputNumber />, [], true)}
              {renderFormItem("district_code", "รหัสตำบล", <InputNumber />, [], true)}
              {renderFormItem("amphoe_code", "รหัสอำเภอ", <InputNumber />, [], true)}
              {renderFormItem("province_code", "รหัสจังหวัด", <InputNumber />, [], true)}
              {renderFormItem("type", "ภาค", <Input readOnly />, [{ required: true }])}
              {renderFormItem("village", "หมู่บ้าน", <Input />)}

          
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="รายละเอียด" className="mb-4">
              {renderFormItem("history", "ประวัติของกลุ่มชาติพันธุ์เบื้องต้น", 
                <TextArea rows={4} />,
                [{ required: true, message: "กรุณากรอกประวัติของกลุ่มชาติพันธุ์" }]
              )}

              {renderFormItem("activityName", "ชื่อกิจกรรม/งานชาติพันธุ์", 
                <Input />,
                [{ required: true, message: "กรุณากรอกชื่อกิจกรรม/งานชาติพันธุ์" }]
              )}

              {renderFormItem("activityOrigin", "ที่มาของกิจกรรม/งานชาติพันธุ์", 
                <TextArea rows={4} />,
                [{ required: true, message: "กรุณากรอกที่มาของกิจกรรม/งานชาติพันธุ์" }]
              )}

              {renderFormItem("activityDetails", "รายละเอียดการดำเนินกิจกรรม", 
                <TextArea rows={4} />,
                [{ required: true, message: "กรุณากรอกรายละเอียดการดำเนินกิจกรรม" }]
              )}

              {renderFormItem("alcoholFreeApproach", "แนวทางการจัดงานแบบปลอดเหล้า", 
                <TextArea rows={4} />,
                [{ required: true, message: "กรุณากรอกแนวทางการจัดงานแบบปลอดเหล้า" }]
              )}

              {renderFormItem("startYear", "ปีที่เริ่มดำเนินการให้ปลอดเหล้า (พ.ศ.)", 
                <InputNumber min={2400} max={2600} className="w-full" />,
                [{ required: true, message: "กรุณากรอกปีที่เริ่มดำเนินการ" }]
              )}

              {renderFormItem("results", "ผลลัพธ์จากการดำเนินงาน", <TextArea rows={4} />)}

              {renderFormItem("images", "รูปภาพประกอบ", 
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>อัพโหลดรูปภาพ</Button>
                </Upload>
              )}
              <p>จำนวนรูปภาพที่เลือก: {fileList.length} (สามารถเลือกได้หลายรูป)</p>

              {renderFormItem("videoLink", "ลิงก์วิดีโอประกอบ", 
                <Input prefix={<LinkOutlined />} placeholder="https://www.example.com/video" />
              )}

              {renderFormItem("fileUrl", "ไฟล์ประกอบ", 
                <Upload
                  fileList={file}
                  onChange={({ fileList }) => setFile(fileList)}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>อัพโหลดไฟล์</Button>
                </Upload>
              )}
              {file.length > 0 && <p>ไฟล์ที่เลือก: {file[0].name}</p>}
            </Card>
          </Col>
        </Row>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={loading}>
            สร้างข้อมูลกลุ่มชาติพันธุ์
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}