import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [ cargando, setCargando ] = useState(true);
    const [ auth, setAuth] = useState({});

    useEffect(() => {
        const autenticarUsuario = async () => {
            
            
            try {
                const { data } = await clienteAxios('/veterinarios/perfil', getConfiguration());
                setAuth(data);
            } catch (error) {
                console.log(error.response.data.msg);
                setAuth({});
            }
            setCargando(false);
        }
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
    }

    const actualizarPerfil = async (datos) => {
        console.log(datos);
            try {
                const url = `/veterinarios/perfil/${datos._id}`;
                const { data } = await clienteAxios.put(url, datos, getConfiguration());
                console.log(data);
                return {
                    msg: 'Usuario actualizado correctamente',
                }
            } catch (error) {
                return {
                    msg: error.response.data.msg,
                    error: true,
                }
            }
    }

    const guardarPassword = async (datos) => {
        
        try {
            const url = '/veterinarios/actualizar-password';

            const { data } = await clienteAxios.put(url, datos, getConfiguration());
            console.log(data);
            return {
                msg: data.msg,
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true,
            }
        }
    }

    const getConfiguration = () => {
        const token = localStorage.getItem('token');
            if(!token) {
                setCargando(false);
                return;
            };
            
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        return config;
    }

    return (
        <AuthContext.Provider
            value={{
                auth, 
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword,
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext