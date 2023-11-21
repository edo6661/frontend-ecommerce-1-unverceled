/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import CartProduct from '../../components/CartProduct';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CartItem } from '../../type';
import Button from '../../components/style/Button';
const Cart = () => {
	const { cart, getCart, showNoCart, checkout, setCheckout } = useAuth();
	useEffect(() => {
		getCart();
	}, []);

	//! Saat komponen Cart pertama kali dirender atau setiap kali cart.items berubah,
	//! kita periksa apakah ada setidaknya satu item yang dicentang.
	useEffect(() => {
		if (cart?.items?.some((item: { isChecked: boolean; }) => item.isChecked)) {
			setCheckout?.(true);
		} else {
			setCheckout?.(false);
		}
	}, [cart?.items]);

	return (
		<>
			<section
				className="my-10"
			>
				<article className="grid grid-cols-2 md:grid-cols-8 text-center md:gap-x-4  md:gap-y-12 mx-auto">
					{cart && cart.items.length ? (
						<>
							<p className=' md:col-span-2 hidden md:block'>Product</p>
							<p className='hidden md:block'>Name</p>
							<p className='hidden md:block'>Quantity </p>
							<p className='hidden md:block'>Check </p>
							<p className='hidden md:block'>Harga Satuan </p>
							<p className='hidden md:block'>Total Harga </p>
							<p className='hidden md:block'>Delete </p>
						</>
					) : null}

					{cart?.items?.length
						? cart.items.map((item: CartItem) => (
							<CartProduct
								{...item}
								getCart={getCart}
								key={item._id}
							/>

							// eslint-disable-next-line no-mixed-spaces-and-tabs
						))
						: showNoCart && <h3 className='text-center text-slate-500 text-xl col-span-full'>No Cart...</h3>}
					<div className=" md:col-span-2 md:flex md:flex-col gap-3 md:justify-self-center my-12 mx-auto md:static fixed bottom-0">
						{checkout ? (
							<>
								<Button className='mx-auto' size='lg'>
									<Link to="/dashboard/order">Checkout</Link>
								</Button>
								<p>Total: {cart?.totalPrice}</p>
							</>
						) : null}
					</div>
				</article>
			</section>
		</>
	);
};

export default Cart;
