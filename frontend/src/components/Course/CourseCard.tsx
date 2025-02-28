import React from 'react';

interface CourseCardProps {
  image?: string;
  title: string;
  subtitle: string;
  price: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ image, title, subtitle, price }) => {
  // ใช้ URL สำหรับรูปภาพเริ่มต้นถ้าไม่ได้รับค่า image
  const defaultImage = "/api/placeholder/240/180"; // หรือจะใช้ URL จากเว็บไซต์ภายนอกก็ได้ เช่น "https://placehold.co/600x400"
  const imageToShow = image || defaultImage;

  return (
    <div className="bg-white rounded shadow overflow-hidden w-full flex flex-col">
      <img src={imageToShow} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 flex-grow">{subtitle}</p>
        <p className="text-base font-semibold mt-2">{price}</p>
      </div>
    </div>
  );
};

export default CourseCard;