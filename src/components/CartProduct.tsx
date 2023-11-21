/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai';
import {
	RiCheckboxBlankCircleFill,
	RiCheckboxCircleFill,
	RiDeleteBin4Line,
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import axios from './../config/axiosCredentials';
import { CartItem } from '../type';
import upperFirst from '../helpers/upperFirst';
const CartProduct = ({ isChecked, productId, quantity, getCart }: CartItem) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { _id, name, photo, price } = productId;
	const [checked, setChecked] = useState<boolean | undefined>(isChecked);
	const [total, setTotal] = useState<number>(quantity * price);
	const [controlQuantity, setControlQuantity] = useState<number>(quantity);

	const decrementQuantity = async () => {
		try {
			setLoading(true);
			await axios.patch(`/carts/dec/${_id}`);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const incrementQuantity = async () => {
		try {
			setLoading(true);
			await axios.patch(`/carts/inc/${_id}`);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const updateChecked = async () => {
		try {
			setLoading(true);
			setChecked(!checked);
			const res = await axios.patch(`/cart/${_id}`, {
				checked,
			});
			console.log(res)
			getCart();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const deleteProduct = async () => {
		if (checked) {
			return toast.error('gabisa delete item yang lagi di select puh');
		}
		try {
			await axios.delete(`/cart/${_id}`);
			getCart();
			toast.success(`success deleted ${name} `);
		} catch (error) {
			console.error(error);
		}
	};

	const handleIncrement = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (controlQuantity >= productId?.quantity) {
			toast.error(
				'quantity gaboleh lebih bisa dari product quantity yang di sediakan seller'
			);
			return setControlQuantity(productId?.quantity);
		}
		setControlQuantity(controlQuantity + 1);
		await incrementQuantity();
		getCart();
	};

	const handleDecrement = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (controlQuantity > 1) {
			setControlQuantity(controlQuantity - 1);
			await decrementQuantity();
			getCart();
		} else {
			toast.error('quantity ga boleh lebih dari 1 puh');
		}
	};

	useEffect(() => {
		setTotal(controlQuantity * price);
	}, [controlQuantity]);

	return (
		<>

			<Link
				to={`/product/${_id}`}
				className=" justify-self-center col-span-2 mx-auto my-8 md:my-0 "
			>

				<img
					className="self-center object-cover md:h-32 md:w-32 md:rounded-full w-60 h-60 rounded-xl "
					alt=""
					src={photo[0]}
				/>
			</Link>
			<p className='md:hidden block'>Name</p>
			<p className='md:hidden block'>Quantity</p>
			<div className="md:my-auto mb-4 mt-2">
				<p>{upperFirst(name)}</p>
			</div>
			<div className="flex md:my-auto gap-3 justify-center  mb-4 mt-2">

				<button
					onClick={handleIncrement}
					disabled={loading}
				>
					<AiFillPlusCircle size={20} />
				</button>
				<span className='md:my-auto'>{controlQuantity}</span>
				<button
					onClick={handleDecrement}
					disabled={loading}
				>
					<AiFillMinusCircle size={20} />
				</button>
			</div>
			<p className='md:hidden block' >Checked</p>
			<p className='md:hidden block'>Harga Satuan</p>
			<button
				className="self-center mx-auto md:my-auto mb-4 mt-2"
				onClick={() => {
					updateChecked();
				}}
				disabled={loading}
			>
				{checked ? <RiCheckboxCircleFill size={20} /> : <RiCheckboxBlankCircleFill size={20} />}
			</button>
			<div className=" md:my-auto mb-4 mt-2">
				<p> {price}</p>
			</div>
			<p className='md:hidden block'>Harga Total</p>
			<p className='md:hidden block'>Delete</p>
			<div className=" md:my-auto mb-4 mt-2">
				<p> {total}</p>
			</div>
			<button
				className="self-center mx-auto md:my-auto mb-4 mt-2"
				onClick={deleteProduct}
			>
				<RiDeleteBin4Line size={20} />
			</button>
		</>
	);
};

export default CartProduct;
