/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {
	BiLogOut,
	BiMenu
} from 'react-icons/bi';
import { BsCart4 } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { TbBrandReactNative } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const Header = () => {

	const { user, logout, cart, modeNav, setModeNav, setDropdownBrand, dropdownBrand, dropdownCategory, setDropdownCategory, activeBrand, activeCategory, searchInput } = useAuth();
	useEffect(() => {

		if (!modeNav) {
			setDropdownBrand(false)
			setDropdownCategory(false)
		}
	}, [modeNav])

	useEffect(() => {
		setModeNav(false)
	}, [window.location.pathname])

	const cartElement = (
		<div className="relative sm:mr-2">
			<Link to="/cart">
				<BsCart4 size={25} />
			</Link>
			<span className="absolute inset-0 left-6 text-lg -top-3 ">
				{cart?.items?.length}
			</span>
		</div>

	)

	const categoryBrandMobile = (
		<div className='sm:hidden'>
			<div className='flex items-end gap-2'>
				<button onClick={(e) => {
					e.preventDefault();
					setDropdownBrand(prev => !prev)
				}}>
					Brand
				</button>
				<span>
					{dropdownBrand ? <IoMdArrowDropdown /> :
						<IoMdArrowDropup />
					}
				</span>
			</div>
			{dropdownBrand && activeBrand}
			<br />
			<div className='flex items-end gap-2 transition-all duration-300'>
				<button onClick={(e) => { e.preventDefault(); setDropdownCategory(prev => !prev) }}>Category</button>

				<span>
					{dropdownCategory ? <IoMdArrowDropdown /> :
						<IoMdArrowDropup />
					}
				</span>
			</div>
			{dropdownCategory && activeCategory}
		</div>
	)

	const categoryBrand = (
		<>
			<div className='relative group w-full transition-all duration-300 sm:block hidden' onClick={() => setDropdownBrand(prev => !prev)
			} >
				<button className='hidden sm:block group-hover:text-white opacity-80 group-hover:opacity-1'  >Brand</button>
				<div className='flex flex-col absolute text-base text-stone-400 top-8 transition-all ease-in-out duration-300 sm:block  ' onMouseEnter={() => setDropdownBrand(true)
				} >
					{dropdownBrand && activeBrand}
				</div>
			</div>
			<div className='relative group w-full sm:block hidden' onClick={() => setDropdownCategory(prev => !prev)
			} >
				<button className='hidden sm:block group-hover:text-white opacity-80 group-hover:opacity-1'  >Category</button>
				<div className='flex flex-col absolute text-base text-stone-400 top-8 ' onMouseEnter={() => setDropdownCategory(true)
				} >
					{dropdownCategory && activeCategory}
				</div>
			</div>
		</>
	)

	const leftNav = (
		<div className="flex items-center">
			<Link to="/" className='italic'>
				Logo
			</Link>
		</div>
	)

	const midNav = (
		<div className={` w-inherit flex sm:items-center text-neutral-300 font-semibold gap-10 sm:static sm:flex-row sm:text-lg sm:gap-6 md:text-xl  ${modeNav ? ' left-[320px] px-16 ' : 'right-[-1000px]'} sm:w-auto sm:justify-between sm:py-2 sm:rounded-full sm:items-center primaryColor fixed flex-col justify-start items-start min-h-full w-[50rem] top-28 text-3xl duration-300 ease-in-out shadow-md shadow-slate-800 transition-all px-8 py-8 rounded-md z-50`}
		>
			{user && user.roles === 'user' && (
				<>
					<Link className='cursor-pointer block w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold ' to="/dashboard/orders">
						<span className='group-hover:text-white'>Order</span>
					</Link>
				</>
			)}
			{user && user.roles === 'seller' && (
				<>
					<Link className='cursor-pointer block w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold ' to="/dashboard/createProduct">
						<span className='group-hover:text-white'>Create</span>
					</Link>
					<Link className='cursor-pointer block w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold' to="/dashboard/product">
						<span >Product</span>
					</Link>
					<button className='text-start w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold sm:hidden' onClick={logout}>
						Logout
					</button>
				</>
			)
			}
			{user && user.roles === 'owner' && (
				<>
					<Link className='cursor-pointer block w-full hover:text-white opacit	y-80 hover:opacity-1 hover:font-semibold ' to="/dashboard/users">
						<span className='group-hover:text-white'>Users</span>
					</Link>
					<button className='text-start w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold sm:hidden' onClick={logout}>
						Logout
					</button>
				</>
			)
			}
			{!user && (
				<>
					<Link className='cursor-pointer block w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold' to="register">
						<span >Register</span>
					</Link>
					<Link className='cursor-pointer block w-full hover:text-white opacity-80 hover:opacity-1 hover:font-semibold' to="login">
						<span >Login</span>
					</Link>
				</>
			)}

			{window.location.pathname === '/' ? categoryBrand : null}
			{window.location.pathname === '/' ?
				categoryBrandMobile
				: null}

		</div>
	)


	const mobileNav = window.location.pathname === '/' ? (
		<div className={`flex items-center gap-4 flex-grow sm:hidden`} >
			{searchInput}
			{user && user?.roles === 'user' && cartElement}
			<button onClick={() => {
				setModeNav(prev => !prev)
			}} className={`px-2 sm:hidden`}>
				{modeNav ? <AiOutlineClose size="40" />
					: <BiMenu size="40" />
				}
			</button>
		</div>
	) : <button onClick={() => {
		setModeNav(prev => !prev)
	}} className={`px-2 sm:hidden`}>
		{modeNav ? <AiOutlineClose size="40" />
			: <BiMenu size="40" />
		}

	</button>

	const rightNav = user ? (
		<div className="sm:flex hidden items-center gap-4">
			{user.roles === 'user' && cartElement}
			<Link to={'/dashboard/profile'}>
				<CgProfile size={25} />
			</Link>
			<button onClick={logout}>
				<BiLogOut size={25} />
			</button>
		</div>
	) : (
		<div className='sm:block hidden'>
			{<TbBrandReactNative size={35} />}
		</div>
	)

	return (
		<>
			<nav className={`mt-4 fixed z-10 sm:static mb-6 sm:w-full w-[600px] `} onMouseLeave={() => { setDropdownBrand(false); setDropdownCategory(false) }}>
				<div className={`max-w-6xl mx-auto flex justify-between items-center gap-12 }`}>
					{leftNav}

					{!user && (
						<>
							{midNav}
							{mobileNav}
							{rightNav}
						</>
					)}

					{user && user.roles === 'user' && (
						<>
							{midNav}
							{mobileNav}
							{rightNav}
						</>
					)}
					{user && user.roles === 'seller' && (
						<>
							{midNav}
							{mobileNav}
							<div className="sm:flex hidden items-center gap-4  ">
								<Link to={'/dashboard/profile'}>
									<CgProfile size={25} />
								</Link>
								<button onClick={logout}>
									<BiLogOut size={25} />
								</button>
							</div>
						</>
					)}

					{user && user?.roles === 'owner' && (
						<>
							{midNav}
							{mobileNav}
							{rightNav}
						</>
					)}

				</div>
			</nav>
		</>
	);
};

export default Header;
