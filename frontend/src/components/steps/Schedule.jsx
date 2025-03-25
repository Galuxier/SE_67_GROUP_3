import React from "react";

const Schedule = ({ courseData, handleInputChange, availableDates, handleAddActivity }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-text">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={courseData.start_date}
            onChange={handleInputChange}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-text">End Date</label>
          <input
            type="date"
            name="end_date"
            value={courseData.end_date}
            onChange={handleInputChange}
            min={courseData.start_date}
            className="w-full border border-border rounded-lg py-2 px-3 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      </div>

      {availableDates.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-text">Course Duration</h3>
          <div className="bg-card border border-border/40 rounded-lg p-4">
            <p className="mb-2 text-text">
              {courseData.start_date && courseData.end_date && 
                `${availableDates.length} days from ${new Date(courseData.start獻_date).toLocaleDateString()} to ${new Date(courseData.end_date).toLocaleDateString()}`
              }
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
              {availableDates.map((date, index) => (
                <div
                  key={index}
                  className="border border-border/40 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleAddActivity(date, date.getDate())}
                >
                  <span className="text-sm font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-xs text-text/70">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-text/70">Click on a date to add activities</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;