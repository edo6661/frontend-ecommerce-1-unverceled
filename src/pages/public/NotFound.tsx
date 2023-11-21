import { TbError404 } from 'react-icons/tb'
import { IoLogoOctocat } from 'react-icons/io'

const NotFound = () => {
    return (
        <section className='flex justify-center my-10'>
            <div className='flex items-center gap-3'>
                <span>
                    <TbError404 size={45} />
                </span>
                <p className='text-xl'>
                    Not Found
                </p>
                <span className='ml-6'>
                    <IoLogoOctocat size={45} />
                </span>
            </div>
        </section>
    )
}

export default NotFound