import { ReactNode } from "react"

const ProductElement = ({ icon, children }: { icon: ReactNode, children: ReactNode }) => {
    return (
        <div className='relative'>
            <span className='singleProductIcon'>{icon}</span>
            <div className="ml-3">
                <p>{children}</p>
            </div>
        </div>
    )
}

export default ProductElement