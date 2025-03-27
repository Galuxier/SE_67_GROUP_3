import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getCoursesByGymId } from "../../../services/api/CourseApi";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function CourseList() {
  const { gym_id } = useParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch courses when component mounts or gym_id changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCoursesByGymId(gym_id);
        setCourses(response.data); // Assuming the API returns { data: [...] }
        setFilteredCourses(response.data); // Initially set filtered courses to all data
        setError(null);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (gym_id) {
      fetchCourses();
    }
  }, [gym_id]);

  // Filter courses based on status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) => course.status.toLowerCase() === statusFilter)
      );
    }
  }, [statusFilter, courses]);

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "cancle":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-background">
      <div className="justify-center">
        <h1 className="text-5xl text-center mb-6 font-bold">Course List</h1>

        {/* Filter Section */}
        <div className="p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-end gap-4 text-black dark:text-text">
          <div className="flex items-center gap-2 w-full sm:w-auto text-black dark:text-text">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:border-border dark:bg-background dark:text-text"
            >
              <option value="all">All Status</option>
              <option value="preparing">Preparing</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200 dark:text-text dark:bg-background">
            <thead className="bg-gray-50 dark:bg-background border dark:border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text ">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-text">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-background  divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.course_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.level || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(course.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(course.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.price || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-2 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          course.status
                        )}`}
                      >
                        {course.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        
                      <Link
                        to={
                          gym_id
                            ? `/gym/management/${gym_id}/course/edit/${course._id}`
                            : `gym/management/edit/${course._id}`
                           
                        }
                        className={`block p-2 rounded-md hover:bg-primary/10 ${
                          location.pathname === "/gym/management/course/edit"
                            ? "text-primary"
                            : "text-text"
                        } text-sm transition-colors`}
                      >
                        <PencilSquareIcon className="h-5 w-5 cursor-pointer" />
                      </Link>
                        
                        <TrashIcon className="h-5 w-5 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CourseList;