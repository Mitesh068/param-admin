 import { axiosDelete, axiosGet, axiosPost } from "../handler/Handler"


// login handler 
export const Authentication = async (data) => {
    const response = await axiosPost("/api/admin/login", data)
    return response
}

// admin details 
export const AdminDetails = async () => {
    const response = await axiosGet("/api/admin/admin-details")
    return response
}

// blogs list
export const BlogList = async () => {
    const response = await axiosGet("/api/blogs/blogs")
    return response
}

// blog add
export const AddBlog = async (data) => {
    const response = await axiosPost("/api/blogs/add-blogs", data)
    return response
}

// delete blog
export const DeletBlog = async (id) => {
    const response = await axiosDelete(`/api/blogs/delet-blog/${id}`, id)
    return response
}

// product add
export const AddProduct = async (data) => {
    const response = await axiosPost("/api/products/create-product", data)
    return response
}

// view product
export const ViewProduct = async () => {
    const resposne = await axiosGet('/api/products/get-products')
    return resposne
}

// delete product 
export const DeleteProduct = async (id) => {
    const response = await axiosDelete(`/api/products/delete-product/${id}`, id)
    return response
}

// view-caytegory
export const ViewCategory = async () => {
    const response = await axiosGet('/api/category/get-categories')
    return response
}

// delete category 
export const DeleteCategory = async (id) => {
    const resposne = await axiosDelete(`/api/category/delete-category/${id}`, id)
    return resposne
}

// add catgegory 
export const AddCategory = async (data) => {
    const response = await axiosPost('/api/category/create-category', data)
    return response
}

// view orders
export const ViewOrders = async () => {
    const response = await axiosGet('/api/order/get-order')
    return response
}

// payment list
export const PaymentList = async () => {
    const response = await axiosGet('/api/payment/payment-list')
    return response
}