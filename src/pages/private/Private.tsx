import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Private = () => {
	const { user } = useAuth();

	if (user) {
		return (
			<>
				<Outlet />
			</>
		);
	} else {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}
};

export default Private;
