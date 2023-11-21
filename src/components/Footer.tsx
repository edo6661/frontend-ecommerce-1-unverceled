import useAuth from "../hooks/useAuth";
const Footer = () => {
	const { elementPagination } = useAuth();
	const elementOutsideDefaultPath = (
		<h6 className={`text-xl text-center text-slate-400 ${window.location.pathname === '/' ? "my-12" : 'my-8'}`}>
			Copyright &copy; 2023 Muhammad Ridho.
		</h6>
	)
	return (
		<footer className="my-6">
			{window.location.pathname === '/' && elementPagination}
			{elementOutsideDefaultPath}
		</footer>
	)
};

export default Footer;
