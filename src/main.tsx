import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './pages/Home.tsx';
import CreateProduct from './pages/private/CreateProduct.tsx';
import CreateReview from './pages/private/CreateReview.tsx';
import MidTrans from './pages/private/MidTrans.tsx';
import Order from './pages/private/Order.tsx';
import Orders from './pages/private/Orders.tsx';
import Payment from './pages/private/Payment.tsx';
import Private from './pages/private/Private.tsx';
import Profile from './pages/private/Profile.tsx';
import ReviewDetail from './pages/private/ReviewDetail.tsx';
import SellerProducts from './pages/private/SellerProducts.tsx';
import Users from './pages/private/Users.tsx';
import Cart from './pages/public/Cart.tsx';
import Login from './pages/public/Login.tsx';
import NotFound from './pages/public/NotFound.tsx';
import Product from './pages/public/Product.tsx';
import Register from './pages/public/Register.tsx';
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<App />}
		>
			<Route
				index
				element={<Home />}
			/>
			<Route
				path="/register"
				element={<Register />}
			/>
			<Route
				path="/login"
				element={<Login />}
			/>
			<Route
				path="/cart"
				element={<Cart />}
			/>
			<Route
				path="/product/:id"
				element={<Product />}
			/>
			<Route path='*' element={<NotFound />} />
			<Route>
				<Route path="/dashboard" element={<Private />}>
					<Route
						path="profile"
						element={<Profile />}
					/>
					<Route
						path="order"
						element={<Order />}
					/>
					<Route
						path="pay"
						element={<MidTrans />}
					/>
					<Route
						path="orders"
						element={<Orders />}
					/>
					<Route
						path="pay/:id"
						element={<Payment />}
					/>
					<Route
						path="reviewDetails/:id"
						element={<ReviewDetail />}
					/>
					<Route
						path="review/:id"
						element={<CreateReview />}
					/>
				// ! Owner
					<Route
						path="users"
						element={<Users />}
					/>
				// ! Seller
					<Route
						path="createProduct"
						element={<CreateProduct />}
					/>
					<Route
						path="product"
						element={<SellerProducts />}
					/>
				</Route>

			</Route>
		</Route>
	)
);

if (process.env.NODE_ENV !== 'development') disableReactDevTools()
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
