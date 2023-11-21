import "react-image-gallery/styles/css/image-gallery.css";
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

function App() {
	return (
		<>
			<AuthProvider>
				<Header />
				<ToastContainer
					position="bottom-right"
					autoClose={1500}
					closeOnClick
					pauseOnHover
					theme="dark"
				/>
				<main className=" min-h-screen max-w-6xl mx-auto sm:mt-4 mt-24">
					<Outlet />
				</main>
				<Footer />
			</AuthProvider>
		</>
	);
}

export default App;
