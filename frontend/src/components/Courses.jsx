function CourseList() {
    const courses = [
        { id: 1, 
            image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href, 
            course_name: "Muaythai",
            gym: "Phuket Fight Club",
            level: "Forkids",
            price: 2000 },
        { id: 2, 
            image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href, 
            course_name: "Muaythai Training", 
            gym: "Phuket Fight Club",
            level: "Beginner",
            price: 2000 },
        { id: 3, 
            image_url: new URL("../assets/images/muaythai-003.png", import.meta.url).href, 
            course_name: "Fighter's Journey", 
            gym: "Phuket Fight Club",
            level: "Advance",
            price: 2000 }
    ];

    const getLevelColor = (level) => {
        switch(level) {
            case "Forkids": return "text-blue-500";
            case "Beginner": return "text-green-500";
            case "Advance": return "text-red-500";
            default: return "text-gray-700";
        }
    };

    // const handleCourseClick = (course) => {
    //     alert(`You clicked on ${course.course_name}`);
    // };

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
                        <div className="flex items-center font-base text-lg mb-2">
                            <span className="mr-2">THB {course.price}</span>
                            <span className="text-gray-700 text-base">/course</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default CourseList;