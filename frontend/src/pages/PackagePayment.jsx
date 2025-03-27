import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "../components/payment/paymentForm";
import { getAdsPackageById } from "../services/api/AdsPackageApi";

const PackagePayment = () => {
  const location = useLocation();
  const { state } = location;
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // ตรวจสอบว่ามีข้อมูล package ใน state หรือไม่
        if (!state?.package) {
          throw new Error("No package data available");
        }

        // ถ้ามีข้อมูลใน state อยู่แล้ว ไม่ต้องเรียก API
        setPackageData(state.package);
        
        // หรือถ้าต้องการข้อมูลล่าสุดจาก API:
        // const response = await getAdsPackageById(state.package.package_id);
        // setPackageData(response);
        
      } catch (error) {
        console.error("Failed to fetch package:", error);
        setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
        // นำผู้ใช้กลับไปหน้าหลักหากไม่มีข้อมูล
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [state, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">ยืนยันการซื้อแพ็คเกจโฆษณา</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลการชำระเงิน</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
        <div className="md:w-2/3 p-6 border-r border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
            <PaymentForm 
            type="ads_package" 
            DatafromOrder={{ 
                package: packageData,
                order_id: packageData._id, // ส่ง package._id เป็น order_id
                total: packageData.price   // ส่ง price เป็น total เพื่อใช้ใน amount
            }}
            />
          </div>
        </div>

            <div className="md:w-1/3 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">สรุปรายการสั่งซื้อ</h2>
              
              {packageData && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg">{packageData.name}</h3>
                    <p className="text-gray-600">{packageData.detail}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">ประเภท</p>
                      <p className="capitalize">{packageData.type}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">ระยะเวลา</p>
                      <p>{packageData.duration} วัน</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>ราคา</span>
                      <span>฿{packageData.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePayment;