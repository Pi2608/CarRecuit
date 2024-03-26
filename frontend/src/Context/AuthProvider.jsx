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
        if (role !== 1) {
            navigate("/admin/dashboard")
        }
    };
    
    const logout = () => {
        setAuth(false);
        Cookies.remove('token');
        setRoleId('');
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            getAuth(token).then((data) => {
                setId(data.userid);
                setRoleUserId(data.roleId);
            }).catch((error) => {
                console.error("Authentication error: " + error.message);
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

export const useAuth = () => useContext(AuthContext);
