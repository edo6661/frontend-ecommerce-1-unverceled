//  deliveryMethod paymentMethod cardNumber adreess required kalo user belum punya address
// ! bikin config delivery & method payment method

import { useState } from 'react';
import {
	RiCheckboxBlankCircleFill,
	RiCheckboxCircleFill,
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Button from '../../components/style/Button';
import axios from '../../config/axiosCredentials';
import { deliveryOptions } from '../../config/options';
import useAuth from '../../hooks/useAuth';
const Order = () => {
	const { isLoading, setIsLoading, user, navigate, setOrdersChanged } = useAuth();
	const [defaultAddress, setDefaultAddress] = useState<boolean>(false);
	const [formData, setFormData] = useState({
		deliveryMethod: '',
		shippingAddress: user?.address ? user.address : '',
	});

	const { deliveryMethod, shippingAddress } =
		formData;

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const sendData = {
			deliveryMethod,
			shippingAddress,
		};

		try {
			setIsLoading?.(true);
			await axios.post('/order', sendData);
			setOrdersChanged(true)
			toast.success('order sukses puh ');
			navigate('/');
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading?.(false)
		}
	};

	const canSubmit =
		[
			deliveryMethod.length,
			shippingAddress?.length,
		].every(Boolean) && !isLoading;


	const handleDefaultAddress = (e: React.SyntheticEvent) => {
		e.preventDefault();
		return setDefaultAddress((prev) => !prev);
	};

	if (isLoading) return <Loading />
	return (
		<form
			action=""
			className="text-black flex flex-col max-w-xl mx-auto mt-8"
			onSubmit={handleSubmit}
		>
			<div className="text-white flex">
				<input
					className=" flex-grow rounded-t-xl"
					type="text"
					required
					name="shippingAddress"
					placeholder="shippingAddress..."
					autoComplete="current-address"
					onChange={handleInputChange}
					value={shippingAddress}
				/>
				{!user?.address ? (
					defaultAddress ? (
						<button
							type="button"
							onClick={handleDefaultAddress}
						>
							<RiCheckboxCircleFill />
						</button>
					) : (
						<button
							type="button"
							onClick={handleDefaultAddress}
						>
							<RiCheckboxBlankCircleFill />
						</button>
					)
				) : (
					''
				)}
			</div>

			<select
				name="deliveryMethod"
				value={deliveryMethod}
				onChange={handleInputChange}
				required
			>
				<option value="">Pilih Jasa Pengiriman</option>
				{deliveryOptions.map((option) => (
					<option
						value={option}
						key={option}
					>
						{option}
					</option>
				))}
			</select>
			<Button
				rounded='bxl'
				disabled={!canSubmit}
			>
				submit
			</Button>
		</form >
	);
};

export default Order;
