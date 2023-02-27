import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';


const Registrar = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');

    const [alerta, setAlerta ] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();
        
        if([nombre, email, password, repetirPassword].includes('')){
            setAlerta({ msg: 'Todos los campos del formulario son obligatorios', error: true });
            return;
        }

        if(password !== repetirPassword){
            setAlerta({msg: 'Los passwords no son iguales', error: true});
            return;
        }

        if(password.length < 6) {
            setAlerta({msg: 'El passoword debe tener mínimo 6 caracteres', error: true});
            return;
        }

        setAlerta({})

        try {
            await clienteAxios.post('/veterinarios', { nombre, email, password });
            setAlerta({
                msg: 'Creado correctamente. Revisa tu email para confirmar la cuenta.',
                error: false
            });
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;
	return (
		<>
			<div>
				<h1 className='text-indigo-600 font-black text-6xl'>
					Crea tu cuenta y administra{' '}
					<span className='text-black'>tus pacientes</span>
				</h1>
			</div>
			<div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
                { msg && <Alerta 
                    alerta={alerta}
                />}
				<form 
                    onSubmit={handleSubmit}
                >
					<div className='my-5'>
						<label className='uppercase text-gray-600 block text-xl font-bold'>
							Nombre:
						</label>
						<input
							type='text'
							placeholder='Ingresa tu nombre'
							className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
						></input>
					</div>
					<div className='my-5'>
						<label className='uppercase text-gray-600 block text-xl font-bold'>
							Email:
						</label>
						<input
							type='email'
							placeholder='Ingresa tu email'
							className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
						></input>
					</div>
					<div className='my-5'>
						<label className='uppercase text-gray-600 block text-xl font-bold'>
							Confirmar Password:
						</label>
						<input
							type='password'
							placeholder='Confirma tu password'
							className='border w-full p-3 mt-3 bg-gray-50 rounded-xl'
                            value={repetirPassword}
                            onChange={e => setRepetirPassword(e.target.value)}
						></input>
					</div>
					<input
						type='submit'
						value='Registrate'
						className='bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-900 md:w-auto'
					></input>
				</form>

				<nav className='mt-10 lg:flex lg:justify-between'>
					<Link
						className='block text-center my-5 text-indigo-500 font-bold'
						to='/'
					>
						¿Ya tienes una cuenta? Inicia sesión
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

export default Registrar;
