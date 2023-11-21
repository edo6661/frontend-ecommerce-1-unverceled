import axios from './../../config/axiosCredentials';
import { useState, useEffect } from 'react';
import User from '../../components/User';
import Loading from '../../components/Loading';

const Users = () => {
	const [users, setUsers] = useState<[User] | []>([]);
	const [showNoUser, setShowNoUser] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const getUsers = async () => {
		try {
			// setIsLoading(true);
			const { data } = await axios.get('/users');
			setUsers(data);

			if (data.length === 0) {
				setTimeout(() => setShowNoUser(true), 1000);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getUsers();
	}, []);
	return (
		<>
			<section className='grid gap-y-12 gap-x-8 lg:grid-cols-3 md:grid-cols-2 mt-8'>

				{isLoading && <Loading />}
				{users.length
					? users.map((user) => {
						return (
							<User
								key={user._id}
								{...user}
								getUsers={getUsers}
							/>
						);
						// eslint-disable-next-line no-mixed-spaces-and-tabs
					})
					: showNoUser && <p>no users</p>}
			</section>

		</>
	);
};

export default Users;
