import { AxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/style/Button';
import axios from '../config/axiosCredentials';
import { brands, categorys } from '../config/filter';
import {
	CartProducts,
	ChildrenType,
	OrderDocument,
	Products,
	Review,
	User,
} from '../type';
import { AuthContextType } from '../typeContext';

const authContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: ChildrenType) => {
	const [user, setUser] = useState<User | null>(null);
	const [products, setProducts] = useState<[Products] | []>([]);
	const [showProducts, setShowProducts] = useState(Boolean)
	const [dataPromise, setDataPromise] = useState();
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState<number>(0);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [brand, setBrand] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [checkout, setCheckout] = useState<boolean>(false);
	const [productsChanged, setProductsChanged] = useState(true);
	const [productChanged, setProductChanged] = useState(true);
	const [reviewChanged, setReviewChanged] = useState(true);
	const [ordersChanged, setOrdersChanged] = useState(true);
	const [sellerProductChanged, setSellerProductChanged] = useState(true);
	const [sellerProducts, setSellerProducts] = useState<[Products] | []>([]);
	const [modeNav, setModeNav] = useState(false);
	const [dropdownBrand, setDropdownBrand] = useState(false);
	const [dropdownCategory, setDropdownCategory] = useState(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [clickedBrand, setClickedBrand] = useState<boolean>(false);
	const [clickedCategory, setClickedCategory] = useState<boolean>(false);
	const [activeColorBrand, setActiveColorBrand] = useState<number | null>(null);
	const [activeColorCategory, setActiveColorCategory] = useState<number | null>(
		null
	);

	const navigate = useNavigate();

	useEffect(() => {
		const storedData = localStorage.getItem('user');
		if (storedData) {
			setUser(JSON.parse(storedData));
		}
	}, []);

	const login = (userData: User) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
		navigate('/');
	};

	const updateUser = (newData: Partial<User>) => {
		const updatedUser = { ...user, ...newData };
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};
	const fetchProducts = async () => {
		try {
			const { data } = await axios.get(
				`/products?page=${page}&search=${search}&category=${category.toString()}&brand=${brand.toString()}`
			);
			setProducts?.(data.items);
			if (!data.items.length) {
				setTimeout(() => setShowProducts(true), 1000);
			}
			setDataPromise(data);
		} catch (err) {
			console.error(err);
		}
	};

	const [product, setProduct] = useState<Products | null>(null);

	const fetchProductById = async (productId: string) => {
		try {
			setIsLoading?.(true);
			const res = await axios.get(`product/${productId}`);
			setProduct(res.data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading?.(false);
		}
	};

	const addToCart = async (productId: string, quantity?: number) => {
		if (!user) {
			navigate('/login');
			toast.info('login dulu puh');
			return;
		}
		if (user.roles !== 'user') {
			toast.info('hanya user yang bisa add to cart puh');
			return;
		}

		try {
			const payload = quantity ? { productId, quantity } : { productId };
			const res = await axios.post('/carts', payload);
			toast.success(res.data.message);
			getCart();
		} catch (err) {
			const axiosError = err as AxiosError<ErrorResponse>;
			toast.error(axiosError?.response?.data.message);
		}
	};

	const [reviews, setReviews] = useState<Review[] | []>([]);

	const getReview = async (id: string) => {
		try {
			setIsLoading?.(true);
			const { data } = await axios.get(`/product/${id}/review`);
			setReviews(data);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading?.(false);
		}
	};

	const [cart, setCart] = useState<CartProducts[] | null>(null);
	const [showNoCart, setShowNoCart] = useState<boolean>(false);

	const getCart = async () => {
		try {
			const res = await axios.get('/carts');
			setCart(res.data);

			if (!res.data.items.length) {
				setTimeout(() => setShowNoCart(true), 1000);
			}
		} catch (err) {
			setTimeout(() => setShowNoCart(true), 1000);
			console.error(err);
		}
	};

	const [orders, setOrders] = useState<OrderDocument[] | []>([]);
	const [showNoOrders, setShowNoOrders] = useState<boolean>(false);

	const getOrders = async () => {
		try {
			setIsLoading?.(true);
			const res = await axios.get('/order');
			setOrders(res.data);
			if (!res.data.length) {
				setTimeout(() => {
					setShowNoOrders(true);
				}, 500);
			}
		} catch (err) {
			setTimeout(() => {
				setShowNoOrders(true);
			}, 500);
			console.error(err);
		} finally {
			setIsLoading?.(false);
		}
	};



	const handleBrandButton = (brand: string) => {
		setBrand(brand);
	};
	const handleCatButton = (cat: string) => {
		setCategory(cat);
	};

	const activeBrand = brands.map((brand, index) => {
		return (
			<div
				className={`flex flex-col items-start transition-all duration-300 ${activeColorBrand == index
					? ' font-semibold opacity-100 sm:text-lg'
					: 'opacity-70 hover:opacity-100 hover:font-semibold'
					} disabled:cursor-not-allowed`}
				key={index}
			>
				<button
					onClick={(e) => {
						e.preventDefault();
						handleBrandButton(brand);
						setModeNav(false);
						setActiveColorBrand(index);
					}}
					disabled={activeColorBrand === index}
				>
					{brand}
				</button>
			</div>
		);
	});

	const activeCategory = categorys.map((cat, i) => {
		return (
			<div
				className={`flex flex-col items-start transition-all duration-150 ${activeColorCategory == i
					? ' font-semibold opacity-100 sm:text-lg'
					: 'opacity-70 hover:opacity-100 hover:font-semibold'
					} disabled:cursor-not-allowed`}
				key={i}
			>
				<button
					key={cat}
					onClick={(e) => {
						e.preventDefault();
						handleCatButton(cat);
						setModeNav(false);
						setClickedCategory(true);
						setActiveColorCategory(i);
					}}
				>
					{cat}
				</button>
			</div>
		);
	});

	const searchInput = window.location.pathname === '/' && (
		<input
			type="text"
			className="py-4 border border-slate-500 rounded-xl placeholder:pl-4 sm:placeholder:ml-3 text-white focus:outline-none focus:border-slate-700 transition-all duration-300 flex-grow primaryColor text-xl"
			name="search"
			id="search"
			onChange={(e) => setSearch(e.target.value)}
			value={search}
			placeholder="Search..."
		/>
	);

	const handleNext = () => {
		setPage((prev) => {
			if (page === pageCount) return page;
			return prev + 1;
		});
	};

	const handlePrev = () => {
		setPage((prev) => {
			if (page === 1) return page;
			return prev - 1;
		});
	};

	const buttonPagination = Array(pageCount)
		.fill(null)
		.map((_, i) => {
			return (
				<Button
					key={i}
					onClick={() => setPage(i + 1)}
					className={`${page === i + 1 ? ' opacity-70' : ' opacity-100'
						}`}
					rounded='none'
				>
					{i + 1}
				</Button>
			);
		});

	const elementPagination = (
		<section className="flex justify-center sm:my-0 my-16">
			<Button
				disabled={page === 1}
				onClick={handlePrev}
				className={` rounded-r-none`}
			>
				<BiSkipPrevious size={25} />
			</Button>

			{buttonPagination}
			{/* 
			<select className='text-black' onChange={(e) => setPage(+e.target.value)} value={page}>
				{Array(pageCount).fill(null).map((_, i) => {
					return <option value={i + 1} key={i}>
						{i + 1}
					</option>
				})}
			</select> 
			*/}
			<Button
				disabled={page === pageCount}
				onClick={handleNext}
				className={` rounded-l-none`}
			>
				<BiSkipNext size={25} />

			</Button>
		</section>
	);

	const handleEdit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setEdit((prev) => !prev);
	};

	useEffect(() => {
		setEdit(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	const [review, setReview] = useState<Review[] | []>([]);

	const getReviewByUser = async () => {
		try {
			setIsLoading?.(true)
			const { data } = await axios.get('/review');
			setReview(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading?.(false)
		}
	};
	const [reviewDetailChanged, setReviewDetailChanged] = useState<boolean>(true)
	const [reviewDetails, setReviewDetails] = useState<Review[]>([]);

	const reviewDetail = async (id: string) => {
		try {
			const { data } = await axios.get(`review/${id}`)
			setReviewDetails(data)
		} catch (error) {
			console.error(error)
		}
	}


	return (
		<authContext.Provider
			value={{
				user,
				setUser,
				logout,
				login,
				isLoading,
				setIsLoading,
				navigate,
				products,
				setProducts,
				fetchProducts,
				addToCart,
				updateUser,
				reviews,
				setReviews,
				getReview,
				cart,
				setCart,
				showNoCart,
				setShowNoCart,
				getCart,
				orders,
				setOrders,
				getOrders,
				fetchProductById,
				product,
				setProduct,
				checkout,
				setCheckout,
				showNoOrders,
				productsChanged,
				setProductsChanged,
				productChanged,
				setProductChanged,
				sellerProductChanged,
				setSellerProductChanged,
				sellerProducts,
				setSellerProducts,
				page,
				setPage,
				pageCount,
				setPageCount,
				dataPromise,
				search,
				category,
				brand,
				setSearch,
				setBrand,
				setCategory,
				modeNav,
				setModeNav,
				dropdownBrand,
				setDropdownBrand,
				dropdownCategory,
				setDropdownCategory,
				activeBrand,
				activeCategory,
				handleBrandButton,
				handleCatButton,
				searchInput,
				elementPagination,
				edit,
				setEdit,
				handleEdit,
				clickedBrand,
				setClickedBrand,
				clickedCategory,
				setClickedCategory,
				ordersChanged,
				setOrdersChanged, showProducts, review, setReview, getReviewByUser, reviewChanged, setReviewChanged
				, reviewDetails, setReviewDetails, reviewDetail, reviewDetailChanged, setReviewDetailChanged

			}}
		>
			{children}
		</authContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export default authContext;
