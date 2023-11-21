import { useState, useRef } from 'react';
import axios from './../../config/axiosCredentials';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import app from '../../config/firebase';
import { Product } from '../../type';
import { AiFillDelete } from 'react-icons/ai';
import useWindowWidth from '../../hooks/useMediaQuery';
import Button from '../../components/style/Button';
const EditProduct = ({ product, setEdit: setEditSellerProduct }: Product) => {
	const [files, setFiles] = useState<File[]>([]);
	const [filePerc, setFilePerc] = useState(0);
	const [, setFileErr] = useState(false);
	const [uploading, setUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const {
		navigate,
		setIsLoading,
		setProductsChanged,
		setProductChanged,
		setSellerProductChanged, setEdit
	} = useAuth();
	const [formData, setFormData] = useState({
		name: product?.name || '',
		description: product?.description || '',
		price: product?.price,
		quantity: product?.quantity || '',
		category: product?.category || '',
		brand: product?.brand || '',
		photo: product?.photo,
	});

	const windowWidth = useWindowWidth();

	const { name, description, price, quantity, category, brand } = formData;

	const storeImage = async (file: File) => {
		return new Promise((risol, rijek) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;

			const storageRef = ref(storage, `productsImage/${fileName}`);

			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setFilePerc(Math.round(progress));
					setUploading(true);
					setFileErr(false);
				},
				(err) => {
					console.error(err);
					setFileErr(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref)
						.then((downloadUrl) => {
							risol(downloadUrl);
						})
						.catch((err) => {
							rijek(err);
						});
				}
			);
		});
	};

	const handleUpload = (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (files.length > 0 && files.length < 7) {
			setFileErr(false);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					const stringUrls = urls.map((url) => String(url));
					setFormData({
						...formData,
						photo: formData?.photo?.concat(stringUrls),
					});
					setUploading(false);
					toast.success('upload image sukses puh');
				})
				.catch((err) => {
					console.error(err);
					setFileErr(true);
				});
		}
	};

	const handleRemoveImage = (index: number) => {
		setFormData({
			...formData,
			photo: formData?.photo?.filter((_, i) => i !== index),
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleEdit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const parsedQuantity =
			typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;

		if (parsedQuantity < 1) {
			return toast.error('quantity gaboleh kurang dari 1');
		}

		try {
			setIsLoading?.(true);
			await axios.patch(`/product/${product?._id}`, formData);
			setProductsChanged(true);
			setProductChanged(true);
			setSellerProductChanged(true);
			navigate(`/`);
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			toast.error(axiosError.response?.data.message);
			console.error(err);
		} finally {
			setIsLoading?.(false);
		}
	};

	const handleDelete = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		try {
			setIsLoading?.(true);

			await axios.delete(`/product/${product?._id}`);
			setProductsChanged(true);
			setProductChanged(true);
			setSellerProductChanged(true);
			toast.success('sukses delete product puh');
			navigate(`/`);
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			toast.error(axiosError.response?.data.message);
			console.error(err);
		} finally {
			setIsLoading?.(false);
		}
	};

	const canEdit = [
		formData.name !== product?.name ||
		formData.brand !== product?.brand ||
		formData.category !== product?.category ||
		formData.description !== product?.description ||
		formData.price !== product?.price ||
		formData.quantity !== product?.quantity ||
		formData.photo !== product.photo,
	].every(Boolean);

	const isSellerProductPage = window.location.pathname == '/dashboard/product';

	return (
		<>
			<section className="mt-8">
				<form
					action=""
					onSubmit={handleEdit}
					className="mt-4 mb-8"
				>
					<article className="grid grid-cols-7">
						<input
							type="text"
							name="name"
							onChange={handleInputChange}
							value={name}
							placeholder="name..."
							autoComplete="current-name"
							required
							className={`p-3 lg:col-span-2 col-span-full lg:rounded-tl-xl `}
						/>
						<input
							type="text"
							name="description"
							onChange={handleInputChange}
							value={description}
							placeholder="description..."
							autoComplete="current-description"
							required
							className=" lg:col-span-3 col-span-full p-3"
						/>
						<input
							type="number"
							name="price"
							onChange={handleInputChange}
							value={price}
							placeholder="price..."
							autoComplete="current-price"
							className="p-3 lg:col-span-1 col-span-2"
							required
						/>
						<input
							type="number"
							name="quantity"
							onChange={handleInputChange}
							value={quantity}
							placeholder="quantity..."
							autoComplete="current-quantity"
							required
							className="p-3 lg:col-span-1 col-span-2 lg:rounded-tr-xl"
						/>
						<input
							type="text"
							name="category"
							onChange={handleInputChange}
							value={category}
							placeholder="category..."
							autoComplete="current-category"
							required
							className="p-3 lg:col-span-1 col-span-3"
						/>
						<input
							type="text"
							name="brand"
							onChange={handleInputChange}
							value={brand}
							placeholder="brand..."
							autoComplete="current-brand"
							required
							className="p-3 lg:col-span-1 col-span-3"
						/>
						<input
							className="text-white hidden"
							type="file"
							onChange={(e) =>
								setFiles(e.target.files ? Array.from(e.target.files) : [])
							}
							multiple
							accept="image/*"
							ref={fileRef}
						/>
						<Button
							type="button"
							onClick={() => fileRef.current?.click()}
							className="primaryColor col-span-4 border-slate-500 border lg:col-span-3 "
							rounded="none"
						>
							Select a file
						</Button>
						<Button
							type="button"
							className={` col-span-full lg:col-span-2 border-slate-500 border ${!files.length
								? 'cursor-not-allowed opacity-70'
								: 'cursor-pointer opacity-100'
								}`}
							rounded='none'
							onClick={handleUpload}
							disabled={uploading && !files.length}
						>
							{uploading ? 'Uploading' : 'Upload'}
						</Button>

						{filePerc > 0 && filePerc < 100 ? (
							<span className="text-white">{`Uploading ${filePerc}%`}</span>
						) : null}
						<Button
							type="submit"
							className=" col-span-full  border-slate-500 border "
							rounded='none'
							disabled={!canEdit}
						>
							Edit Product
						</Button>

						<Button
							type="button"
							onClick={() => {
								if (window.location.pathname == '/dashboard/product') return setEditSellerProduct?.(false)
								setEdit(false)

							}}
							className="col-span-full border-slate-500 border"
							rounded='none'
						>
							Cancel Edit
						</Button>
						<Button
							type="button"
							onClick={handleDelete}
							className="col-span-full border-slate-500 border"
							rounded='none'
						>
							Delete Product
						</Button>
					</article>
					<article
						className={`grid ${isSellerProductPage ? 'grid-cols-1' : 'md:grid-cols-2'
							}  primaryColor-no-hover rounded-xl mt-8`}
					>
						{formData?.photo?.length &&
							formData?.photo?.map((url, i) => {
								let isEven = i % 2 === 0;

								if (windowWidth < 768) isEven = false;
								return (
									<div
										key={i}
										className="flex justify-between p-4 items-center"
									>
										{isEven && !isSellerProductPage ? (
											<>
												<button
													type="button"
													onClick={() => handleRemoveImage(i)}
													className="p-3 rounded-lg hover:opacity-75"
												>
													<AiFillDelete size={40} />
												</button>
												<img
													src={url}
													alt="listing image"
													className=" w-40 h-36 object-cover rounded-lg"
												/>
											</>
										) : (
											<>
												<img
													src={url}
													alt="listing image"
													className=" w-40 h-36 object-cover rounded-lg"
												/>
												<button
													type="button"
													onClick={() => handleRemoveImage(i)}
													className="p-3 rounded-lg hover:opacity-75"
												>
													<AiFillDelete size={40} />
												</button>
											</>
										)}
									</div>
								);
							})}
					</article>
				</form>
			</section>
		</>
	);
};

export default EditProduct;
