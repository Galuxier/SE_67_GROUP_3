import React from "react";

const BasicInfo = ({ courseData, handleInputChange, handleFileChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text">Course Name</label>
          <input type="text" name="course_name" value={courseData.course_name} onChange={handleInputChange} className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter course name" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-text">Description</label>
          <textarea name="description" value={courseData.description} onChange={handleInputChange} className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter course description" rows="4" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Level</label>
          <select name="level" value={courseData.level} onChange={handleInputChange} className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="for_kid">For Kids</option>
            <option value="beginner">Beginner</option>
            <option value="advance">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Price</label>
          <input type="number" name="price" value={courseData.price} onChange={handleInputChange} className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter price" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Max Participants</label>
          <input type="number" name="max_participants" value={courseData.max_participants} onChange={handleInputChange} className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter max participants" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Course Image</label>
          <div className="flex items-center">
            <input type="file" id="course-image" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="course-image" className="cursor-pointer flex-1 border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {courseData.image_url ? "Change Image" : "Upload Image"}
            </label>
          </div>
          {courseData.previewImage && <div className="mt-2"><img src={courseData.previewImage} alt="Course Preview" className="h-24 object-cover rounded-md" /></div>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;