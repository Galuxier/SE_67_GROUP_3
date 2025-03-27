import { api } from "../Axios";

export async function getUserOrders(user_id) {
    try{
        const response = await api.get(`/user/${user_id}/orders`);
        return response.data;
    } catch (error){
        console.error('Get All Gym Faild: ', error);
        throw error;
    }
}

/**
 * Fetch orders for a specific shop with optional status filtering
 * 
 * @param {string} shop_id - The ID of the shop to get orders for
 * @param {string} [status] - Optional status filter (pending, completed, cancelled, failed)
 * @returns {Promise<Object>} - The response containing order data
 */
export async function getOrdersByShopId(shop_id, status = '') {
    try {
        const url = status 
            ? `/shop/${shop_id}/orders?status=${status}` 
            : `/shop/${shop_id}/orders`;
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Get Shop Orders Failed: ', error);
        throw error;
    }
}

export async function createOrder(orderData) {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Create Order Failed: ', error);
        throw error;
    }
}

export async function getOrderById(order_id) {
    try {
        const response = await api.get(`/order/${order_id}`);
        return response.data;
    } catch (error) {
        console.error('Get Order Details Failed: ', error);
        throw error;
    }
}

/**
 * Update order status
 * 
 * @param {string} order_id - The ID of the order to update
 * @param {string} status - The new status (pending, completed, cancelled, failed)
 * @returns {Promise<Object>} - The updated order
 */
export async function updateOrderStatus(order_id, status) {
    try {
        const response = await api.patch(`/order/${order_id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Update Order Status Failed: ', error);
        throw error;
    }
}



/**
 * Create a course order
 * 
 * @param {Object} courseOrderData - Data needed for creating a course order
 * @param {string} courseOrderData.user_id - User ID
 * @param {string} courseOrderData.course_id - Course ID
 * @param {number} courseOrderData.quantity - Quantity of slots to book
 * @param {number} courseOrderData.price - Price of the course
 * @param {Object} courseOrderData.shippingAddress - Shipping address object
 * @returns {Promise<Object>} - The created order
 */
export async function createCourseOrder(courseOrderData) {
    const { user_id, course_id, quantity, price, shippingAddress } = courseOrderData;
    
    const orderData = {
        user_id,
        order_type: "course",
        items: [
            {
                ref_id: course_id,
                ref_model: "Course",
                price_at_order: price,
                quantity
            }
        ],
        total_price: price * quantity,
        shipping_address: shippingAddress,
        status: "pending"
    };
    
    return createOrder(orderData);
}


/**
 * Create a product order
 * 
 * @param {Object} productOrderData - Data needed for creating a product order
 * @param {string} productOrderData.user_id - User ID
 * @param {Array} productOrderData.items - Array of product items
 * @param {number} productOrderData.total_price - Total price of all items
 * @param {Object} productOrderData.shippingAddress - Shipping address object
 * @returns {Promise<Object>} - The created order
 */
export async function createProductOrder(productOrderData) {
    const { user_id, items, total_price, shippingAddress } = productOrderData;
    
    const orderData = {
        user_id,
        order_type: "product",
        items: items.map(item => ({
            ref_id: item.product_id,
            ref_model: "Product",
            variant_id: item.variant_id || undefined,
            price_at_order: item.price,
            quantity: item.quantity
        })),
        total_price,
        shipping_address: shippingAddress,
        status: "pending"
    };
    
    return createOrder(orderData);
}

/**
 * Create a ticket order
 * 
 * @param {Object} ticketOrderData - Data needed for creating a ticket order
 * @param {string} ticketOrderData.user_id - User ID
 * @param {Array} ticketOrderData.tickets - Array of ticket items
 * @param {number} ticketOrderData.total_price - Total price of all tickets
 * @param {Object} ticketOrderData.shippingAddress - Shipping address object
 * @returns {Promise<Object>} - The created order
 */
export async function createTicketOrder(ticketOrderData) {
    const { user_id, tickets, total_price, shippingAddress } = ticketOrderData;
    
    const orderData = {
        user_id,
        order_type: "ticket",
        items: tickets.map(ticket => ({
            ref_id: ticket.event_id,
            ref_model: "Event",
            seat_zone_id: ticket.seat_zone_id,
            price_at_order: ticket.price,
            quantity: ticket.quantity,
            date: ticket.date
        })),
        total_price,
        shipping_address: shippingAddress,
        status: "pending"
    };
    
    return createOrder(orderData);
}

/**
 * Cancel an order
 * 
 * @param {string} order_id - The ID of the order to cancel
 * @returns {Promise<Object>} - The cancelled order
 */
export async function cancelOrder(order_id) {
    return updateOrderStatus(order_id, "cancelled");
}
