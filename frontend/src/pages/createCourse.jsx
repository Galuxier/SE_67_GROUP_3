import InputField from "./components/createCourse_InputField";
import RadioGroup from "./components/createCourse_RadioGroup";
import DatePicker from "./components/createCourse_DatePicker";
import TextArea from "./components/createCourse_TextArea";
import SubmitButton from "./components/createCourse_SubmitButton";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">ลงทะเบียนคอร์ส</h2>

        <form className="mt-4">
          <InputField label="ชื่อคอร์ส" name="courseName" />
          <RadioGroup label="ระดับ" name="level" options={["For Kids", "Beginner", "Advance"]} />
          <DatePicker label="วันที่เริ่มคอร์ส" name="startDate" />
          <DatePicker label="วันที่สิ้นสุดคอร์ส" name="endDate" />
          <InputField label="ราคา" name="price" type="number" />
          <TextArea label="รายละเอียด" name="details" />
          <SubmitButton text="กดไป" />
        </form>
      </div>
    </div>
  );
}

export default App;
