import { AxiosError } from 'axios';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../components/style/Button';
import app from '../../config/firebase';
import useAuth from '../../hooks/useAuth';
import useWindowWidth from '../../hooks/useMediaQuery';
import axios from './../../config/axiosCredentials';

// ! foto dengan ngupload
const Profile = () => {
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileErr, setFileErr] = useState(false);
	const { user, navigate, updateUser } = useAuth();
	const [form, setForm] = useState({
		username: user?.username ? user.username : '',
		email: '',
		address: user?.address ? user.address : '',
		photo: user?.photo ? user.photo : '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		google: false,
	});

	const width = useWindowWidth();

	const { currentPassword, newPassword, confirmPassword, email } = form;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.id]: e.target.value });
	};

	const verifyPassword = async () => {
		try {
			await axios.post('/auth/verify', { currentPassword });
		} catch (err) {
			setForm({
				...form,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			const axiosError = err as AxiosError<ErrorResponse>;
			console.error(err);
			return toast.error(axiosError?.response?.data?.message);
		}
	};
	const handleUpdate = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (newPassword != confirmPassword) {
			setForm({
				...form,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			toast.error('newPassword dan confirmPassword harus sama puh');
			return;
		}
		if (!user?.google) {
			if (newPassword) {
				verifyPassword();
			}
		}
		const filledForm = Object.fromEntries(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			Object.entries(form).filter(([_, value]) => value)
		);
		try {
			const res = await axios.patch('/user', filledForm);
			toast.success(res.data.message);
			// logout?.();
			updateUser?.(filledForm);
			navigate('/');
		} catch (err) {
			setForm({
				...form,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
				email: '',
			});
			const axiosError = err as AxiosError<ErrorResponse>;
			console.error(err);
			return toast.error(axiosError?.response?.data?.message);
		}
	};

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	const handleFileUpload = (file: File) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `avatars/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
				setFileErr(false);
			},
			() => {
				setFileErr(true);
				toast.error('file upload max nya cuman 2mb puh');
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref)
					.then((downloadURL) => {
						setForm({ ...form, photo: downloadURL });
					})
					.catch((err) => {
						console.log(err);
					});
			}
		);
	};

	const elementNewPassword = (
		<input
			type="password"
			name="newPassword"
			id="newPassword"
			value={newPassword}
			placeholder="new password..."
			onChange={handleInputChange}
			autoComplete="new-password"
		/>
	)

	const canSubmit = [form.username !== user?.username ||
		form.address !== user?.address ||
		form.photo !== user?.photo
	].every(Boolean);


	return (
		<>
			<form
				action=""
				onSubmit={handleUpdate}
				className="my-8"
			>

				<input
					type="file"
					onChange={(e) => e.target.files && setFile(e.target.files[0])}
					ref={fileRef}
					className="hidden"
				/>

				<div className="self-center flex items-center flex-col mb-8 mt-4 gap-2">
					<img
						className="rounded-full w-56 h-56"
						src={form.photo || user?.photo}
						alt=""
						onClick={() => fileRef.current?.click()}
					/>
					{fileErr ? (
						<span className="text-red-700">
							Error Image upload (image must be less than 2 mb)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-white">{`Uploading ${filePerc}%`}</span>
					) : filePerc === 100 && !fileErr ? (
						<span className="primaryColor mt-2">
							Image successfully uploaded!
						</span>
					) : (
						''
					)}
				</div>
				<div className='grid md:grid-cols-3 grid-cols-1'>

					<input
						type="text"
						name="username"
						id="username"
						autoComplete="username"
						placeholder="username"
						defaultValue={user?.username}
						onChange={handleInputChange}
						className={`${width > 768 ? 'rounded-tl-xl pl-3' : 'rounded-t-xl'}`}
					/>
					<input
						type="text"
						autoComplete="email"
						name="email"
						id="email"
						placeholder="email"
						onChange={handleInputChange}
						value={email}
					/>
					<input
						type="text"
						name="phone"
						id="phone"
						autoComplete="phone"
						placeholder="phone"
						onChange={handleInputChange}
						defaultValue={user?.phone}
						className='md:rounded-tr-xl'
					/>
					<input
						type="text"
						name="photo"
						id="photo"
						autoComplete="photo"
						placeholder="photo"
						onChange={handleInputChange}
						defaultValue={user?.photo}
						className='md:col-span-2'
					/>
					{user?.google && elementNewPassword}
					<input
						type="text"
						autoComplete="address"
						name="address"
						id="address"
						defaultValue={user?.address}
						placeholder="address"
						onChange={handleInputChange}
						className={`${!user?.google ? 'md:col-span-1' : 'md:col-span-2'}`}
					/>
					{!user?.google && (
						<>
							<input
								type="password"
								name="currentPassword"
								id="currentPassword"
								placeholder="old password..."
								onChange={handleInputChange}
								value={currentPassword}
								autoComplete="current-password"
							/>
							{elementNewPassword}
						</>
					)}
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						placeholder="confirmPassword..."
						onChange={handleInputChange}
						value={confirmPassword}
						autoComplete="confirm-password"

					/>
					<Button type='submit' className=' col-span-full' rounded='bxl' disabled={!canSubmit}>Update</Button>
				</div>
			</form>
		</>
	);
};

export default Profile;
