import { useParams } from 'react-router-dom';
import axios from './../../config/axiosCredentials';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Loading';
import { OrderDocument } from '../../type';
import Button from '../../components/style/Button';
const Payment = () => {
	const { isLoading, setIsLoading, user, setOrdersChanged } = useAuth();
	const { id } = useParams();
	const [order, setOrder] = useState<OrderDocument>();
	const [token, setToken] = useState<string>('')
	const [formData, setFormData] = useState({
		order_id: id,
		gross_amount: order ? order?.totalAmount : 0,
		email: user ? user.email : '',
		address: order ? order.shippingAddress : '',
		phone: user ? user.phone : 0,
	})
	const getOrder = async () => {
		try {
			setIsLoading?.(true);
			const res = await axios.get(`/order/${id}`);
			setOrder(res.data);
			setFormData({
				order_id: id,
				gross_amount: res.data.totalAmount,
				email: user ? user.email : '',
				address: res.data.shippingAddress,
				phone: user ? user.phone : 0,
			});

		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading?.(false);
		}
	};
	useEffect(() => {
		getOrder();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const payOrder = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.patch(`/pay/${id}`);
			const { data } = await axios.post('/pay', formData);
			setOrdersChanged(true)
			setToken(data.token);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (token) {
			// @ts-expect-error: gatau midtrans
			window.snap.pay(token, {
				// @ts-expect-error: gatau midtrans
				onSuccess: async (result) => {

					try {
						await axios.post('/payments', result);
					} catch (error) {
						console.error(error);
					}

					setToken('')

				},// @ts-expect-error: gatau midtrans
				onPending: async (result) => {
					try {
						await axios.post('/payments', result);
					} catch (error) {
						console.error(error);
					}
					setToken('')

				},// @ts-expect-error: gatau midtrans
				onError: (err) => {
					console.log(err)
					setToken('')

				},
				onClose: () => {
					console.log("sepuh belum selesai menyelesaikan pembayaran");
					setToken('')
				}
			})
			setFormData({
				...formData,
				order_id: '',
				gross_amount: 0,
			})
		}
		// ! akan aktif kalau state token ada perubahan, misalnya: ada token
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token])

	useEffect(() => {
		const midTransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

		const scriptTag = document.createElement("script")

		scriptTag.src = midTransUrl;

		scriptTag.setAttribute("data-client-key", import.meta.env.VITE_CLIENT_KEY);

		document.body.appendChild(scriptTag);

		return () => {
			document.body.removeChild(scriptTag);
		}


	}, [])

	return (
		<section className='max-w-sm mx-auto mt-10 grid grid-cols-2'>
			{isLoading ? (
				<Loading />
			) : order ? (
				<>
					<p>{order?.deliveryMethod}</p>
					<p className='text-end'>{order?.invoiceNumber}</p>
					<p  >{order?.totalAmount}</p>
					<p className='text-end'>{order?.shippingAddress}</p>
					<Button className=' col-span-2 mt-2' onClick={payOrder}>pay</Button>
				</>
			) : (
				<p>gaada ordernya puh</p>
			)}
		</section>
	);
};

export default Payment;
