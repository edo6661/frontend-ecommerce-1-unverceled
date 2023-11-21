import { useContext } from 'react';
import authContext from '../contexts/AuthContext';
const useAuth = () => {
	return useContext(authContext);
};

export default useAuth;
