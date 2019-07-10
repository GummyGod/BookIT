import React from 'react';

export default React.createContext({
    token: localStorage.getItem('token'),
    userId: null,
    login: (token,userId,tokenExpiration) => {},
    logout: () => {},
});