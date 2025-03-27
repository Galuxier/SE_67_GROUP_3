import React, { useState, useEffect, useRef } from 'react';

function TrainerWork() {
  const [scheduleData, setScheduleData] = useState([]); // ข้อมูลตารางการฝึก
  const [upcomingCourses, setUpcomingCourses] = useState([]); // ข้อมูลคอร์สที่กำลังจะมาถึง
  const [coursesLoading, setCoursesLoading] = useState(true); // สถานะการโหลดคอร์ส
  const [coursesError, setCoursesError] = useState(null); // ข้อผิดพลาดในการโหลดคอร์ส
  const stickyRef = useRef(null); // ใช้สำหรับ sticky element

  // ฟังก์ชันดึงข้อมูลการฝึกและคอร์ส
  useEffect(() => {
    // โหลดข้อมูลตารางการฝึก (ในที่นี้ให้ใช้ข้อมูลตัวอย่าง)
    setScheduleData([
      { time: '08:00 AM', description: 'Muay Thai Beginners', trainer: 'มังกร ฟ้าผู้หาญ', date: '2025-04-15' },
      { time: '10:00 AM', description: 'Advanced Muay Thai Techniques', trainer: 'เพชร ยีมง', date: '2025-04-16' },
      { time: '08:00 AM', description: 'Muay Thai Basics', trainer: 'สมคิด เทพทอง', date: '2025-04-17' },
      // เพิ่มข้อมูลตามที่คุณต้องการ
    ]);

    // โหลดข้อมูลคอร์สที่กำลังจะมาถึง
    setCoursesLoading(true);
    setTimeout(() => {
      setUpcomingCourses([
        {
          "_id": "67e598274c7b1f3e8bdda859",
          "gym_id": "67e41494a6a720488f39555b",
          "course_name": "กิจกรรมเสริมทักษะทางมวยไทย",
          "level": "beginner",
          "start_date": "2025-03-25T00:00:00.000Z",
          "end_date": "2025-03-25T00:00:00.000Z",
          "price": 500,
          "description": "ฟรี   ใครมาก่อนได้ก่อน ",
          "course_image_url": [
              "courses/1743099943293-course_image_url.jfif"
          ],
          "status": "preparing",
          "activities": [
              {
                  "description": "วอร์มร่างกาย",
                  "date": "2025-03-25T00:00:00.000Z",
                  "start_time": "08:00",
                  "end_time": "10:00",
                  "trainer_list": [
                      {
                          "trainer_id": "67ddcefcb808034424fd0c40",
                          "_id": "67e598274c7b1f3e8bdda85b"
                      }
                  ],
                  "_id": "67e598274c7b1f3e8bdda85a"
              }
          ],
          "trainer_in_course": [
              {
                  "trainer_id": "67ddcefcb808034424fd0c40",
                  "status": "pending",
                  "isMember": false,
                  "_id": "67e598274c7b1f3e8bdda85c"
              }
          ],
          "max_participants": 5,
          "packages": [],
          "__v": 0
      },
      {
        "_id": "67e598b84c7b1f3e8bdda91f",
        "gym_id": "67e41494a6a720488f39555b",
        "course_name": "สอนทักษะเบื้องต้นมวยไทย",
        "level": "beginner",
        "start_date": "2025-03-25T00:00:00.000Z",
        "end_date": "2025-03-25T00:00:00.000Z",
        "price": 1500,
        "description": "สอนโยผู้เชี่ยวชาญ",
        "course_image_url": [
            "courses/1743100088100-course_image_url.jpg"
        ],
        "status": "preparing",
        "activities": [
            {
                "description": "สอนทักาะเบื้องต้น",
                "date": "2025-03-26T00:00:00.000Z",
                "start_time": "08:00",
                "end_time": "12:00",
                "trainer_list": [
                    {
                        "trainer_id": "67ddcefcb808034424fd0c40",
                        "_id": "67e598b84c7b1f3e8bdda921"
                    },
                    {
                        "trainer_id": "67e4231166d9021c68d72413",
                        "_id": "67e598b84c7b1f3e8bdda922"
                    }
                ],
                "_id": "67e598b84c7b1f3e8bdda920"
            },
            {
                "description": "ลงสนามมวยฝึกชก",
                "date": "2025-03-25T00:00:00.000Z",
                "start_time": "13:00",
                "end_time": "16:00",
                "trainer_list": [
                    {
                        "trainer_id": "67e4278a4bdebd530ee4c53e",
                        "_id": "67e598b84c7b1f3e8bdda924"
                    },
                    {
                        "trainer_id": "67e427fa4bdebd530ee4c541",
                        "_id": "67e598b84c7b1f3e8bdda925"
                    }
                ],
                "_id": "67e598b84c7b1f3e8bdda923"
            }
        ],
        "trainer_in_course": [
            {
                "trainer_id": "67ddcefcb808034424fd0c40",
                "status": "pending",
                "isMember": false,
                "_id": "67e598b84c7b1f3e8bdda926"
            },
            {
                "trainer_id": "67e4231166d9021c68d72413",
                "status": "pending",
                "isMember": false,
                "_id": "67e598b84c7b1f3e8bdda927"
            },
            {
                "trainer_id": "67e4278a4bdebd530ee4c53e",
                "status": "ready",
                "isMember": true,
                "_id": "67e598b84c7b1f3e8bdda928"
            },
            {
                "trainer_id": "67e427fa4bdebd530ee4c541",
                "status": "ready",
                "isMember": true,
                "_id": "67e598b84c7b1f3e8bdda929"
            }
        ],
        "max_participants": 5,
        "packages": [],
        "__v": 0
    }
      ]);
      setCoursesLoading(false);
    }, 2000); // Simulating the loading delay
  }, []);

  // ฟังก์ชันจัดการคลิกคอร์ส
  const handleCourseClick = (courseId) => {
    console.log('Course clicked:', courseId);
  };

  // ฟังก์ชันเพื่อรับสีของ badge ตามระดับคอร์ส
  const getLevelBadgeColor = (level) => {
    if (level === 'Beginner') {
      return 'bg-green-500';
    } else if (level === 'Advanced') {
      return 'bg-red-500';
    }
    return 'bg-gray-500';
  };

  // Helper function to generate days of the month (for calendar view)
  const generateCalendarDays = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(`${year}-${month < 10 ? `0${month}` : month}-${i < 10 ? `0${i}` : i}`);
    }
    return daysArray;
  };

  // Get the current month and year
  const currentMonth = 3; // March
  const currentYear = 2025;

  // Generate the calendar days for the current month and year
  const calendarDays = generateCalendarDays(currentMonth, currentYear);

  // Filter the schedule data to show only activities for the trainer with ID '67ddcefcb808034424fd0c40'
  const filteredSchedule = [];
  upcomingCourses.forEach((course) => {
    course.activities.forEach((activity) => {
      const date = activity.date.slice(0, 10); // Extract date in YYYY-MM-DD format
      if (activity.trainer_list.some((trainer) => trainer.trainer_id === '67ddcefcb808034424fd0c40') && calendarDays.includes(date)) {
        filteredSchedule.push({
          date: date,
          description: activity.description,
          time: activity.start_time + " - "+ activity.end_time,
          trainer: activity.trainer_list[0].trainer_id
        });
      }
    });
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column - Calendar View with Sessions */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Training Schedule</h2>

          {/* Calendar Table */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, index) => {
              const trainingSessions = filteredSchedule.filter(
                (session) => session.date === day
              );

              return (
                <div key={index} className="border p-4">
                  <div className="font-semibold">{new Date(day).toLocaleDateString()}</div>
                  {trainingSessions.length > 0 ? (
                    <div>
                      {trainingSessions.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="mt-2">
                          <span className="text-sm font-semibold">{session.time} </span>
                          <span className="text-sm">{session.description}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No sessions</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Sticky Upcoming Courses */}
      <div className="w-full lg:w-1/3">
        <div ref={stickyRef} className="sticky top-28 bg-card border border-border/20 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Upcoming Courses</h2>
            <p className="text-white/80">Join our next training sessions</p>
          </div>

          <div className="p-6">
            {coursesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-text/70 mt-2">Loading courses...</p>
              </div>
            ) : coursesError ? (
              <div className="text-center py-8">
                <p className="text-red-500">{coursesError}</p>
              </div>
            ) : upcomingCourses.length > 0 ? (
              <div className="space-y-4 max-h-[360px] overflow-y-auto" style={{ paddingRight: '12px' }}>
                {upcomingCourses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleCourseClick(course._id)}
                    className="bg-background border border-border/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-text">{course.course_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeColor(course.level)}`}>{course.level}</span>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-center text-text/70">
                        <span className="material-icons-outlined w-4 h-4 mr-2 text-primary">calendar_today</span>
                        <span>{course.start_date} - {course.end_date}</span>
                      </div>

                      <div className="flex items-center text-text/70">
                        <span className="material-icons-outlined w-4 h-4 mr-2 text-primary">group</span>
                        <span>{course.max_participants} spots available</span>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        <div className="text-text font-bold">฿{course.price.toLocaleString()}</div>
                        <button className="text-xs px-3 py-1 bg-primary hover:bg-secondary text-white rounded-full transition-colors">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 text-primary">
                  <span className="material-icons-outlined h-12 w-12 mx-auto opacity-50">alarm</span>
                </div>
                <p className="text-text/70">No upcoming courses available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerWork;
