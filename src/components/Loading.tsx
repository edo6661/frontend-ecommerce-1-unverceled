import { ThreeDots } from 'react-loader-spinner';

const Loading = () => {
	return (
		<section className='flex min-h-screen justify-center items-center -translate-y-16'>
			<ThreeDots
				height="80"
				width="80"
				radius="7"
				color="#C0C2C9"
				ariaLabel="three-dots-loading"
				visible={true}
			/>
		</section>
	);
};

export default Loading;
