/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';
import Products from './Products';
import images from './utils/Images';
const Hero = () => {
	const { setSearch, setModeNav, isLoading, products, fetchProducts, getCart, user, page, setPageCount, dataPromise, search, category, brand, setBrand, setCategory, modeNav, showProducts } =
		useAuth();



	useEffect(() => {
		if (dataPromise) setPageCount(dataPromise.pagination.pageCount)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataPromise])


	if (page < 0) toast.error('page gaboleh lebih kecil dari 0 puh')


	useEffect(() => {
		if (user?.roles === 'user') {
			getCart();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		fetchProducts?.();
	}, [page, search, category, brand])

	useEffect(() => {
		if (category === '') {
			setCategory("");
		}
	}, [category]);

	useEffect(() => {
		if (brand === '') {
			setBrand("");
		}
	}, [brand]);



	const searchInputWithContainer = (
		<div className='flex mt-12 nav rounded-lg'>
			<input
				type="text"
				className='py-4 px-2 border primaryColor border-slate-500 rounded-xl placeholder:ml-3 text-black text-xl text-md focus:outline-none focus:border-slate-700 transition-all duration-300 flex-grow hidden sm:block '
				name="search"
				id="search"
				onChange={(e) => setSearch(e.target.value)}
				value={search}
				placeholder='Search...'
			/>
		</div>
	)

	const autoScrollerImages = (
		<div className="scroller my-20" data-direction="" data-speed="fast">
			<div className="scroller__inner">
				{images.concat(images, images).map((image, index) =>
					<img
						className="slider__image grayscale"
						src={image.img} key={index}
						aria-hidden={(index >= images.length) ? true : undefined} />
				)}
			</div>
		</div>
	)

	if (!isLoading && !products?.length) {
		return (
			<section className=' min-h-screen mb-12'>
				{searchInputWithContainer}
				{showProducts && (
					<h3 className='text-center my-12 text-2xl'>Product empty puh</h3>
				)}
				{autoScrollerImages}
			</section>
		)
	}

	return (
		<>
			<section className='mb-12'>
				{searchInputWithContainer}
				{isLoading && (
					<div className="mx-auto flex items-center justify-center">
						<Loading />
					</div>
				)}
			</section>

			{products?.length ? (
				<section className={`container-products ${modeNav && ' blur-md z-0 sm:blur-none'} my-20`} onClick={() => setModeNav(false)}>
					{
						// ! random
						// [...products].sort(() => Math.random() - 0.5).map((product) => {
						products.map((product) => {
							return (
								<Products
									{...product}
									key={product._id}
								/>
							);
						})
					}

				</section>
			) : (
				<p>product eweuh</p>
			)}
			{autoScrollerImages}

		</>
	);
};

export default Hero;
