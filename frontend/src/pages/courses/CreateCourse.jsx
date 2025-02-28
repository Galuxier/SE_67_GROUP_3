import InputField from "../../components/Course/createCourse_InputField";
import RadioGroup from "../../components/Course/createCourse_RadioGroup";
import DatePicker from "../../components/Course/CreateCourse_DatePicker";
import TextArea from "../../components/Course/createCourse_TextArea";
import SubmitButton from "../../components/Course/createCourse_SubmitButton";
import { useState } from 'react';
import Course from "./Course";

function CreateCourse() {
  // Fixed useState usage - it returns an array that needs to be destructured
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Register for a course
        </h2>
        <form className="mt-4">
          <InputField label="name course" name="courseName" />
          <RadioGroup
            label="level"
            name="level"
            options={["For Kids", "Beginner", "Advance"]}
          />
          <DatePicker label="start date of course" name="startDate" />
          <DatePicker label="end date of course" name="endDate" />
          <InputField label="price" name="price" type="number" min="0" />
          <TextArea label="detail" name="details" />
          <SubmitButton text="next" />
        </form>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-full bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
          >
            next
          </button>
        </div>
      </div>
      
      {isModalOpen && (
        <Course isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}

export default CreateCourse;