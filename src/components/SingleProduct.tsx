/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { BsStarFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { GiPriceTag } from 'react-icons/gi';
import { ImFileEmpty } from 'react-icons/im';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { SiTypescript } from 'react-icons/si';
import { toast } from 'react-toastify';
import axios from '../config/axiosCredentials';
import { deliveryOptions } from '../config/options';
import upperFirst from '../helpers/upperFirst';
import useAuth from '../hooks/useAuth';
import { Products } from '../type';
import Reviews from './Reviews';
import Button from './style/Button';
import ProductElement from './utils/ProductsElement';


const SingleProduct = ({
	_id,
	brand,
	category,
	// description,
	name,
	photo,
	price,
	quantity,
	userId,
	buyers,
}: Products) => {
	const { addToCart, user, navigate, setOrdersChanged } = useAuth();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [imgClicked, setImgClicked] = useState(false);

	const [form, setForm] = useState({
		productId: _id,
		quantity: 1,
		totalAmount: 0,
		shippingAddress: user?.address || '',
		deliveryMethod: '',
	});
	const [submit, setSubmit] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!user) return navigate('login');
		if (user.roles !== 'user')
			return toast.info('hanya user yang bisa checkout puh');

		try {
			await axios.post('/orders', form);
			toast.success('berhasil checkout');
			setOrdersChanged(true);
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

	// useEffect(() => {
	// 	if (quantity === 0) toast.error('quantity product tidak tersedia');
	// }, []);

	useEffect(() => {
		if (form.quantity > quantity && quantity !== 0)
			toast.error('quantity produk tidak boleh melebihi quantity nya puh');
	}, [form.quantity]);

	if (form.quantity < 1)
		toast.error('quantity produk tidak boleh kurang dari 1 puh ');

	const { shippingAddress, deliveryMethod, quantity: qty } = form;

	const canSubmit = [qty, deliveryMethod.length, shippingAddress.length].every(
		Boolean
	);

	useEffect(() => {
		setForm({ ...form, totalAmount: qty * price });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qty]);

	const validateBuy = () => {
		if (!user) {
			toast.info('login dulu puh');
			return navigate('login');
		}
		if (user.roles === 'user') {
			setForm({ ...form, quantity: form.quantity });
			setSubmit((prev) => !prev);
		} else {
			return toast.info('yang bisa checkout hanya user puh');
		}
	};

	const elementCheckout = (
		<div className=" rounded-xl p-4 py-6">
			<div className="mx-4 flex flex-col gap-4 items-center">
				{!submit && <h4 className='font-montserrat font-semibold text-lg'>Set Amount</h4>
				}
				<div className="flex gap-6 items-center">
					<form
						action=""
						onSubmit={handleSubmit}
						className={`flex flex-col ${submit && 'justify-center'}`}
					>
						{!submit && (
							<input
								type="number"
								className="w-20 py-2 px-4 rounded-xl"
								min={1}
								max={quantity}
								required
								name="quantity"
								onChange={handleInputChange}
								value={qty}
							/>
						)}
						{submit && (
							<>
								<input
									className=" rounded-t-xl px-2 py-1"
									type="text"
									required
									name="shippingAddress"
									placeholder="shippingAddress..."
									autoComplete="current-address"
									onChange={handleInputChange}
									value={shippingAddress}
								/>
								<select
									name="deliveryMethod"
									className="px-2 py-1 rounded-b-xl"
									onChange={handleInputChange}
									value={deliveryMethod}
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

								{submit && (
									<Button
										className="mt-4"
										rounded="txl"
										type="submit"
										disabled={!canSubmit}
									>
										Submit
									</Button>
								)}
								{submit && (
									<Button
										rounded="bxl"
										onClick={() => setSubmit((prev) => !prev)}
									>
										Cancel
									</Button>
								)}
							</>
						)}
					</form>
					{!submit && <p className=" font-bold text-red-600">{quantity} Left</p>}
				</div>
				<div className="flex flex-col gap-4 my-4">
					{!submit && (
						<>
							<Button onClick={() => addToCart?.(_id as string, qty)}>
								Add to cart
							</Button>
							<Button onClick={() => validateBuy()}>Buy now</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);

	const elementProduct = (
		<>
			<ProductElement icon={<BsStarFill />}>

				{upperFirst(name)}
			</ProductElement>
			<ProductElement icon={<GiPriceTag />}> ${price} </ProductElement>
			<ProductElement icon={<MdProductionQuantityLimits />}>
				<span className=" relative">
					{buyers}
					<span className="absolute sm:left-4 left-5 sm:ml-2 text-slate-400 ">

						Bought
					</span>
				</span>
			</ProductElement>
			<ProductElement icon={<CgProfile />}>
				{userId
					? upperFirst(userId?.username || '')
					: 'Anonimus anjay mabar bang'}
			</ProductElement>
			<ProductElement icon={<FaReact />}> {upperFirst(brand)} </ProductElement>
			<ProductElement icon={<SiTypescript />}>
				{upperFirst(category)}
			</ProductElement>
			{quantity === 0 &&
				<ProductElement icon={<ImFileEmpty />}>
					<p className='text-red-400 text-xl '>Empty</p>
				</ProductElement>
			}
		</>
	);

	const handleNext = () => {
		if (currentIndex == photo.length - 1) {
			return setCurrentIndex(0)
		}
		setCurrentIndex(prev => prev + 1)
		setImgClicked(true);

		setTimeout(() => setImgClicked(false), 500);

	}
	const handlePrev = () => {
		if (currentIndex == 0) return setCurrentIndex(photo.length - 1)
		setCurrentIndex(prev => prev - 1)
		setImgClicked(true);

		setTimeout(() => setImgClicked(false), 500);
	}


	// const [showDesc, setShowDesc] = useState(false)
	return (
		<>
			<section className="flex flex-col mt-12">
				<div className="flex gap-20 sm:justify-between justify-center">
					<div className="">
						<div className='flex justify-between mt-1 relative'>
							{photo.length > 1 && (
								<>
									<button className='absolute -top-11 z-10 disabled:opacity-60 right-0 ' onClick={handleNext} disabled={imgClicked}><BiSkipNext size={40} /></button>
									<button className='absolute -top-11 z-10 disabled:opacity-60  ' onClick={handlePrev} disabled={imgClicked}><BiSkipPrevious size={40} /></button>
								</>
							)}
						</div>
						{photo.map((p, i) => (
							<img
								key={i}
								src={p}
								className={`md:w-96 w-80 h-full object-cover rounded-t-xl ${i != currentIndex && 'hidden'} ${imgClicked && ' ease-in-out duration-500 opacity-80'} `}
								alt=""
								id={currentIndex.toString()}
							/>
						))}
						{/* <img
							src={photo[currentIndex]}
							className="md:w-96 w-80 h-full object-cover rounded-t-xl"
							alt=""
							id={currentIndex.toString()}
						/> */}
					</div>
					<div
						className={`flex-col gap-4 text-xl ${user?.roles === 'user' && 'flex-1'
							} my-8 sm:flex hidden`}
					>
						{elementProduct}
					</div>
					<div className="py-8 px-4 hidden lg:block ">
						{/* {quantity !== 0 && user?.roles == 'user' && elementCheckout} */}
						{quantity !== 0 && elementCheckout}
					</div>
				</div>

				{photo.length > 0 && (
					<div className="flex md:max-w-sm max-w-[20rem] sm:m-0 mx-auto  ">
						{photo.slice(1).map((p) => {
							const width =
								photo.length === 3
									? 'w-1/2'
									: photo.length === 4
										? 'w-1/3'
										: photo.length === 5
											? 'w-1/4'
											: photo.length === 6
												? 'w-1/5'
												: 'w-full';
							return (
								<img
									key={p}
									className={` ${width} object-cover max-h-44 z-10`}
									alt=""
									src={p}
								/>
							);
						})}
					</div>
				)}

				<div className="flex-col gap-4 text-2xl py-8 sm:hidden flex self-center my-4 ">
					{elementProduct}
				</div>

				{quantity !== 0 && user?.roles == 'user' && (
					<div className=" my-6 lg:hidden">
						<div className="mb-8">
							<div className="mx-4 flex gap-4 items-center justify-evenly">
								<div className="flex flex-col gap-4">
									<h4 className='font-montserrat font-semibold text-lg'>Set Amount</h4>
									<div className="flex flex-col gap-4 items-center">
										<input
											type="number"
											className="w-20 py-2 px-4 rounded-xl"
											min={1}
											max={quantity}
										/>
										<p className=" font-bold text-red-600">{quantity} Left</p>
									</div>
								</div>
								<div className="flex flex-col gap-4 my-4">
									<Button onClick={() => addToCart?.(_id as string)}>
										Add to cart
									</Button>
									<Button>Buy now</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				<hr className="mx-auto w-full primaryColor my-8" />
			</section>

			<Reviews />
		</>
	);
};

export default SingleProduct;
