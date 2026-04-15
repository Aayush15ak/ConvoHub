// now in development, we will use this file to create an axios instance with the base URL of our backend API. This way, we can easily make API calls throughout our application without having to specify the base URL every time.
//TO-DO: Replace it wil deployed backend URL before deployement

import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // to send cookies with every request
})