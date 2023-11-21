import { BsFillCartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Products } from '../type';
/* eslint-disable @typescript-eslint/no-unused-vars */
const Products = ({
	_id,
	// createdAt,
	name,
	photo, price
}: // updatedAt,
	Products) => {
	const { addToCart, user } = useAuth();
	return (
		<>
			{/*  hover:border-4 hover:border-solid hover:border-[#F9F9FB] */}
			{/*  hover:outline-[#F9F9FB] hover:outline-2 hover:opacity-80 hover:outline-double */}
			<div className="flex flex-col w-fit sm:mx-0 mx-auto hover:opacity-80">
				<Link
					to={`/product/${_id}`}
					className="glow-effect"
					data-glow-animation="false"
				>
					<svg className="glow-container">
						<rect pathLength="100" strokeLinecap="round" className="glow-blur"></rect>
						<rect pathLength="100" strokeLinecap="round" className="glow-line"></rect>
					</svg>

					<img
						className=" w-56 h-52 object-cover rounded-t-lg"
						src={photo[0]}
						alt=""
					/>
				</Link>
				<article className='flex justify-between text-xl py-2 mx-1 bg-black'>
					<p className=' text-[#F9F9FB]'>{name.length > 12 ? `${name.charAt(0).toUpperCase() + name.slice(1, 12)}...` : name.charAt(0).toUpperCase() + name.slice(1)}</p>
					<div className='flex gap-2'>
						<p className=' text-stone-400'>${price}</p>
						{user?.roles === "user" && <button
							className="self-center"
							onClick={() => addToCart?.(_id as string)}
						>
							<BsFillCartFill />
						</button>}
					</div>
				</article>
			</div>
		</>
	);
};

export default Products;
