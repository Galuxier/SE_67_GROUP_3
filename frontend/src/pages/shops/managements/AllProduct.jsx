import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrdersByShopId } from '../../../services/api/OrderApi';
import { getUser } from '../../../services/api/UserApi';
import { EyeIcon, TrashIcon, PrinterIcon } from '@heroicons/react/24/outline';

function AllProduct() {
  const { shopId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [userData, setUserData] = useState({});

  console.log('Shop ID from useParams:', shopId);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shopId) {
        setError('Shop ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Mock data for orders
        const mockOrders = [
          {
            _id: '67ddc96ca738e660fd2915a3',
            user_id: '67ddc96ca738e660fd2915a3',
            items: [
              {
                ref_id: 'prod001',
                variant_id: 'var001',
                price_at_order: 500,
                quantity: 2,
              },
            ],
            total_price: 1000,
            status: 'pending',
          },
          {
            _id: '67ddc96ca738e660fd2915a3',
            user_id: '67ddc96ca738e660fd2915a3',
            items: [
              {
                ref_id: 'prod002',
                variant_id: 'var002',
                price_at_order: 300,
                quantity: 1,
              },
            ],
            total_price: 300,
            status: 'completed',
          },
          {
            _id: '67ddc96ca738e660fd2915a3',
            user_id: '67ddc96ca738e660fd2915a3',
            items: [
              {
                ref_id: 'prod003',
                variant_id: 'var003',
                price_at_order: 700,
                quantity: 3,
              },
            ],
            total_price: 2100,
            status: 'pending',
          },
          {
            _id: '67ddc96ca738e660fd2915a3',
            user_id: '67ddc96ca738e660fd2915a3',
            items: [
              {
                ref_id: 'prod023',
                variant_id: 'var33',
                price_at_order: 300,
                quantity: 3,
              },
            ],
            total_price: 900,
            status: 'failed',
          },
        ];

        // เรียก API จริง
        const response = await getOrdersByShopId(shopId);
        console.log('API Response:', response);

        // ตรวจสอบโครงสร้างข้อมูลจาก API
        const ordersData = Array.isArray(response) ? response : response.data || [];

        // ถ้า API ส่งข้อมูลกลับมาเป็น array ว่าง ให้ใช้ mock data แทน
        if (ordersData.length === 0) {
          console.log('No data from API, using mock data instead');
          setOrders(mockOrders);
        } else {
          setOrders(ordersData);
        }

        // ดึงข้อมูลผู้ใช้สำหรับแต่ละ order
        const userPromises = ordersData.map(async (order) => {
          try {
            const user = await getUser(order.user_id);
            let profilePicture = null;
            if (user.profile_picture_url) {
              profilePicture = await getImage(user.profile_picture_url);
            }
            return {
              userId: order.user_id,
              username: user.username,
              firstName: user.first_name || 'N/A', // Handle first name
              lastName: user.last_name || 'N/A',   // Handle last name
              profilePicture,
            };
          } catch (err) {
            console.error(`Failed to fetch user ${order.user_id}:`, err);
            return {
              userId: order.user_id,
              username: order.user_id,
              firstName: 'N/A',
              lastName: 'N/A',
              profilePicture: null,
            };
          }
        });

        const users = await Promise.all(userPromises);
        const userDataMap = users.reduce((acc, user) => {
          acc[user.userId] = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          };
          return acc;
        }, {});
        setUserData(userDataMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(`Failed to fetch orders: ${err.message}`);
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId]);

  // ฟังก์ชันสำหรับจัดการสีของ badge สถานะ
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ฟังก์ชันสำหรับจัดการการคลิกปุ่มลบ
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  // ฟังก์ชันสำหรับยืนยันการลบ
  const handleDeleteConfirm = () => {
    setOrders(orders.filter((o) => o._id !== orderToDelete._id));
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-background">
      <div className="justify-center">
        <h1 className="text-5xl text-center mb-6 font-bold">All Orders</h1>

        {/* Order List */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-bar">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    user_id
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Price At Order
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text/70 uppercase tracking-wider">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-bar/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={userData[order.user_id]?.profilePicture || 'https://via.placeholder.com/40'}
                          alt="Profile"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-500"
                        />
                        <span className="text-sm text-text">
                          {userData[order.user_id]?.username || order.user_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        {userData[order.user_id]?.firstName || "N/A"} {userData[order.user_id]?.lastName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.items.length > 0 ? order.items[0].ref_id.toString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.items.length > 0 && order.items[0].variant_id ? order.items[0].variant_id.toString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.items.length > 0 ? order.items[0].price_at_order : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.items.length > 0 ? order.items[0].quantity : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{order.total_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/order/${order._id}/view`}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                          title="Delete"
                        >
                          <PrinterIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        
      </div>
    </div>
  );
}

export default AllProduct;
