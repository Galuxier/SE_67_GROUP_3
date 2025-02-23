import CourseForm from "./components/CourseForm.jsx";
import ActivityTable from "./components/ActivityTable.jsx";
import Button from "./components/Button.jsx";

const CreateCourse = () => {
  const handleBack = () => {
    console.log("ย้อนกลับ");
  };

  const handleCreate = () => {
    console.log("สร้างคอร์ส");
    // router.push("./components/pages/createCourse");
  };

 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* กล่องหลักของฟอร์ม */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">สร้างคอร์สใหม่</h2>

        {/* ลดขนาด CourseForm และเอากรอบออก */}
        <div className="scale-90">
          <CourseForm />
        </div>

        {/* Activity Table */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
          <ActivityTable />
        </div>

        {/* ปุ่มควบคุม */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button text="ย้อนกลับ" variant="secondary" onClick={handleBack} />
          <Button text="สร้างคอร์ส" variant="orange" onClick={handleCreate} />
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
