const jwt_decode = require('jwt-decode');

export const isAuthenticated = () => localStorage.getItem("TOKEN_KEY") !== null;

export const getToken = () => localStorage.getItem("TOKEN_KEY");

export const decodeToken = () => {
    if(localStorage.getItem("TOKEN_KEY"))
        return jwt_decode(localStorage.getItem("TOKEN_KEY"));
    return null;
};
