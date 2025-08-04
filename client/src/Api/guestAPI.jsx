import api from "./axios";

export const getProducts = async () => {
    try {
        const response = await api.get("/products");
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}
export const getShops = async () => {
    try {
        const response = await api.get("/shops");
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching shops:", error);
        throw error;
    }
}
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}
export const getShopById = async (id) => {
    try {
        const response = await api.get(`/shops/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop by ID:", error);
        throw error;
    }
}
export const getShopByProductId = async (productId) => {
    try {
        const response = await api.get(`/shops/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shop by product ID:", error);
        throw error;
    }
}
export const searchProduct = async (name) => {
    try {
        const response = await api.get(`/search/products?query=${name}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}