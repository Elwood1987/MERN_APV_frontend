import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';

const PacientesContext = createContext();

const PacientesProvider = ({ children }) => {
	const [pacientes, setPacientes] = useState([]);
	const [paciente, setPaciente] = useState({});
	const { auth } = useAuth();
	useEffect(() => {
		const obtenerPacientes = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					return;
				}

				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};

				const { data } = await clienteAxios('/pacientes', config);
				setPacientes(data);
			} catch (error) {
				console.log(error);
			}
		};
		obtenerPacientes();
	}, [auth]);

	const guardarPaciente = async (paciente) => {
		

		if (paciente.id) {
			try {
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, getConfiguration());
                const pacientesActualizado = pacientes.map( pacienteState => pacienteState._id === data._id ? data : pacienteState );
                setPacientes(pacientesActualizado);
            } catch (error) {
                console.log(error.response.data.msg);
            }
		} else {
			try {
				const { data } = await clienteAxios.post(
					'/pacientes',
					paciente,
					config
				);

				const { createdAt, updateAt, __v, ...pacienteAlmacenado } = data;

				setPacientes([pacienteAlmacenado, ...pacientes]);
			} catch (error) {
				console.log(error.response.data.msg);
			}
		}
	};

	const setEdicion = (paciente) => {
		setPaciente(paciente);
		console.log(paciente);
	};

    const eliminarPaciente = async id => {
        try {
            const confirmar = confirm('¿Confirmas que deseas eliminar?');
            if (confirmar) {
                const { data } = await clienteAxios.delete(`/pacientes/${id}`,getConfiguration())
                
                const pacientesActualizado = pacientes.filter( pacientesState => pacientesState._id !== id );
                setPacientes(pacientesActualizado);
            }
            
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }

    const getConfiguration = () => {
        const token = localStorage.getItem('token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
        return config;
    }

	return (
		<PacientesContext.Provider
			value={{
				pacientes,
				guardarPaciente,
				setEdicion,
				paciente,
                eliminarPaciente,
			}}
		>
			{children}
		</PacientesContext.Provider>
	);
};

export { PacientesProvider };

export default PacientesContext;
