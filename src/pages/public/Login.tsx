import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axiosCredentials';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import Oauth from '../../components/Oauth';
import { RiCheckboxBlankCircleFill, RiCheckboxBlankCircleLine } from 'react-icons/ri'
import Button from '../../components/style/Button';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		passwordShown: false,
	});

	const { login, isLoading, navigate, setIsLoading, user } = useAuth();

	const { email, password, passwordShown } = formData;

	const canSubmit = email.length > 0 && password.length > 0;

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
		const sendData = { email, password };
		try {
			setIsLoading?.(true);
			const res = await axios.post('/auth/login', sendData);
			if (res.data) {
				toast.success(res.data.message);
				login?.(res.data.user);
			}
			navigate('/');
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			toast.error(axiosError.response?.data.message);
			console.error(err); ''
		} finally {
			setIsLoading?.(false);
		}
		setFormData({
			email: '',
			password: '',
			passwordShown: false,
		});

	};

	if (isLoading) return <Loading />

	if (!user) {
		return (
			<>
				<form
					action=""
					className="text-black flex flex-col max-w-lg mx-auto mt-8"
					onSubmit={handleSubmit}
				>
					<input
						type="email"
						name="email"
						placeholder="Email..."
						autoComplete="current-email"
						onChange={handleInputChange}
						value={email}
						className='rounded-t-xl'
					/>
					<div className="relative">
						<input
							type={passwordShown ? 'text' : 'password'}
							name="password"
							placeholder="Password..."
							autoComplete="current-password"
							onChange={handleInputChange}
							value={password}
							className=' w-full'

						/>
						<button className='absolute right-1 bottom-1' type='button' onClick={togglePassword}>{passwordShown ? <RiCheckboxBlankCircleLine size={40} color={'white'} /> : <RiCheckboxBlankCircleFill size={40} color={'white'} />}</button>
					</div>
					<Button
						disabled={!canSubmit}
						type="submit"
						rounded='none'
					>
						Submit
					</Button>
					<Oauth />
				</form>
			</>
		);
	} else {
		return (
			<Navigate
				to="/"
				replace
			/>
		);
	}
};

export default Login;
