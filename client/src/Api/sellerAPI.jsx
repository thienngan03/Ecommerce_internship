import api from "./axios";

// Accounts API
export const createBuyer = async (buyerData, accountId) => {
    try {
        const response = await api.put(`/seller/${accountId}/createBuyer`, buyerData);
        return response.data;
    } catch (error) {
        console.error("Error creating buyer:", error);
        throw error;
    }
}
export const createShop = async (shopData, accountId) => {
    try {
        const response = await api.put(`/seller/${accountId}/createShop`, shopData);
        return response.data;
    } catch (error) {
        console.error("Error creating shop:", error);
        throw error;
    }
}
export const getSeller = async (accountId) => {
    try {
        const response = await api.get(`/seller/${accountId}/getSeller`);
        return response.data;
    } catch (error) {
        console.error("Error fetching seller:", error);
        throw error;
    }
}
export const getShopByAccountId = async (accountId) => {
    try {
        const response = await api.get(`/seller/${accountId}/getShop`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop by account ID:", error);
        throw error;
    }
}
export const updateSeller = async (sellerId, sellerData) => {
    try {
        const response = await api.put(`/seller/updateSeller/${sellerId}`, sellerData);
        return response.data;
    } catch (error) {
        console.error("Error updating seller:", error);
        throw error;
    }
}
export const updateShop = async (shopId, shopData) => {
    try {
        const response = await api.put(`/seller/updateShop/${shopId}`, shopData);
        return response.data;
    } catch (error) {
        console.error("Error updating shop:", error);
        throw error;
    }
}

// Category API
export const createCategory = async (shopId, categoryData) => {
    try {
        const response = await api.post(`/seller/${shopId}/createCategory`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}
export const getCategories = async (shopId) => {
    try {
        const response = await api.get(`/seller/${shopId}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}
export const getCategoryById = async (shopId, categoryId) => {
    try {
        const response = await api.get(`/seller/${shopId}/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        throw error;
    }
}
export const updateCategory = async (shopId, categoryId, categoryData) => {
    try {
        const response = await api.put(`/seller/${shopId}/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}
export const deleteCategory = async (shopId, categoryId) => {
    try {
        const response = await api.put(`/seller/${shopId}/categories/delete/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

// Product API
export const createProduct = async (shopId, productData) => {
    try {
        const response = await api.post(`/seller/${shopId}/product`, productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}
export const getProductById = async (shopId, productId) => {
    try {
        const response = await api.get(`/seller/${shopId}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}
export const getProductsByShopId = async (shopId) => {
    try {
        const response = await api.get(`/seller/${shopId}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products by shop ID:", error);
        throw error;
    }
}
export const getProductsByCategory = async (shopId, categoryId) => {
    try {
        const response = await api.get(`/seller/${shopId}/products/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }   
}
export const updateProduct = async (shopId, productId, productData) => {
    try {
        const response = await api.put(`/seller/${shopId}/updateProduct/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}
export const deleteProduct = async (shopId, productId) => {
    try {
        const response = await api.put(`/seller/${shopId}/product/delete/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
// Order API
export const getOrdersByShopId = async (shopId) => {
    try {
        const response = await api.get(`/seller/${shopId}/orders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders by shop ID:", error);
        throw error;
    }
}
export const getOrderById = async (shopId, orderId) => {
    try {
        const response = await api.get(`/seller/${shopId}/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
}
export const updateOrderStatus = async (shopId, orderId, statusData) => {
    try {
        const response = await api.put(`/seller/${shopId}/orders/${orderId}`, statusData);
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}