import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { FaStar } from 'react-icons/fa';
import axios from './../../config/axiosCredentials';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import Button from '../../components/style/Button';
const CreateReview = () => {
	const { id } = useParams();
	const { fetchProductById, product, navigate, setProductChanged, setOrdersChanged, setReviewChanged } = useAuth();

	const [data, setData] = useState({
		rating: 0,
		comment: '',
	});
	console.log(product)

	const [hover, setHover] = useState<number | null>(null);

	const ratingChange = (currentRating: number) => {
		setData({
			...data,
			rating: currentRating,
		});
	};

	const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setData({
			...data,
			[name]: value,
		});
	};

	useEffect(() => {
		if (id) fetchProductById(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { rating, comment } = data;

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.post(`/product/${id}/review`, data);
			setProductChanged(true)
			setOrdersChanged(true)
			setReviewChanged(true)
			navigate(`/product/${id}`);
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			toast.error(axiosError?.response?.data.message);
		}
	};
	return (
		<section className="flex gap-4 flex-col items-center mt-8">
			<div className="flex flex-col gap-2">
				<img
					className=" object-cover w-48 h-48 rounded-full"
					src={product?.photo[0]}
					alt=""
				/>
			</div>
			<form
				action=""
				className="flex flex-col gap-4"
				onSubmit={handleSubmit}
			>
				<div className="flex mx-auto gap-1">
					{[...Array(5)].map((_, index) => {
						// ! index + 1;: Ini adalah perhitungan untuk menghasilkan nilai peringkat saat ini. Indeks dimulai dari 0, sehingga kita menambahkan 1 untuk mendapatkan peringkat yang benar (1 sampai 5).
						const currentRating = index + 1;
						return (
							<label
								htmlFor={`rating-${currentRating}`}
								key={index}
							>
								<input
									type="radio"
									// ! Setiap elemen input radio memiliki ID unik berdasarkan nilai currentRating dan memiliki value yang sama dengan nilai peringkat saat ini. Saat elemen ini diklik, fungsi inputChange akan dipanggil.
									id={`rating-${currentRating}`}
									name="rating"
									className="hidden"
									value={currentRating}
									onClick={() => ratingChange(currentRating)}
								/>
								<FaStar
									size={30}
									color={
										currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'
									}
									className="cursor-pointer"
									onMouseEnter={() => setHover(currentRating)}
									onMouseLeave={() => setHover(null)}
								/>
								<p className='text-center'>{currentRating}</p>
							</label>
						);
					})}
				</div>
				<input
					type="text"
					name="comment"
					onChange={inputChange}
					value={comment}
					placeholder='Comment...'
					className='rounded-xl'
				/>
				<Button>Submit</Button>
			</form>
		</section>
	);
};

export default CreateReview;
