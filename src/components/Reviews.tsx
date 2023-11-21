import Review from './Review';
import useAuth from '../hooks/useAuth';

const Reviews = () => {

	const { reviews, isLoading } = useAuth()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return (
		<section className=' flex flex-col gap-8 mt-8'>
			{reviews?.length ? <h4 className='text-center text-xl font-semibold'>Reviews</h4> : ''}
			<div className='grid sm:grid-cols-4 grid-cols-2 items-center gap-8 '>
				{isLoading ? (
					null
				) : reviews?.length ? (
					reviews.map((review) => (
						<Review
							key={review._id}
							{...review}
							reviews={reviews}
						/>
					))
				) : (
					<h5 className='text-lg sm:text-xl text-center text-slate-400 col-span-full'>No Reviews Yet</h5>
				)}
			</div>
		</section>

	);
};

export default Reviews;
