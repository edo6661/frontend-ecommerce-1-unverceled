import { MouseEventHandler, ReactNode } from "react"
import variant from "../../utils/styleElement";

interface ButtonProps {
    children: ReactNode;
    color?: string;
    size?: string;
    rounded?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>
    type?: 'button' | 'submit';
    className?: string;
    disabled?: boolean;
}

const Button = ({ children, onClick, color = 'pr', size = 'md', rounded = 'xl', type = 'submit', className = '', disabled = false }: ButtonProps) => {

    const buttonStyle = variant(
        'dark:text-white text-black disabled:opacity-70 disabled:cursor-not-allowed',
        {
            color: {
                pr: 'primaryColor',
                sc: 'bg-red-500 shadow-md shadow-red-500'
            },
            size: {
                lg: 'py-3 px-6',
                md: 'py-3 px-4',
                sm: 'py-2 px-3',
            },
            rounded: {
                xl: 'rounded-xl',
                txl: 'rounded-t-xl',
                tlxl: 'rounded-tl-xl',
                trxl: 'rounded-tr-xl',
                bxl: 'rounded-b-xl',
                blxl: 'rounded-bl-xl',
                brxl: 'rounded-br-xl',
                none: 'rounded-none',
                lxl: 'rounded-l-xl',
                rxl: 'rounded-r-xl',
            },
        },
    )

    return (
        <button type={type} disabled={disabled} className={`${buttonStyle({ color, size, rounded })} ${className}`} onClick={onClick}>{children}</button>
    )
}


export default Button