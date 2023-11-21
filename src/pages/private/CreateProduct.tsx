import { useState, useRef } from 'react';
import axios from '../../config/axiosCredentials';
import useAuth from '../../hooks/useAuth';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { AiFillDelete } from 'react-icons/ai';
import app from '../../config/firebase';
import { toast } from 'react-toastify';
import { Products } from '../../type';
import useWindowWidth from '../../hooks/useMediaQuery';
import Button from '../../components/style/Button';
const CreateProduct = () => {
	const { navigate, setProductsChanged, setSellerProductChanged } = useAuth();
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [formData, setFormData] = useState<Products>({
		name: '',
		description: '',
		price: 1,
		quantity: 1,
		category: '',
		brand: '',
		photo: [],
	});
	const windowWidth = useWindowWidth();

	const [files, setFiles] = useState<File[]>([]);
	const [filePerc, setFilePerc] = useState(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [fileErr, setFileErr] = useState(false);
	const [uploading, setUploading] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { name, description, price, quantity, category, brand } = formData;

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const storeImage = async (file: File) => {
		return new Promise((resolve, reject) => {
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
					reject(err);
					setFileErr(true);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						resolve(downloadUrl);
					});
				}
			);
		});
	};

	const handleUpload = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (files.length > 0 && files.length + formData.photo.length < 7) {
			setFileErr(false);
			const promises = [];
			for (let i = 0; i < files.length; i++) {
				// ! downloadUrl bakal di store di promises
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					const stringUrls = urls.map((url) => String(url));
					setFormData({
						...formData,
						photo: formData.photo.concat(stringUrls),
					});
					setUploading(false);
					toast.success('upload image sukses puh');
				})
				.catch((err) => {
					// ! lebih dari 2 mb
					setFileErr(true);
					toast.error('image harus kurang dari 2mb puh');
					console.error(err);
				});
			setUploading(false);
		} else {
			// ! lebih dari 7 image
			setFileErr(true);
			toast.error('image harus kurang dari 7 puh');
			setUploading(false);
		}
	};

	const handleRemoveImage = (index: number) => {
		setFormData({
			...formData,
			photo: formData.photo.filter((_, i) => i !== index),
		});
	};

	const handleCreate = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			await axios.post('/product', formData);
			setProductsChanged(true);
			setSellerProductChanged(true);
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};

	const canSubmit = [
		name,
		description?.length,
		price,
		quantity,
		category.length,
		brand.length,
	].every(Boolean);

	return (
		<>
			<section>
				<form
					action=""
					onSubmit={handleCreate}
					className="my-8"
				>
					<section className="grid grid-cols-7">
						<input
							type="text"
							name="name"
							id="name"
							placeholder="Name..."
							required
							value={name}
							onChange={handleInputChange}
							className={`p-3 sm:col-span-2 col-span-full sm:rounded-tl-xl rounded-tl-xl`}
						/>
						<input
							type="text"
							name="description"
							id="description"
							placeholder="Description..."
							className=" sm:col-span-3 col-span-full p-3"
							value={description}
							onChange={handleInputChange}
							required
						/>

						<input
							type="number"
							name="price"
							id="price"
							placeholder="Price..."
							value={price}
							onChange={handleInputChange}
							className="p-3 sm:col-span-1 col-span-2"
							min="1"
							required
						/>

						<input
							type="number"
							name="quantity"
							id="quantity"
							placeholder="Quantity..."
							className="p-3 sm:col-span-1 col-span-2 sm:rounded-tr-xl"
							value={quantity}
							onChange={handleInputChange}
							min="1"
							required
						/>
						<input
							type="text"
							name="category"
							id="category"
							placeholder="Category..."
							className="p-3 sm:col-span-1 col-span-3"
							value={category}
							onChange={handleInputChange}
							required
						/>
						<input
							type="text"
							name="brand"
							id="brand"
							placeholder="Brand..."
							className="p-3 sm:col-span-1 col-span-3"
							value={brand}
							onChange={handleInputChange}
							required
						/>
						<input
							className="text-white hidden"
							required
							type="file"
							ref={fileRef}
							onChange={(e) =>
								setFiles(e.target.files ? Array.from(e.target.files) : [])
							}
							multiple
							accept="image/*"
						/>
						<Button
							type="button"
							onClick={() => fileRef.current?.click()}
							className=" col-span-4 sm:col-span-3 border-slate-500 border "
							rounded="none"
						>
							Select a file
						</Button>
						<Button
							type="button"
							className={`col-span-full sm:col-span-2 border-slate-500 border ${!files.length
								? 'cursor-not-allowed opacity-70'
								: 'cursor-pointer opacity-100'
								}`}
							onClick={handleUpload}
							rounded="none"
							disabled={uploading && !fileErr && !files.length}
						>
							{uploading && !fileErr ? 'Uploading' : 'Upload'}
						</Button>
						<Button
							type="submit"
							className={`col-span-full`}
							rounded="bxl"
							disabled={!canSubmit}
						>
							Create
						</Button>
					</section>
				</form>
				{filePerc > 0 && filePerc < 100 ? (
					<span className="text-white">{`Uploading ${filePerc}%`}</span>
				) : null}
				<section className="grid md:grid-cols-2 grid-cols-1  primaryColor-no-hover rounded-xl">
					{formData.photo.length > 0 &&
						formData.photo.map((url, i) => {
							let isEven = i % 2 === 0;
							if (windowWidth < 768) isEven = false;
							return (
								<div
									className={`flex justify-between p-4 items-center`}
									key={url}
								>
									{isEven ? (
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
												alt={`product-image ${i}`}
												className=" w-48 h-36 object-cover rounded-lg"
											/>
										</>
									) : (
										<>
											<img
												src={url}
												alt={`product-image ${i}`}
												className=" w-48 h-36 object-cover rounded-lg"
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
				</section>
			</section>
		</>
	);
};

export default CreateProduct;
