import { Products } from '../type';
import { useState } from 'react';
import upperFirst from '../helpers/upperFirst';
import { BsStarFill } from 'react-icons/bs';
import { GiPriceTag } from 'react-icons/gi';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { FaReact } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import EditProduct from '../pages/private/EditProduct';
import Button from './style/Button';
const SellerProduct = ({
	product,
	brand,
	category,
	// description,
	name,
	photo,
	price,
	quantity
}: Products) => {

	const [edit, setEdit] = useState(false);

	const handleEdit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setEdit((prev) => !prev);
	};


	return (
		<>
			{edit ? (
				<>
					<EditProduct setEdit={setEdit} product={product} />
				</>
			) : (
				<>
					<div className='my-4'>
						<img
							className=" self-center object-cover w-56 rounded-xl"
							alt=""
							src={photo[0]}
						/>
					</div >
					<div className='flex flex-col'>
						<div className='relative mb-2'>
							<span className='absolute -left-4 top-1'><BsStarFill /></span>
							<div className="ml-2 font-semibold text-lg">
								<p className=''>{upperFirst(name)}</p>
							</div>
						</div>
						{/* <div className='relative text-start'>
							<span className='absolute -left-4 top-1'><MdDescription /></span>
							<div className="ml-2">
								<p className=''>{upperFirst(description)}asddddddddddddddddddddsadasdasd</p>
							</div>
						</div> */}
						<div className='relative mb-2'>
							<span className='absolute inset-0 -left-4 top-1'><FaReact /></span>
							<div className=" ml-2">
								<p>{upperFirst(brand)}</p>
							</div>
						</div>
						<div className='relative mb-2'>
							<span className='absolute inset-0 -left-4 top-1'><SiTypescript /></span>
							<div className=" ml-2">
								<p>{upperFirst(category)}</p>
							</div>
						</div>
						<div className='relative mb-2'>
							<span className='absolute inset-0 -left-4 top-1'><GiPriceTag /></span>
							<div className="ml-2">
								<p className=''>${price}</p>
							</div>
						</div>
						<div className='relative mb-2'>
							<span className='absolute inset-0 -left-4 top-1'><MdProductionQuantityLimits /></span>
							<div className="ml-2">
								<p className=' font-bold'>{quantity}</p>
							</div>
						</div>
						<Button disabled={edit} onClick={handleEdit}>{!edit && 'Edit'}</Button>

					</div>
				</>
			)}
		</>
	);
};

export default SellerProduct;
