import React from 'react'

const Button = ({ text, gray, yellow, notBtn, fluid, disabled }) => {
    return (
        gray ?
            <button className={`${fluid ? '!min-w-full' : ''} ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'} relative select-none md:py-3 md:px-8 py-2.5 px-6 min-w-[10rem] text-lg rounded-md hover:opacity-90 active:opacity-100 active:bg-gray-300  font-semibold capitalize bg-gray-200`}>

                {disabled &&
                    <div className="absolute w-full h-full bg-transparent-z-20 inset-0"></div>
                }
                {text}
            </button>
            : yellow ?
                <button className={`${fluid ? '!min-w-full' : ''} ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'} relative select-none  md:py-3 md:px-8 py-2.5 px-6 min-w-[10rem] text-lg rounded-md hover:opacity-90 active:opacity-100 active:bg-yellow-500 text-[#333] font-semibold capitalize bg-yellow-400 active:shadow-md`}>
                    {text}
                </button> :
                <button className={`${fluid ? '!min-w-full' : 'md:px-8 px-6'} ${notBtn ? 'truncate font-medium text-base' : ''} ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'} relative select-none md:py-3 py-2.5 px-2  min-w-[10rem] text-lg rounded-md  hover:opacity-90 active:opacity-100 active:bg-themeDarkColor text-white font-semibold capitalize bg-themeColor active:shadow-md`}>

                    {disabled &&
                        <div className="absolute w-full h-full bg-transparent-z-20 inset-0"></div>
                    }
                    {text}
                </button>
    )
}

export default Button