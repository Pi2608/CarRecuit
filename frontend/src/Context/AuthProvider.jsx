import React, { createContext, useContext, useState } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(Cookies.get('token') ? true : false)

    const login = (token) => {
        setAuth(true)
        Cookies.set('token', token, { expires: 7 })
    };
    
    const logout = () => {
        setAuth(false)
        Cookies.remove('token')
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export the useAuth hook for useContext
export const useAuth = () => useContext(AuthContext);

// import { createContext, useState } from "react";
// import Cookies from 'js-cookie';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState(Cookies.get('token') ? true : false);

//     const login = (token) => {
//         setAuth(true);
//         Cookies.set('token', token, { expires: 7 });
//     };
    
//     const logout = () => {
//         setAuth(false);
//         Cookies.remove('token');
//     };

//     return (
//         <AuthContext.Provider value={{auth, login, logout}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// const useAuth = () => useContext(AuthContext);

// export { AuthProvider, useAuth };