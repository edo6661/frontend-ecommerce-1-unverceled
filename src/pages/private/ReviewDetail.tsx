import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import upperFirst from "../../helpers/upperFirst";
const ReviewDetail = () => {
    const { id } = useParams();
    const { reviewDetail, reviewDetailChanged, setReviewDetailChanged, reviewDetails } = useAuth()

    useEffect(() => {
        if (reviewDetailChanged && id) {
            reviewDetail?.(id);
            setReviewDetailChanged(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewDetailChanged])


    const renderRatingStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <FaStar
                key={index}
                size={20}
                color={index < rating ? '#ffc107' : '#e4e5e9'}
            />
        ));
    };

    console.log(reviewDetails)
    return (

        reviewDetails?.map((review) =>
            <section key={review._id}>
                <div className='flex flex-col gap-2 items-center'>
                    <img src={review.productId.photo[0]} alt="" className=" rounded-full w-56 h-56" />
                    <h3 className="mt-2">{upperFirst(review.productId.name)}</h3>
                    <div className="flex">{renderRatingStars(review.rating)}</div>
                    <p>{review.comment}</p>
                </div>

            </section>
        )

    )
}

export default ReviewDetail