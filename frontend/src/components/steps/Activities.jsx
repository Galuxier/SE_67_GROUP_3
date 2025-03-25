import React from "react";
import { toast } from "react-toastify";

const Activities = ({ activities, availableDates, handleAddActivity }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-3 text-text">Course Activities</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-10 bg-card border border-border/40 rounded-lg">
          <p className="text-text/70">No activities added yet</p>
          <p className="text-sm text-text/50 mt-2">Click on a date in the calendar to add activities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableDates.map((date, dateIndex) => {
            const dateString = date.toISOString().split('T')[0];
            const dayActivities = activities.filter(a => a.date === dateString);
            
            if (dayActivities.length === 0) return null;
            
            return (
              <div key={dateIndex} className="bg-card border border-border/40 rounded-lg p-4">
                <h4 className="text-md font-medium mb-2 text-text">
                  {date.toLocaleDateDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h4>
                <div className="space-y-2">
                  {dayActivities.map((activity, activityIndex) => (
                    <div 
                      key={activityIndex} 
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/20"
                    >
                      <div>
                        <p className="font-medium text-text">{activity.description}</p>
                        <p className="text-sm text-text/70">
                          {activity.startTime} - {activity.endTime}
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {activity.trainer && activity.trainer.map((trainer, trainerIndex) => (
                          <div 
                            key={trainerIndex} 
                            className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm -ml-2 border-2 border-white"
                          >
                            {trainer && typeof trainer === 'object' 
                              ? (trainer.Nickname || trainer.name || '?').charAt(0)
                              : typeof trainer === 'string' 
                                ? trainer.charAt(0) 
                                : '?'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddActivity(date, date.getDate())}
                  className="mt-2 text-sm text-primary hover:text-secondary"
                >
                  + Add more activities
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => {
            if (availableDates.length > 0) {
              handleAddActivity(availableDates[0], availableDates[0].getDate());
            } else {
              toast.error("Please set course start and end dates first");
            }
          }}
          className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
        >
          + Add Activity
        </button>
      </div>
    </div>
  );
};

export default Activities;