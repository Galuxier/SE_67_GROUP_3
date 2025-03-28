import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  EyeIcon,
  UserCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { getUserOrders } from '../../../services/api/OrderApi';
import { getUser } from '../../../services/api/UserApi';
import { getCourseById } from '../../../services/api/CourseApi';
import { getImage } from '../../../services/api/ImageApi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  paid: 'bg-blue-100 text-blue-800',
  failed: 'bg-gray-100 text-gray-800'
};

// Mock data for testing when API fails
const mockEnrollments = [
  {
    _id: 'order1',
    user_id: 'user1',
    order_type: 'course',
    items: [
      {
        ref_id: 'course1',
        ref_model: 'Course',
        price_at_order: 1500,
        quantity: 1
      }
    ],
    total_price: 1500,
    create_at: new Date(),
    status: 'completed'
  },
  {
    _id: 'order2',
    user_id: 'user2',
    order_type: 'course',
    items: [
      {
        ref_id: 'course2',
        ref_model: 'Course',
        price_at_order: 2000,
        quantity: 2
      }
    ],
    total_price: 4000,
    create_at: new Date(Date.now() - 86400000),
    status: 'pending'
  }
];

const mockUsers = {
  user1: {
    _id: 'user1',
    username: 'john_doe',
    first_name: 'John',
    last_name: 'Doe',
    profile_picture_url: 'profile1.jpg'
  },
  user2: {
    _id: 'user2',
    username: 'jane_smith',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_picture_url: 'profile2.jpg'
  }
};

const mockCourses = {
  course1: {
    _id: 'course1',
    course_name: 'Beginner Boxing',
    gym_id: 'gym123'
  },
  course2: {
    _id: 'course2',
    course_name: 'Advanced Kickboxing',
    gym_id: 'gym123'
  }
};

export default function CourseEnrollmentAll() {
  const { gym_id } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'create_at',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. ดึงข้อมูล orders ทั้งหมด (ใช้ mock data หาก API ล้มเหลว)
        let orders = [];
        try {
          orders = await getUserOrders('current_user_id'); // ต้องใช้ user_id จริง
          console.log('Completed Orders from API:', orders);
        } catch (apiError) {
          console.warn('Using mock orders data due to API error:', apiError);
          orders = mockEnrollments.filter(order => order.status === 'completed');
        }
  
        // 2. กรองเฉพาะ orders ประเภท course และสถานะ completed
        const completedCourseOrders = orders.filter(
          order => (order.order_type === 'course' || 
                   (order.items && order.items.some(item => item.ref_model === 'Course'))) &&
                  order.status === 'completed'
        );
  
        // 3. ดึงข้อมูลเพิ่มเติม (ผู้ใช้และคอร์ส)
        const enrichedCompletedOrders = await Promise.all(
          completedCourseOrders.map(async order => {
            try {
              // ดึงข้อมูลผู้ใช้
              let user = {};
              try {
                user = await getUser(order.user_id);
              } catch (userError) {
                console.warn('Using mock user data:', userError);
                user = mockUsers[order.user_id] || {
                  username: 'unknown',
                  first_name: 'Unknown',
                  last_name: 'User'
                };
              }
  
              // ดึงข้อมูลคอร์ส (เฉพาะรายการแรก)
              let course = {};
              if (order.items && order.items.length > 0) {
                try {
                  course = await getCourseById(order.items[0].ref_id);
                } catch (courseError) {
                  console.warn('Using mock course data:', courseError);
                  course = mockCourses[order.items[0].ref_id] || {
                    course_name: 'Unknown Course'
                  };
                }
              }
  
              // ดึงรูปโปรไฟล์
              let profileImage;
              if (user.profile_picture_url) {
                try {
                  profileImage = await getImage(user.profile_picture_url);
                } catch (imageError) {
                  console.warn('Failed to load profile image:', imageError);
                }
              }
  
              return {
                ...order,
                user,
                course,
                profileImage,
                create_at: new Date(order.create_at)
              };
            } catch (error) {
              console.error('Error processing completed order:', error);
              return null;
            }
          })
        );
  
        setEnrollments(enrichedCompletedOrders.filter(Boolean));
      } catch (error) {
        console.error('Failed to fetch completed enrollments:', error);
        setError('Failed to load completed enrollments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [gym_id]);

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEnrollments = [...enrollments].sort((a, b) => {
    // Handle nested properties
    let aValue, bValue;
    
    if (sortConfig.key.includes('.')) {
      const [parent, child] = sortConfig.key.split('.');
      aValue = a[parent]?.[child];
      bValue = b[parent]?.[child];
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = key => {
    if (sortConfig.key !== key) return <ChevronUpIcon className="w-4 h-4 ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 ml-1" />
    );
  };

  const formatDate = date => {
    if (!date) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Course Enrollments</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('course.course_name')}
              >
                <div className="flex items-center">
                  Course
                  {getSortIcon('course.course_name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('items.0.price_at_order')}
              >
                <div className="flex items-center">
                  Price
                  {getSortIcon('items.0.price_at_order')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('total_price')}
              >
                <div className="flex items-center">
                  Total
                  {getSortIcon('total_price')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('create_at')}
              >
                <div className="flex items-center">
                  Created Date
                  {getSortIcon('create_at')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEnrollments.length > 0 ? (
              sortedEnrollments.map((enrollment) => (
                <tr key={enrollment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {enrollment.profileImage ? (
                        <img
                          src={enrollment.profileImage}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          @{enrollment.user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.user.first_name} {enrollment.user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.course?.course_name || 'Unknown Course'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.items?.[0]?.price_at_order?.toLocaleString() || '0'} THB
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.items?.[0]?.quantity || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {enrollment.total_price?.toLocaleString() || '0'} THB
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(enrollment.create_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[enrollment.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => {
                        /* TODO: Implement view details */
                      }}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => {
                        /* TODO: Implement view details */
                      }}
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                  No enrollments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}