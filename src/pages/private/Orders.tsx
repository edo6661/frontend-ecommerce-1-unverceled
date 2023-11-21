/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import SingleOrder from './SingleOrder';
import Loading from '../../components/Loading';
const Orders = () => {
	const { getOrders, orders, showNoOrders, setOrders, isLoading, setOrdersChanged, ordersChanged, review, getReviewByUser } = useAuth();

	useEffect(() => {
		if (ordersChanged) {
			getOrders();
			getReviewByUser();
			setOrdersChanged(false)
		}
	}, [ordersChanged]);
	if (isLoading) return <Loading />
	return (
		<>
			<section className='grid grid-cols-2 gap-8'>
				{orders.length
					? orders
						.sort((a, b) => {
							const aIsProcessing = a.status === 'Processing';
							const bIsProcessing = b.status === 'Processing';
							const aHasReviewed = a.products.some((product: { productId: { _id: string; }; }) =>
								review?.some((review) => review.productId === product.productId._id)
							);
							const bHasReviewed = b.products.some((product: { productId: { _id: string; }; }) =>
								review?.some((review) => review.productId === product.productId._id)
							);
							if (aIsProcessing !== bIsProcessing) {
								return aIsProcessing ? -1 : 1;
							}
							return aHasReviewed === bHasReviewed ? 0 : aHasReviewed ? 1 : -1;
						})
						.map((order) => (
							<SingleOrder
								key={order._id}
								{...order}
								reviews={review}
								setOrders={setOrders}
							/>
						))
					: showNoOrders && <h3 className='text-center text-slate-400 text-xl'>masih belum ada order puh</h3>}


			</section>
		</>
	);
};

export default Orders;
