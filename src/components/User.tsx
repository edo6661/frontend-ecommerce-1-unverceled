import React, { useState } from 'react';
import axios from '../config/axiosCredentials';
import { userRoles } from '../config/options';
import { toast } from 'react-toastify'
import { User } from '../type';
import upperFirst from '../helpers/upperFirst';
import { AiOutlineDelete } from 'react-icons/ai'

const User = ({ email, roles, username, _id, getUsers, photo }: User) => {
	const [defaultRoles, setDefaultRoles] = useState(roles || '');
	const [loading, setLoading] = useState(false);

	const updateRoles = async (newRole: string) => {
		try {
			setLoading(true);
			getUsers?.();
			await axios.patch('/users', {
				_id,
				roles: newRole,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const deleteUser = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.delete(`/user/${_id}`);
			toast.success(data)
			getUsers?.();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newRole = e.target.value;
		setDefaultRoles(newRole);
		updateRoles(newRole);
	};


	return (
		<>
			{username && (
				<article className='flex flex-col gap-3 mt-10'>
					<div className='flex mb-4 '>
						<img className='flex-1 object-cover rounded-xl h-64' src={photo} alt="" />
					</div>
					<p className='font-semibold text-lg'>{upperFirst(username)}</p>
					<p>{email}</p>
					<div className='flex justify-between mt-1'>
						<select
							value={defaultRoles}
							className="flex-1 dark:text-white text-black w-fit px-3 py-1 font-semibold rounded-l-xl primaryColor"
							onChange={handleRoleChange}
							disabled={loading}
						>
							{userRoles.map((option) => (
								<option
									key={option}
									value={option}
								>
									{upperFirst(option)}
								</option>
							))}
						</select>
						<button
							className='primaryColor py-2 px-3 rounded-r-xl w-fit'
							onClick={deleteUser}
							disabled={loading}
						>
							<AiOutlineDelete size={20} />
						</button>
					</div>
				</article>

			)}
		</>
	);
};

export default User;
