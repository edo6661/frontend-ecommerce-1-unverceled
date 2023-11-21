import axios from 'axios';


// axios.defaults.baseURL = 'https://test-edo666.onrender.com';
axios.defaults.baseURL = 'http://localhost:5000/';
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
	(response) => response,
	(err) => {
		let message;
		if (err.response) {
			const status = err.response.status;
			message = status === 403 ? 'forbidden puh gapunya akses untuk request ini' :
				status === 401 ? 'Unathorized puh' : status === 404 ? 'not found puh' : status === 500 ? 'error server puh' : 'gaada response puh';
		} else {
			message = 'gaada response puh';
			console.log(err)
			localStorage.removeItem('user');
		}

		console.error(message);

		return Promise.reject(err);
	}
);

export default axios;
