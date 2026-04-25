import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://convohub-4shb.onrender.com/api' || 'http://localhost:3000/api', // use env variable or fallback to localhost
    withCredentials: true, // to send cookies with every request
})

/*
response of axios in case of error is like this:
{
  message: "Request failed with status code 400",
  response: {
    data: {
      message: "Invalid email or password"
    },
    status: 400,
    headers: {...}
  }
}
*/