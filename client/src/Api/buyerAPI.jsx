import api from "./axios";

// Accounts API
export const createBuyer = async (buyerData, accountId) => {
    try {
        const response = await api.put(`/buyer/${accountId}/createBuyer`, buyerData);
        return response.data;
    } catch (error) {
        console.error("Error creating buyer:", error);
        throw error;
    }
}
export const getBuyer = async (accountId) => {
    try {
        const response = await api.get(`/buyer/${accountId}/getBuyer`);
        return response.data;
    } catch (error) {
        console.error("Error fetching buyer:", error);
        throw error;
    }
}
export const getProfile = async (buyerId) => {
    try {
        const response = await api.get(`/buyer/getProfile/${buyerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}
export const updateProfile = async (buyerId, profileData) => {
    try {
        const response = await api.put(`/buyer/updateProfile/${buyerId}`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
}
export const deleteBuyer = async (buyerId) => {
    try {
        const response = await api.put(`/buyer/delete/${buyerId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting buyer:", error);
        throw error;
    }
}

// Cart API
export const getCartsByBuyerId = async (buyerId) => {
    try {
        const response = await api.get(`/buyer/${buyerId}/carts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching carts:", error);
        throw error;
    }
}
export const addToCart = async (buyerId, cartData) => {
    try {
        const response = await api.post(`/buyer/${buyerId}/cart`, cartData);
        return response.data;
    } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
    }
}
export const updateCart = async (buyerId, cartData) => {
    try {
        const response = await api.put(`/buyer/${buyerId}/cart`, cartData);
        return response.data;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
}
export const removeProductFromCart = async (buyerId, productId) => {
    try {
        const response = await api.put(`/buyer/${buyerId}/cart/delete`, { productId });
        return response.data;
    } catch (error) {
        console.error("Error removing product from cart:", error);
        throw error;
    }
}

// Order API
export const checkout = async (buyerId, orderData) => {
    try {
        const response = await api.post(`/buyer/${buyerId}/checkout`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
}
export const prepareTransaction = async (buyerId, transactionData) => {
    try {
        const response = await api.post(`/buyer/${buyerId}/prepareTransaction`, transactionData);
        return response.data;
    } catch (error) {
        console.error("Error preparing transaction:", error);
        throw error;
    }
}
export const checkTrans = async (buyerId, orderId, transactionUrl) => {
    try {
        const response = await api.post(`/buyer/${buyerId}/checkTransaction/${orderId}`, { transactionUrl });
        return response.data;
    } catch (error) {
        console.error("Error checking transaction:", error);
        throw error;
    }
}
export const updateTransaction = async (buyerId, orderId) => {
    try {
        const response = await api.put(`/buyer/${buyerId}/updateTransaction/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}
export const getOrdersByBuyerId = async (buyerId) => {
    try {
        const response = await api.get(`/buyer/${buyerId}/orders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}
export const getOrderById = async (buyerId, orderId) => {
    try {
        const response = await api.get(`/buyer/${buyerId}/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
}
