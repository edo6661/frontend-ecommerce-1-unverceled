import axios from '../../config/axiosCredentials';
import { Link } from 'react-router-dom';
import { OrderDocument } from '../../type';
import upperFirst from '../../helpers/upperFirst';
import { toast } from 'react-toastify'
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
	reviews, setOrders
}: OrderDocument) => {


	const handleDelete = async (id: string) => {
		try {
			await axios.delete(`/order/${id}`)
			setOrders((prev) => prev.filter((order) => order._id !== id))
			toast.success('sukses delete order puh')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<div className='flex flex-col gap-4'>

				<article className="flex justify-center gap-8">
					{products.map((product) => {
						// ! untuk memeriksa apakah pengguna sudah memberikan ulasan untuk produk , kalau sudah maka tidak usah ditampilkan apa apa , kalau belum review maka ada teks give review
						if (product.productId) {
							const hasReviewed = reviews?.some(
								(review) => review.productId == product.productId._id
							);
							return (
								<div
									key={product.productId._id}
									className="text-center flex flex-col"
								>
									<img
										className=" object-cover w-44 h-44 rounded-xl"
										src={product.productId.photo[0]}
										alt=""
									/>
									<h4 className='mt-4'>{upperFirst(product.productId.name)}</h4>
									{status === 'Processing' && !hasReviewed ? (
										<Button className='mt-2' size='lg'>
											<Link to={`/dashboard/review/${product.productId._id}`}>Give Review</Link>

										</Button>
									) : null}
								</div>
							);
						}
					})}
				</article>
				<article className="mx-auto max-w-3xl translate-x-6">
					<div className="grid grid-cols-2 gap-x-12">
						<p>Total Price</p>
						<p> {totalAmount}</p>
						<p> Status</p>
						<p> {status}</p>
						<p> Delivery</p>
						<p> {deliveryMethod}</p>
						<p> Address</p>
						<p> {shippingAddress}</p>
						<p> Invoice</p>
						<p> {invoiceNumber}</p>
						{status == 'Pending' ? (
							<Button className=' col-span-2 primaryColor py-2 px-3 rounded-t-xl  mt-4' rounded='txl'>
								<Link to={`/dashboard/pay/${_id}`}>Pay</Link>
							</Button>
						) : status == 'Processing' ? (
							null
						) : status == 'Shipped' ? (
							<p className=''>Shipped</p>
						) : status == 'Delivered' ? (
							<p className=''>Delivered</p>
						) : null}
						<Button className={` col-span-2 ${status == 'Pending' ? 'rounded-b-xl' : 'rounded-xl mt-4'} `} rounded='none' onClick={() => handleDelete(_id)}>Delete</Button>

					</div>
				</article>
			</div>

		</>
	);
};

export default SingleOrder;
