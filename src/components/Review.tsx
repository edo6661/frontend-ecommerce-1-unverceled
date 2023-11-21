import { FaStar } from 'react-icons/fa';
import { Review } from '../type';
import upperFirst from '../helpers/upperFirst';

const Review = ({ comment, rating, userId, reviews }: Review) => {
	const { username } = userId;

	const renderRatingStars = (rating: number) => {
		return Array.from({ length: 5 }).map((_, index) => (
			<FaStar
				key={index}
				size={20}
				color={index < rating ? '#ffc107' : '#e4e5e9'}
			/>
		));
	};

	return (
		<>
			{
				reviews.length > 0 && (
					<div className='flex flex-col gap-2 items-center'>
						<p>{upperFirst(username || '')}</p>
						<div className="flex">{renderRatingStars(rating)}</div>
						<p>{comment}</p>
					</div>
				)
			}
		</>
	);
};

export default Review;
