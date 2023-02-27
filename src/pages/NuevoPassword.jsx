import { useState, useEffect } from 'react';
import Alerta from '../components/Alerta';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

const NuevoPassword = () => {
	const [password, setPassword] = useState('');
	const [repetirPassword, setRepetirPassword] = useState('');
	const [alerta, setAlerta] = useState({});
	const [tokenValido, setTokenValido] = useState(false);
	const [tokenConfirmado, settokenConfirmado] = useState(false);
	const params = useParams();
	const { token } = params;

	useEffect(() => {
		const comprobarToken = async () => {
			try {
				await clienteAxios(`/veterinarios/olvide-password/${token}`);
				setAlerta({
					msg: 'Ingresa tu nuevo password',
				});
				setTokenValido(true);
			} catch (error) {
				setAlerta({
					msg: 'El token no es válido',
					error: true,
				});
			}
		};
		comprobarToken();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== repetirPassword) {
			setAlerta({ msg: 'Los passwords no son iguales', error: true });
			return;
		}

		if (password.length < 6) {
			setAlerta({
				msg: 'El passoword debe tener mínimo 6 caracteres',
				error: true,
			});
			return;
		}

		try {
			const { data } = await clienteAxios.post(
				`/veterinarios/olvide-password/${token}`,
				{ password }
			);
			console.log(data);
			setAlerta({ msg: data.msg });
			settokenConfirmado(true);
		} catch (error) {
			setAlerta({
				msg: error.response.data.msg,
				error: true,
			});
		}
	};
	const { msg } = alerta;
	return (
		<>
			<div>
				<h1 className='text-indigo-600 font-black text-6xl'>
					Restablece tu constraseña y no pierdas acceso a{' '}
					<span className='text-black'>tus pacientes</span>
				</h1>
			</div>

			<div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
				{msg && <Alerta alerta={alerta} />}

				{tokenValido && (
					<>
						<form onSubmit={handleSubmit}>
							<div className='my-5'>
								<label className='uppercase text-gray-600 block text-xl font-bold'>
									Nuevo Password:
								</label>
								<input
									type='password'
									placeholder='Ingresa tu password'
									className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								></input>
							</div>
							<div className='my-5'>
								<label className='uppercase text-gray-600 block text-xl font-bold'>
									Confirmar Nuevo Password:
								</label>
								<input
									type='password'
									placeholder='Confirma tu password'
									className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
									value={repetirPassword}
									onChange={(e) => setRepetirPassword(e.target.value)}
								></input>
							</div>

							<input
								type='submit'
								value='Restablecer Constraseña'
								className='bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-900 md:w-auto'
							></input>
						</form>
						
					</>
				)}
        {tokenConfirmado && (
          <Link
            className='block text-center my-5 text-indigo-500 font-bold'
            to='/'
          >
            Inicia sesión
          </Link>
        )}
			</div>
		</>
	);
};

export default NuevoPassword;