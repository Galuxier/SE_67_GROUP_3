import InputField from "../../components/Course/createCourse_InputField";
import RadioGroup from "../../components/Course/createCourse_RadioGroup";
import DatePicker from "../../components/Course/CreateCourse_DatePicker";
import TextArea from "../../components/Course/createCourse_TextArea";
import SubmitButton from "../../components/Course/createCourse_SubmitButton";
function CreateCourse() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Register for a course</h2>

        <form className="mt-4">
          <InputField label="name course" name="courseName" />
          <RadioGroup label="level" name="level" options={["For Kids", "Beginner", "Advance"]} />
          <DatePicker label="start date of course" name="startDate" />
          <DatePicker label="end date of course" name="endDate" />
          <InputField label="price" name="price" type="number" />
          <TextArea label="detail" name="details" />
          <SubmitButton text="next" />
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
