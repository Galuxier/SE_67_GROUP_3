import { api } from "../Axios";
import { createPayment } from "./PaymentApi";

export async function getUserOrders(user_id) {
    try {
        const response = await api.get(`/user/${user_id}/orders`);
        return response.data;
    } catch (error) {
        console.error('Get All Gym Failed: ', error);
        throw error;
    }
}

/**
 * Fetch orders for a specific shop with optional status filtering
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

export async function createOrder(orderData) {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Create Order Failed: ', error);
        throw error;
    }
}

/**
 * Create a course order and payment
 */
export async function createCourseOrder(courseOrderData) {
    const { user_id, course_id, quantity, price, shippingAddress, payment_method } = courseOrderData;
    
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

    try {
        // สร้าง Order
        const order = await createOrder(orderData);

        // สร้าง Payment โดยใช้ order._id
        const paymentData = {
            order_id: order._id,
            user_id,
            amount: order.total_price,
            payment_method: payment_method || "credit_card", // Default to credit_card if not provided
            payment_status: "pending"
        };
        const payment = await createPayment(paymentData);

        // Return ทั้ง order และ payment
        return { order, payment };
    } catch (error) {
        console.error('Create Course Order with Payment Failed: ', error);
        throw error;
    }
}

/**
 * Create a product order and payment
 */
export async function createProductOrder(productOrderData) {
    const { user_id, items, total_price, shippingAddress, payment_method } = productOrderData;
    
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
    
    try {
        // สร้าง Order
        const order = await createOrder(orderData);

        // สร้าง Payment โดยใช้ order._id
        const paymentData = {
            order_id: order._id,
            user_id,
            amount: total_price,
            payment_method: payment_method || "credit_card",
            payment_status: "pending"
        };
        const payment = await createPayment(paymentData);
        console.log({order, payment});
        // Return ทั้ง order และ payment
        return { order, payment };
    } catch (error) {
        console.error('Create Product Order with Payment Failed: ', error);
        throw error;
    }
}

/**
 * Create a ticket order and payment
 */
export async function createTicketOrder(ticketOrderData) {
    const { user_id, tickets, total_price, shippingAddress, payment_method } = ticketOrderData;
    
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
    
    try {
        // สร้าง Order
        const order = await createOrder(orderData);

        // สร้าง Payment โดยใช้ order._id
        const paymentData = {
            order_id: order._id,
            user_id,
            amount: total_price,
            payment_method: payment_method || "credit_card",
            payment_status: "pending"
        };
        const payment = await createPayment(paymentData);

        // Return ทั้ง order และ payment
        return { order, payment };
    } catch (error) {
        console.error('Create Ticket Order with Payment Failed: ', error);
        throw error;
    }
}

/**
 * Create a package order and payment
 */
export async function createPackageOrder(packageOrderData) {
    const { user_id, package_id, quantity, price, shippingAddress, payment_method } = packageOrderData;
    
    const orderData = {
        user_id,
        order_type: "ads_package",
        items: [
            {
                ref_id: package_id,
                ref_model: "AdsPackage",
                price_at_order: price,
                quantity
            }
        ],
        total_price: price * quantity,
        shipping_address: shippingAddress,
        status: "pending"
    };
    
    try {
        // สร้าง Order
        const order = await createOrder(orderData);

        // สร้าง Payment โดยใช้ order._id
        const paymentData = {
            order_id: order._id,
            user_id,
            amount: order.total_price,
            payment_method: payment_method || "credit_card",
            payment_status: "pending"
        };
        const payment = await createPayment(paymentData);

        // Return ทั้ง order และ payment
        return { order, payment };
    } catch (error) {
        console.error('Create Package Order with Payment Failed: ', error);
        throw error;
    }
}

/**
 * Cancel an order
 */
export async function cancelOrder(order_id) {
    return updateOrderStatus(order_id, "cancelled");
}