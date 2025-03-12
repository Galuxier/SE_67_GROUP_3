import { useNavigate } from "react-router-dom";

function CourseList() {
    const navigate = useNavigate();
    
    const courses = [
        { id: 1, 
            image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href, 
            course_name: "Muaythai",
            gym: "Phuket Fight Club",
            level: "Forkids",
            price: 2000,
            start_date: "2025-01-01",
            end_date: "2025-03-01",
            description: "Learn the basics of Muaythai for kids.",
            activities: [
                { description: "Introduction to Muaythai", date: "2025-01-01", time: "10:00 AM", trainer: ["Trainer A"] },
                { description: "Basic Muaythai techniques", date: "2025-01-02", time: "10:00 AM", trainer: ["Trainer A"] }
            ]
        },
        { id: 2, 
            image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href, 
            course_name: "Muaythai Training", 
            gym: "Phuket Fight Club",
            level: "Beginner",
            price: 2000,
            start_date: "2025-02-01",
            end_date: "2025-04-01",
            description: "A beginner course to learn the fundamentals of Muaythai.",
            activities: [
                { description: "Basic punches and kicks", date: "2025-02-01", time: "10:00 AM", trainer: ["Trainer B"] },
                { description: "Footwork and balance", date: "2025-02-03", time: "10:00 AM", trainer: ["Trainer B"] }
            ]
        },
        { id: 3, 
            image_url: new URL("../assets/images/muaythai-003.png", import.meta.url).href, 
            course_name: "Fighter's Journey", 
            gym: "Phuket Fight Club",
            level: "Advanced",
            price: 2500,
            start_date: "2025-03-01",
            end_date: "2025-05-01",
            description: "For experienced fighters who want to take their skills to the next level.",
            activities: [
                { description: "Advanced striking techniques", date: "2025-03-01", time: "09:00 AM", trainer: ["Trainer C"] }
            ]
        },
        { id: 4, 
            image_url: new URL("../assets/images/muaythai-004.jpg", import.meta.url).href, 
            course_name: "Elite Muaythai", 
            gym: "Bangkok Fight Lab",
            level: "Intermediate",
            price: 2500,
            start_date: "2025-04-01",
            end_date: "2025-06-01",
            description: "An intermediate course to refine Muaythai skills.",
            activities: [
                { description: "Muaythai combination drills", date: "2025-04-01", startTime: "11:00 AM",endTime: "12:00 AM", trainer: [["Trainer D"]] }
            ]
        },
        { id: 5, 
            image_url: new URL("../assets/images/muaythai-005.jpg", import.meta.url).href, 
            course_name: "Pro Fighter Course", 
            gym: "Tiger Muay Thai",
            level: "Professional",
            price: 3000,
            start_date: "2025-05-01",
            end_date: "2025-07-01",
            description: "Designed for professional fighters looking to improve their technique.",
            activities: [ 
                { description: "Professional-level fight strategies", date: "2025-05-01", time: "12:00 PM", trainer: ["Trainer E"] }
            ]
        },
        
    ];

    


    const getLevelColor = (level) => {
        switch(level) {
            case "Forkids": return "text-blue-500";
            case "Beginner": return "text-green-500";
            case "Advanced": return "text-red-500";
            case "Intermediate": return "text-orange-500";
            case "Professional": return "text-purple-500";
            case "Expert": return "text-yellow-500";
            default: return "text-gray-700";
        }
    };

    const handleCourseClick = (course) => {
        // console.log("Navigating to course: ", course);
        navigate(`/course/courseDetail`, { state: { course } }); // ส่งข้อมูลไปยัง CourseDetail
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
                <button 
                    key={course.id} 
                    className="max-w-xs rounded overflow-hidden shadow-lg bg-white text-left cursor-pointer transition transform hover:scale-105"
                    onClick={() => handleCourseClick(course)}
                >
                    <img className="w-full aspect-[4/3] object-cover" src={course.image_url} alt={course.course_name} />
                    <div className="px-6 py-4">
                        <div className="font-semibold text-xl mb-2">{course.course_name}</div>
                        <div className="text-gray-700 text-base">{course.gym}</div>
                        <div className={`font-normal ${getLevelColor(course.level)}`}>{course.level}</div>
                        <div className="text-gray-700 text-base mt-2">{course.description}</div>
                        <div className="text-gray-700 text-sm mt-2">
                            <strong>Start Date:</strong> {new Date(course.start_date).toLocaleDateString()} <br />
                            <strong>End Date:</strong> {new Date(course.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center font-base text-lg mb-2">
                            <span className="mr-2">THB {course.price}</span>
                            <span className="text-gray-700 text-base">/course</span>
                        </div>
                        <div className="text-gray-700 text-sm mt-2">
                            <strong>Activities:</strong>
                            <ul className="list-disc pl-5 mt-2">
                                {course.activities.map((activity, index) => (
                                    <li key={index}>
                                        {activity.description} on {new Date(activity.date).toLocaleDateString()} at {activity.time} with {activity.trainer.join(", ")}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default CourseList;
