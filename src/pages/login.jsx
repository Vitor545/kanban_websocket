import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {requestPost} from '../services/requests';

export const meta = () => [{title: 'Login'}];

function Login() {
	const [isVisible, setIsVisible] = useState('password');
	const [eyePassword, seteyePassword] = useState('fa-eye eyePassword');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMensage, seterrorMensage] = useState('');
	const [displayNone, setdisplayNone] = useState('none');
	const navigate = useNavigate();

	const onChangeClass = target => {
		if (target.id === 'email_id') {
			const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
			if (target.value.match(emailRegex)) {
				target.classList.add('checked');
				target.classList.remove('checkedError');
			} else if (target.value === '') {
				target.classList.remove('checked');
				target.classList.remove('checkedError');
			} else {
				target.classList.add('checkedError');
				target.classList.remove('checked');
			}
		} else if (target.value !== '') {
			target.classList.add('checked');
		} else {
			target.classList.remove('checked');
		}
	};

	const onChange = ({target}) => {
		onChangeClass(target);
		if (target.id === 'email_id') {
			setEmail(target.value);
		} else {
			setPassword(target.value);
		}
	};

	const isVisibleFunction = () => {
		if (isVisible === 'password') {
			setIsVisible('text');
			seteyePassword('fa-eye-slash eyePassword');
		} else {
			setIsVisible('password');
			seteyePassword('fa-eye eyePassword');
		}
	};

	const onClick = async () => {
		const request = await requestPost('/login', {
			email,
			password,
		});

		if (typeof request === 'string') {
			seterrorMensage(request);
			setdisplayNone('flex');
			return navigate('/');
		}

		setdisplayNone('none');
		localStorage.setItem(
			'user',
			JSON.stringify({
				email: request.email,
				name: request.name,
				id: request.usuarioID,
			}),
		);
		localStorage.setItem('token', JSON.stringify(request.value));
		return navigate('/kanban');
	};

	return (
		<section>
			<div className='container section_login'>
				<div className='login_text'>
					<h1 data-testid='login_title'>Login</h1>
					<p>
            Bem vindo de volta. Coloque suas credenciais para acessar sua conta.
					</p>
				</div>
				<div className='ms_gerror' style={{display: displayNone}}>
					<span>{errorMensage}</span>
				</div>
				<form action='#' onSubmit={e => e.preventDefault()}>
					<div className='input'>
						<label htmlFor='email_id'>
              Endereço de Email
							<input
								data-testid='input_login_email'
								type='text'
								onChange={onChange}
								placeholder='Coloque seu Email'
								id='email_id'
							/>
						</label>
					</div>
					<div className='input password'>
						<label htmlFor='password_id'>
              Senha
							<input
								type={isVisible}
								data-testid='input_login_senha'
								onChange={onChange}
								placeholder='Coloque sua Senha'
								id='password_id'
							/>
						</label>
						<i
							onClick={isVisibleFunction}
							className={`fa-solid ${eyePassword}`}
						/>
					</div>
					<button
						className='btn'
						onClick={onClick}
						data-testid='login_button'
						type='submit'
					>
            Continuar
					</button>
				</form>
				<div className='resgisterLink'>
          Ainda não tem uma conta?{' '}
					<span onClick={() => navigate('/register')}>Cadastrar agora</span>
				</div>
			</div>
		</section>
	);
}

export default Login;
