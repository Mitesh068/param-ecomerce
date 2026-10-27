import { axiosGet, axiosPost } from "../handler/Handler";

// login handler
export const Login = async (data) => {
    const resposne =  await axiosPost('/api/admin/login', data);
    return resposne 
}

// signup handler
export const signup = async (data) => {
    const resposne =  await axiosPost('/api/admin/sign-up', data);
    return resposne 
}

// admin details 
export const adminDetails = async() => {
    const resposne = await axiosGet('/api/admin/admin-details');
    return resposne
}

// blog list
export const blogList = async() => {
    const resposne = await axiosGet('/api/blogs/blogs');
    return resposne
}

// blog details
export const blogDetails = async (id) => {
    const response = await axiosGet(`/api/blogs/blog-details/${id}`);
    return response;
}

// category list
export const categoryList = async() => {
    const resposne = await axiosGet('/api/category/get-categories');
    return resposne
}

// porduct list
export const productList = async() => {
    const resposne = await axiosGet('/api/products/get-products');
    return resposne
}

// product by id
export const productById = async(id) => {
    const response = await axiosGet(`/api/products/get-product/${id}`)
    return response
}

// Add a product to the wishlist
export const wishlist = async (productId) => {
    const response = await axiosPost('/api/wishlist/create-wishlist', { product_id: productId });
    return response;
}

// get wishlist item 
export const getWishlist = async () => {
    const response = await axiosGet('/api/wishlist/view-wishlist'); 
    return response;
}

// add to cart
export const addToCart = async (productId, quantity) => {
    const response = await axiosPost('/api/cart/create-cart', { product_id: productId, quantity });
    return response;
}

// cart list 
export const cartList = async () => {
    const response = await axiosGet('/api/cart/view-cart');
    return response;
}

// add address
export const addAddress = async(data) => {
    const response = await axiosPost('/api/addresses/add-address', data);
    return response;
}

// get address list
export const getAddressList = async() => {
    const response = await axiosGet('/api/addresses/view-address');
    return response;
}

// create payment 
export const createPayment = async(data) => {
    const response = await axiosPost('/api/payment/create-payment', data);
    return response;
}

export const verifyPayment = async(data) => {
    const response = await axiosPost('/api/payment/verify-payment', data);
    return response;
}

// create order 
export const createOrder = async(data) => {
    const response = await axiosPost('/api/order/create-order', data);
    return response;
}

// get order list
export const getOrderList = async() => {
    const response = await axiosGet('/api/order/get-order');
    return response;
}

// get order details by id
export const getOrderDetailsbyId = async(id) => {
    const response = await axiosGet(`/api/order/get-order/${id}`);
    return response;
}

// Shiprocket credentials and requests stay on the server. These helpers call
// the authenticated backend proxy mounted at /api/shiprocket.
export const createShiprocketOrder = async (data) =>
    axiosPost('/api/shiprocket/create-order', data);

export const checkShiprocketServiceability = async (params) =>
    axiosGet('/api/shiprocket/serviceability', params);

export const trackShiprocketShipment = async (awb) =>
    axiosGet(`/api/shiprocket/track/${encodeURIComponent(awb)}`);
