import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import SingleProduct from '../../components/SingleProduct';
import Button from '../../components/style/Button';
import useAuth from '../../hooks/useAuth';
import { Review } from '../../type';
import EditProduct from '../private/EditProduct';

const Product = () => {
	const { isLoading, user, fetchProductById, product, getReview, reviews, setReviews, edit, setEdit } = useAuth();

	const { id } = useParams();

	function countUniqueBuyers(purchases: Review[], productId: string): number {
		const buyers = purchases
			// ! mengambil semua objek pembelian (Review) yang memiliki productId yang sama dengan productId
			.filter(purchase => purchase.productId === productId)
			// ! mengambil semua userId dari objek pembelian yang telah difilter
			.map(purchase => purchase.userId);
		// ! isinya adalah productId yang dibeli user
		return buyers.length
	}
	const buyers = useRef(0);

	useEffect(() => {
		if (id) {
			fetchProductById(id);
			setReviews?.([])
			getReview?.(id)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (reviews) {
		buyers.current = (countUniqueBuyers(reviews, id || ''));
	}




	if (isLoading) {
		return <Loading />

	} else {
		return (
			<>
				{!edit ? (
					product && product !== undefined ? (
						<SingleProduct {...product} buyers={buyers.current} />
					) : (
						setTimeout(() => {
							<p>gaada product dengan id itu puh</p>;
						}, 2000)
					)
				) : (
					product?.userId && <EditProduct product={product} />
				)}
				{(user?.roles === 'owner' ||
					product?.userId?.email === user?.email) && !edit && !isLoading && 	(
						<Button onClick={() => setEdit(!edit)} className='mt-4' size='lg'>
							Edit
						</Button>
					)}
			</>
		);
	}
};

export default Product;
