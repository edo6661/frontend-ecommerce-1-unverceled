/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Oauth from '../../components/Oauth';
import { RiCheckboxBlankCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri'
import Button from '../../components/style/Button';

const Register = () => {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		passwordShown: false,
	});

	const { user, navigate } = useAuth();

	const { username, email, password, confirmPassword, passwordShown } =
		formData;

	const canSubmit =
		username.length > 0 &&
		password.length > 0 &&
		confirmPassword.length > 0 &&
		email.length > 0;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;

		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const togglePassword = () => {
		setFormData({ ...formData, passwordShown: !passwordShown });
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (confirmPassword !== password) {
			return toast.error('password ga sama puh');
		}
		const sendData = { username, email, password };
		try {
			const res = await axios.post('/auth/register', sendData);
			toast.success(res.data.message);

			setFormData({
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
				passwordShown: false,
			});
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};

	if (!user) {
		return (
			<>
				<form
					action=""
					className="text-black flex flex-col max-w-lg mx-auto mt-8"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						required
						name="username"
						placeholder="Username..."
						autoComplete="current-username"
						onChange={handleInputChange}
						value={username}
						className='rounded-t-xl'
					/>
					<input
						type="email"
						required
						name="email"
						placeholder="Email..."
						autoComplete="current-email"
						onChange={handleInputChange}
						value={email}
					/>

					<div className='flex relative'>
						<input
							className='flex-1'
							required
							type={passwordShown ? 'text' : 'password'}
							name="password"
							placeholder="Password..."
							autoComplete="current-password"
							onChange={handleInputChange}
							value={password}
						/>
						<input
							required
							type={passwordShown ? 'text' : 'password'}
							name="confirmPassword"
							placeholder="ConfirmPassword..."
							autoComplete="current-confirm-password"
							onChange={handleInputChange}
							value={confirmPassword}
							className='flex-1'
						/>
						<button className='absolute right-1 bottom-1' type='button' onClick={togglePassword}>{passwordShown ? <RiCheckboxBlankCircleLine size={40} color={'white'} /> : <RiCheckboxBlankCircleFill size={40} color={'white'} />}</button>

					</div>
					<Button
						disabled={!canSubmit}
						rounded='none'
					>
						Submit
					</Button>
					<Oauth />
				</form>
			</>
		);
	} else {
		<Navigate
			to="/"
			replace
		/>;
	}
};

export default Register;
