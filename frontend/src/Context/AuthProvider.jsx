import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    
    const navigate = useNavigate();

    const [auth, setAuth] = useState(Cookies.get('token') ? true : false)
    const [roleUserId, setRoleUserId] = useState('')
    const [id, setId] = useState('')

    const getAuth = async (token) => {
        try {
            const response = await axios.get(`http://localhost:4000/user/getByToken?token=${token}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Authentication error: " + error.message);
        }
    } 

    const login = (token, role) => {
        setAuth(true)
        Cookies.set('token', token, { expires: 1 })
        if (role === 1) {
            navigate("/")
        } else if(role === 2 && role === 3) {
            navigate("/admin/dashboard")
        }
    };
    
    const logout = () => {
        setAuth(false)
        Cookies.remove('token')
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            getAuth(token).then((data) => {
                setId(data.userid);
                setRoleUserId(data.roleId);
            }).catch((error) => {
                // Handle authentication error, e.g., redirect to login page
                console.error("Authentication error: " + error.message);
                // Optionally, you can redirect to the login page or perform other actions
            });
        }
    }, [auth]);

    useEffect(()=>{

    },[id,roleUserId])

    return (
        <AuthContext.Provider value={{ auth, login, logout, id, roleUserId }}>
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