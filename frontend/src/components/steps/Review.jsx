import React from "react";

const Review = ({ courseData, activities, availableDates }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4 text-text">Course Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">Basic Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Course Name:</span>
              <span className="font-medium text-text">{courseData.course_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Level:</span>
              <span className="font-medium text-text">{courseData.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Price:</span>
              <span className="font-medium text-text">฿{courseData.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Max Participants:</span>
              <span className="font-medium text-text">{courseData.max_participants || "Unlimited"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Gym:</span>
              <span className="font-medium text-text">{courseData.gym_name}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-3 text-text">Schedule</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Start Date:</span>
              <span className="font-medium text-text">{new Date(courseData.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">End Date:</span>
              <span className="font-medium text-text">{new Date(courseData.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Duration:</span>
              <span className="font-medium text-text">{availableDates.length} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Total Activities:</span>
              <span className="font-medium text-text">{activities.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Description</h4>
        <p className="text-text">{courseData.description}</p>
      </div>
      
      <div className="bg-card border border-border/40 rounded-lg p-4">
        <h4 className="text-lg font-medium mb-3 text-text">Course Image</h4>
        {courseData.previewImage ? (
          <img
            src={courseData.previewImage}
            alt="Course Preview"
            className="h-40 object-cover rounded-md"
          />
        ) : (
          <p className="text-text/70">No image uploaded</p>
        )}
      </div>
    </div>
  );
};

export default Review;