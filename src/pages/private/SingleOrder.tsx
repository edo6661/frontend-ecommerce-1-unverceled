import axios from '../../config/axiosCredentials';
import { Link } from 'react-router-dom';
import { OrderDocument } from '../../type';
import upperFirst from '../../helpers/upperFirst';
import { toast } from 'react-toastify';
import Button from '../../components/style/Button';
const SingleOrder = ({
	_id,
	products,
	totalAmount,
	status,
	deliveryMethod,
	shippingAddress,
	invoiceNumber,
	// createdAt,
	reviews,
	setOrders,
}: OrderDocument) => {
	const handleDelete = async (id: string) => {
		try {
			await axios.delete(`/order/${id}`);
			setOrders((prev) => prev.filter((order) => order._id !== id));
			toast.success('sukses delete order puh');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<article className="">
				<div className={`grid grid-cols-2 gap-y-4 } `}>
					{products.map((product, i) => {
						// ! untuk memeriksa apakah pengguna sudah memberikan ulasan untuk produk , kalau sudah maka tidak usah ditampilkan apa apa , kalau belum review maka ada teks give review
						if (product.productId) {
							// const hasReviewed = reviews?.some(
							// 	(review) => review.productId == product.productId._id
							// );
							// ! nyari array terakhir
							const isLastItem = i === products.length - 1;
							// ! kalau products.length nya genap
							const isEven = products.length % 2 === 0;

							return (
								<div
									key={product.productId._id}
									className={`${isLastItem && !isEven ? ' col-span-2' : ''
										} flex flex-col justify-center`}
								>
									<>
										<div className="flex flex-col text-center">
											<Link to={`/product/${product.productId._id}`}>
												<p className="mt-2">
													{upperFirst(product.productId.name)}
												</p>
												{/* ! munculin 2 foto */}
												{/* {i < 2 && (
														<img className='rounded-full w-32 h-32 object-cover mx-auto my-2' src={product.productId.photo} alt="" />
													)} */}
												<img
													className="rounded-full w-32 h-32 object-cover mx-auto my-2"
													src={product.productId.photo}
													alt=""
												/>
											</Link>
										</div>
									</>
								</div>
							);
						}
					})}
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex justify-between">
						<div>
							<p>Total Price</p>
						</div>
						<div>
							<p> {totalAmount}</p>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<p>Status</p>
						</div>
						<div>
							<p> {status}</p>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<p>Delivery</p>
						</div>
						<div>
							<p> {deliveryMethod}</p>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<p>Address</p>
						</div>
						<div>
							<p> {shippingAddress}</p>
						</div>
					</div>
					<div className="flex justify-between">
						<div>
							<p>Invoice</p>
						</div>
						<div>
							<p> {invoiceNumber}</p>
						</div>
					</div>
					<div className={`grid grid-cols-2 mt-2`}>
						{status == 'Pending' ? (
							<Button rounded="none">
								<Link to={`/dashboard/pay/${_id}`}>Pay</Link>
							</Button>
						) : status == 'Processing' ? null : status == 'Shipped' ? (
							<p className="">Shipped</p>
						) : status == 'Delivered' ? (
							<p className="">Delivered</p>
						) : null}
						{status !== 'Pending' &&
							products.map((product) => {
								if (product.productId) {
									const hasReviewed = reviews?.some(
										(review) => review.productId == product.productId._id
									);

									const { name } = product.productId;

									return (
										status === 'Processing' && !hasReviewed ? (
											<Button
												rounded="none"
												size="lg"
												key={product.productId._id}
											>
												<Link
													to={`/dashboard/review/${product.productId._id}`}
												>
													Give Review{' '}
													<span className="text-slate-400 font-semibold">
														{name.length > 8
															? `${name.charAt(0).toUpperCase() +
															name.slice(1, 8)
															}...`
															: name.charAt(0).toUpperCase() + name.slice(1)}
													</span>
												</Link>
											</Button>
										) : (
											<Button
												rounded="none"
												key={product.productId._id}
											>
												<Link
													to={`/dashboard/reviewDetails/${product.productId._id}`}
												>
													Detail{' '}
													<span className="text-slate-400 font-semibold">
														{name.length > 8
															? `${name.charAt(0).toUpperCase() +
															name.slice(1, 8)
															}...`
															: name.charAt(0).toUpperCase() + name.slice(1)}
													</span>
												</Link>
											</Button>
										)
									);
								}
							})}
						<Button
							rounded="none"
							onClick={() => handleDelete(_id)}
						>
							Delete
						</Button>
					</div>
				</div>
			</article>
		</>
	);
};

export default SingleOrder;
