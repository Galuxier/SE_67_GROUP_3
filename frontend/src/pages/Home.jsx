import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRightIcon, FireIcon, TrophyIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

function Home() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy data for featured items
  const heroSlides = [
    {
      id: 1,
      title: "Muay Thai Championship",
      description: "Join Thailand's premier Muay Thai event featuring elite fighters from across the globe",
      image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
      buttonText: "Explore Events",
      link: "/event"
    },
    {
      id: 2,
      title: "Learn Muay Thai",
      description: "Train with Thailand's best coaches and elevate your skills to the next level",
      image: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
      buttonText: "Browse Courses",
      link: "/course"
    },
    {
      id: 3,
      title: "Premium Equipment",
      description: "Shop high-quality Muay Thai gear and equipment for your fighting journey",
      image: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
      buttonText: "Visit Shop",
      link: "/shop"
    }
  ];

  const gymSpotlights = [
    {
      id: 1,
      name: "Bangkok Fight Club",
      location: "Bangkok",
      image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      name: "Phuket Warriors",
      location: "Phuket",
      image: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
      rating: 4.7,
      featured: true
    },
    {
      id: 3,
      name: "Chiang Mai Fight Lab",
      location: "Chiang Mai",
      image: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
      rating: 4.9,
      featured: true
    }
  ];

  // Simulating data loading
  useEffect(() => {
    const loadData = async () => {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dummy events data
      setUpcomingEvents([
        {
          id: 1,
          name: "Bangkok Championship",
          date: "April 25, 2025",
          location: "Bangkok",
          image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
          type: "Championship"
        },
        {
          id: 2,
          name: "Phuket Fight Night",
          date: "May 10, 2025",
          location: "Phuket",
          image: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
          type: "Tournament"
        },
        {
          id: 3,
          name: "Chiang Mai Rookies Cup",
          date: "May 23, 2025",
          location: "Chiang Mai",
          image: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
          type: "Amateur"
        },
        {
          id: 4,
          name: "Thailand Open",
          date: "June 5, 2025",
          location: "Bangkok",
          image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
          type: "Open"
        }
      ]);
      
      // Dummy courses data
      setPopularCourses([
        {
          id: 1,
          name: "Fundamentals of Muay Thai",
          instructor: "Coach Somchai",
          level: "Beginner",
          price: 2000,
          image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
          rating: 4.8
        },
        {
          id: 2,
          name: "Advanced Clinch Techniques",
          instructor: "Coach Pradit",
          level: "Advanced",
          price: 3500,
          image: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href,
          rating: 4.9
        },
        {
          id: 3,
          name: "Kids Muay Thai",
          instructor: "Coach Niran",
          level: "Beginner",
          price: 1800,
          image: new URL("../assets/images/muaythai-003.png", import.meta.url).href,
          rating: 4.7
        },
        {
          id: 4,
          name: "Competition Preparation",
          instructor: "Coach Apirak",
          level: "Advanced",
          price: 4000,
          image: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href,
          rating: 4.9
        }
      ]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const formatRating = (rating) => {
    return rating.toFixed(1);
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className={`min-h-screen bg-background text-text ${isDarkMode ? "dark" : ""}`}>
      {/* Hero Section with Slider */}
      <section className="relative w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            enabled: typeof window !== 'undefined' ? window.innerWidth >= 640 : false, // เปิดปุ่มเฉพาะเมื่อจอกว้างกว่า 640px
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-[500px] sm:h-[600px]"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute w-full h-full object-cover"
                />
                <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-10 lg:px-20 max-w-5xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl animate-fadeIn delay-100">
                    {slide.description}
                  </p>
                  <Link to={slide.link}>
                    <button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all hover:scale-105 animate-fadeIn delay-200">
                      {slide.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4 rounded-full bg-primary/10 inline-block mb-6">
              <TrophyIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Elite Training</h3>
            <p className="text-text/80">Train with Thailand's finest coaches and elevate your Muay Thai skills to championship level.</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4 rounded-full bg-primary/10 inline-block mb-6">
              <CalendarDaysIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Exciting Events</h3>
            <p className="text-text/80">Participate in or witness thrilling Muay Thai events and tournaments across Thailand.</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4 rounded-full bg-primary/10 inline-block mb-6">
              <FireIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Quality Equipment</h3>
            <p className="text-text/80">Shop premium Muay Thai gear and equipment to enhance your training and performance.</p>
          </div>
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section className="py-12 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Recommended Courses</h2>
            <Link to="/course" className="text-primary hover:text-secondary flex items-center">
              View All <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="flex justify-between mt-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              popularCourses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/course/courseDetail`, { state: { course } })}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.name} 
                      className="w-full h-full object-cover transition-all hover:scale-110 duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.name}</h3>
                    <p className="text-text/70 text-sm mb-2">by {course.instructor}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-text/90 text-sm font-semibold">{formatRating(course.rating)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-bold text-lg">{course.price.toLocaleString()} ฿</span>
                      <button className="text-sm px-4 py-1 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Gyms */}
      <section className="py-16 px-4 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Featured Gyms</h2>
            <p className="text-text/70 max-w-2xl mx-auto">Discover top-rated Muay Thai training facilities across Thailand</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gymSpotlights.map((gym) => (
              <div 
                key={gym.id}
                className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer"
                onClick={() => navigate(`/gym/${gym.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <img 
                  src={gym.image} 
                  alt={gym.name} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold text-white">{gym.name}</h3>
                      <p className="text-white/80">{gym.location}</p>
                    </div>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="text-white font-semibold">{gym.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link 
              to="/gym" 
              className="inline-block px-8 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
            >
              Explore All Gyms
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <Link to="/event" className="text-primary hover:text-secondary flex items-center">
              View All <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="flex justify-between mt-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/event/${event.id}`, { state: { event } })}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="w-full h-full object-cover transition-all hover:scale-110 duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                    <div className="flex items-center text-text/70 text-sm mb-3">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="flex items-center text-text/70 text-sm">
                      <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <button className="text-sm px-4 py-1 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Muay Thai Journey?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a beginner looking to learn the basics or an experienced fighter aiming to perfect your technique, we have everything you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/course" 
              className="px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Find a Course
            </Link>
            <Link 
              to="/gym" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Explore Gyms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;