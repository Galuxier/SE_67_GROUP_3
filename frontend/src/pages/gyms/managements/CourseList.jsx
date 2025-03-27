import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setCourses(courses.filter((c) => c._id !== courseToDelete._id));
    setFilteredCourses(
      filteredCourses.filter((c) => c._id !== courseToDelete._id)
    );
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "preparing":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

        {/* Course List */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bar">
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                  Actions
                </th>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-red-500">
                      {error}
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
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-bar/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text text-center">
                          {course.course_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text text-center">{course.level || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text text-center">{formatDate(course.start_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text text-center">{formatDate(course.end_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text text-center">{course.price || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            course.status
                          )}`}
                        >
                          {course.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/course/management/${course._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(course)}
                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Courses Message */}
        {/* {filteredCourses.length === 0 && !loading && !error && (
          <div className="text-center py-16 bg-card rounded-lg shadow-md mt-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-text">No courses</h3>
            <p className="mt-1 text-sm text-text/70">No courses available at the moment.</p>
          </div>
        )} */}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-medium text-text mb-4">Confirm Deletion</h3>
              <p className="text-text/70 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{courseToDelete?.course_name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-md text-text hover:bg-bar"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseList;