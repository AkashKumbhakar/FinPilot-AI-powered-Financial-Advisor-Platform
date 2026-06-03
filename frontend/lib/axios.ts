import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


// REQUEST INTERCEPTOR

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // TOKEN EXPIRED

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        // CALL REFRESH TOKEN API

        const res = await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,

          {},

          {
            withCredentials: true,
          }
        );

        // SAVE NEW TOKEN

        const newAccessToken =
          res.data.accessToken;

        localStorage.setItem(
          "token",
          newAccessToken
        );

        // UPDATE HEADER

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // RETRY ORIGINAL REQUEST

        return api(originalRequest);

      } catch (refreshError) {

        // REFRESH FAILED

        localStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;