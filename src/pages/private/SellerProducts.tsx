import { useEffect } from 'react';
import Loading from '../../components/Loading';
import SellerProduct from '../../components/SellerProduct';
import axios from '../../config/axiosCredentials';
import useAuth from '../../hooks/useAuth';

const SellerProducts = () => {
	const { isLoading, setIsLoading, sellerProductChanged, setSellerProductChanged, sellerProducts, setSellerProducts } = useAuth();

	const getSellerProducts = async () => {
		try {
			setIsLoading?.(true);
			const { data } = await axios.get('product');
			setSellerProducts?.(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading?.(false);
		}
	};

	useEffect(() => {
		if (sellerProductChanged) {
			getSellerProducts();
			setSellerProductChanged(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sellerProductChanged]);


	return (
		<>
			{sellerProducts?.length ? (
				<section className="grid sm:grid-cols-2 gap-x-12 gap-y-12 mt-8 ">
					{isLoading ? (
						<Loading />
					) : (
						sellerProducts.map((product, i) => {
							return (
								<article
									className={`flex flex-col justify-self-center`}
									key={product._id}
								>
									{/* {edit ? <p>edit mode</p> : <SellerProduct {...product} />} */}
									<SellerProduct
										{...product}
										product={product}
										i={i}
									/>
								</article>
							);
						})
					)}

				</section>
			) : <h4 className='text-center text-xl font-semibold '>saat ini belum punya product puh</h4>}
		</>
	);
};

export default SellerProducts;
