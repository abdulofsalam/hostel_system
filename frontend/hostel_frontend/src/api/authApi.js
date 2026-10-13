import api from "./axios";

export const signupUser = async (userData) => {

    const response = await api.post(
        "auth/signup/",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {

    const response = await api.post(
        "auth/login/",
        userData
    );

    return response.data;
};
 export const getProfile = async () => {
    const response = await api.get("auth/profile/");
    return response.data;
  };

 export const updateProfile = async (profileData) => {
    const response = await api.put("auth/profile/", profileData);
    return response.data;
  };
  
 export const changePassword = async (passwordData) => {
    const response = await api.post(
      "auth/change-password/",
      passwordData
    );
    return response.data;
  };
  

// import api from "./axios";

// export const signupUser = async (userData) => {
//     const response = await api.post(
//         "auth/signup/",
//         userData
//     );

//     return response.data;
// };

// export const loginUser = async (userData) => {
//     const response = await api.post(
//         "auth/login/",
//         userData
//     );

//     return response.data;
// };

// export const refreshAccessToken = async (refreshToken) => {
//     const response = await api.post(
//         "auth/token/refresh/",
//         {
//             refresh: refreshToken,
//         }
//     );

//     return response.data;
// };