// Axios is a promise-based JavaScript library for making HTTP requests 
// (for example, fetching data from APIs) from either the browser or Node.js environments.
// Axios is widely used in React projects for API requests due to its simplicity and features.
// Axios: Use for HTTP/fetch/API calls—powerful, feature-rich alternative to fetch().


import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api", // Replace with your API endpoint
    withCredentials: true //used to send cookies with the request
})

