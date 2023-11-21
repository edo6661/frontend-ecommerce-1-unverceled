import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { AiFillGoogleCircle } from 'react-icons/ai'
import app from '../config/firebase';
import axios from '../config/axiosCredentials';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import Button from './style/Button';
const Oauth = () => {
	const { navigate, login } = useAuth();
	const handleGoogle = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);
			const result = await signInWithPopup(auth, provider);

			const { displayName: username, email, photoURL: photo } = result.user;

			const res = await axios.post('/auth/oauth', {
				username,
				email,
				photo,
			});
			if (res.data.user) {
				login?.(res.data.user);
			}
			toast.success(res.data.message);
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<Button
			color='sc'
			className="relative"
			rounded='bxl'
			onClick={handleGoogle}

		>
			Login With Google <span className='absolute bottom-3 ml-2'><AiFillGoogleCircle size={25} color={"white"} /></span>
		</Button>
	);
};

export default Oauth;
