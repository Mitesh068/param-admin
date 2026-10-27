import axios, { isAxiosError } from "axios";
import { VITE_API_URL } from "../../config/Config";

const axiosAuthenticated = axios.create({
    baseURL: VITE_API_URL,
});

// ===============================
// Axios Request Interceptor
// ===============================
axiosAuthenticated.interceptors.request.use(
    (request) => {
        const authToken = localStorage.getItem("accessToken");

        if (authToken) {
            request.headers.Authorization = `Bearer ${authToken}`;
        }

        return request;
    },
    (err) => Promise.reject(err)
);

// ===============================
// Axios Response Interceptor
// ===============================
axiosAuthenticated.interceptors.response.use(
    (res) => res.data,

    async (err) => {
        if (isAxiosError(err)) {
            const status = err.response?.status;
            const message =
                err.response?.data?.message || err.message;

            switch (status) {
                case 400:
                    console.log(`Error 400: ${message}`);
                    break;

                case 401:
                    console.log(
                        "Error 401: Session Expired. Please Login Again"
                    );
                    break;

                case 403:
                    console.log("Error 403: Forbidden");
                    break;

                case 404:
                    console.log(
                        `Error 404: ${message} || Request not found`
                    );
                    break;

                case 500:
                    console.log(
                        `Error 500: ${message} || Internal Server Error`
                    );
                    break;

                default:
                    console.log(`Error: ${message}`);
                    break;
            }
        }

        return Promise.reject(err);
    }
);

// ===============================
// API Helpers
// ===============================

export const axiosGet = async (url, params) =>
    await axiosAuthenticated.get(url, { params });

export const axiosPost = async (url, data, header) =>
    await axiosAuthenticated.post(url, data, header);

export const axiosPatch = async (url, data) =>
    await axiosAuthenticated.patch(url, data);

export const axiosPut = async (url, data) =>
    await axiosAuthenticated.put(url, data);

export const axiosDelete = async (url) =>
    await axiosAuthenticated.delete(url);