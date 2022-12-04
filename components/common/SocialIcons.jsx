import Link from 'next/link'
import { AiOutlineInstagram, AiOutlineLinkedin, AiOutlineTwitter } from 'react-icons/ai'
import { FaFacebookF } from 'react-icons/fa'
import React from 'react'

const SocialIcons = () => {
    return (
        <div className='flex items-center gap-6'>
            <Link legacyBehavior href='/'>
                <a className="w-14 h-14 hover:bg-themeColor hover:text-white text-2xl hover:border-themeColor transition-all duration-500 border rounded-full flex items-center justify-center">
                    <AiOutlineInstagram />
                </a>
            </Link>
            <Link legacyBehavior href='/'>
                <a className="w-14 h-14 hover:bg-themeColor hover:text-white text-2xl hover:border-themeColor transition-all duration-500 border rounded-full flex items-center justify-center">
                    <FaFacebookF />
                </a>
            </Link>
            <Link legacyBehavior href='/'>
                <a className="w-14 h-14 hover:bg-themeColor hover:text-white text-2xl hover:border-themeColor transition-all duration-500 border rounded-full flex items-center justify-center">
                    <AiOutlineTwitter />
                </a>
            </Link>
            <Link legacyBehavior href='/'>
                <a className="w-14 h-14 hover:bg-themeColor hover:text-white text-2xl hover:border-themeColor transition-all duration-500 border rounded-full flex items-center justify-center">
                    <AiOutlineLinkedin />
                </a>
            </Link>
        </div>
    )
}

export default SocialIcons