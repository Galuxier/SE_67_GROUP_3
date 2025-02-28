import { Button } from "../../components/Course/Button";

export default function CourseDetail() {
  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* ส่วนหัวข้อ และปุ่มให้อยู่ในบรรทัดเดียวกัน */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">คอร์สฝึกมวยไทยเริ่มต้น</h1>
          <p className="text-lg text-gray-600 mt-1">Phuket Fight Club</p>
        </div>
        <Button className="bg-red-500 text-white text-lg px-8 py-3 rounded-xl">
          ซื้อคอร์ส
        </Button>
      </div>

      {/* แก้ไขจาก <image> เป็น <img> */}
      <div>
        <img
          src="https://th.bing.com/th/id/R.7a9ce588169aaa49a671c591aca1b3ce?rik=kynuvjoQisKShw&riu=http%3a%2f%2fwww.asiaculturaltravel.co.uk%2fwp-content%2fuploads%2f2017%2f03%2f%e6%b3%b0%e5%b1%b103-1024x538.jpg&ehk=3B%2bln8lAbYbZ6PHWlz6%2bDPd%2bAHxwJq6hwpZUS3Yz1Os%3d&risl=&pid=ImgRaw&r=0"
          alt="muaythai"
          className="w-full h-48 object-cover mt-6 rounded-lg"
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold">รายละเอียดคอร์ส</h2>

      <div className="mt-8 flex space-x-10">
        {[
          { name: "โค้ชนาย", img: "/coach1.jpg" },
          { name: "โค้ชปิงปอง", img: "/coach2.jpg" },
          { name: "โค้ชสมชาย", img: "/coach3.jpg" },
        ].map((coach, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={coach.img}
              alt={coach.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <p className="mt-3 text-lg font-medium">{coach.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center space-x-2 text-lg">
        <span className="text-gray-600">แผนที่</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2c3.866 0 7 3.134 7 7 0 4.418-4.745 9.683-6.318 11.318a1 1 0 01-1.364 0C9.745 18.683 5 13.418 5 9c0-3.866 3.134-7 7-7z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
    </div>
  );
}
