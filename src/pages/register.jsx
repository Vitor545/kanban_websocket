import React, {useState} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import {requestPost} from '../services/requests';

export const meta = () => [{title: 'Register'}];

function Register() {
	const [isVisible, setIsVisible] = useState('password');
	const [eyePassword, seteyePassword] = useState('fa-eye eyePassword');
	const [nameInput, setnameInput] = useState('');
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
		if (target.id === 'name_id') {
			setnameInput(target.value);
		} else if (target.id === 'email_id') {
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
		const request = await requestPost('user/create', {
			name: nameInput,
			email,
			password,
		});
		if ((typeof request === 'string') && (request !== 'created')) {
			seterrorMensage(request);
			setdisplayNone('flex');
			return navigate('/register');
		}

		setdisplayNone('none');
		return navigate('/');
	};

	return (
		<section>
			<div className='container section_login'>
				<div className='login_text'>
					<h1>Register</h1>
					<p>Seja bem vindo. Preencha as credenciais para criar sua conta.</p>
				</div>
				<div className='ms_gerror' style={{display: displayNone}}>
					<span>{errorMensage}</span>
				</div>
				<form action='#' onSubmit={e => e.preventDefault()}>
					<div className='input'>
						<label htmlFor='name_id'>
              Nome
							<input
								type='text'
								onChange={onChange}
								placeholder='Coloque seu nome'
								id='name_id'
							/>
						</label>
					</div>
					<div className='input email'>
						<label htmlFor='email_id'>
              Endereço de Email
							<input
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
					<button className='btn' onClick={onClick} type='submit'>
            Continuar
					</button>
				</form>
				<div className='resgisterLink'>
          Ja tem uma conta?{' '}
					<NavLink to='/'>
						<span>Login agora</span>
					</NavLink>
				</div>
			</div>
		</section>
	);
}

export default Register;
