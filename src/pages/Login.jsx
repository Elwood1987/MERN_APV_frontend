import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';

const Login = () => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ alerta, setAlerta ] = useState({})
	
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	const handleSubmit= async(e) => {
		e.preventDefault();

		if ([email, password].includes('')) {
			setAlerta({
				msg: 'El campo email y password son obligatorios.',
				error: true,
			});
			return;
		}

		try {
			const { data } = await clienteAxios.post('/veterinarios/login', {email, password});
			localStorage.setItem('token', data.token);
			setAuth( data );
			navigate('/admin')
		} catch (error) {
			setAlerta({
				msg: error.response.data.msg,
				error: true,
			});
		}
	}
	const { msg } = alerta
	return (
		<>
			<div>
				<h1 className='text-indigo-600 font-black text-6xl'>
					Inicia Sesión y Administra tus{' '}
					<span className='text-black'>Pacientes</span>
				</h1>
			</div>
			<div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
			{msg && <Alerta alerta={alerta} />}
				<form onSubmit={ handleSubmit }>
					<div className='my-5'>
						<label className='uppercase text-gray-600 block text-xl font-bold'>
							Email:
						</label>
						<input
							type='email'
							placeholder='Ingresa tu email'
							className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
							value={ email }
							onChange={ e => setEmail(e.target.value) }
						></input>
					</div>
					<div className='my-5'>
						<label className='uppercase text-gray-600 block text-xl font-bold'>
							Password:
						</label>
						<input
							type='password'
							placeholder='Ingresa tu password'
							className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
							value={ password }
							onChange={ e => setPassword(e.target.value) }
						></input>
					</div>
					<input
						type='submit'
						value='Iniciar Sesión'
						className='bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-900 md:w-auto'
					></input>
				</form>

				<nav className='mt-10 lg:flex lg:justify-between'>
					<Link
						className='block text-center my-5 text-indigo-500 font-bold'
						to='/registrar'
					>
						¿No tienes una cuenta? Regístrate
					</Link>
					<Link
						className='block text-center my-5 text-gray-500 font-bold'
						to='/olvide-password'
					>
						Olvide mi password
					</Link>
				</nav>
			</div>
		</>
	);
};

export default Login;
