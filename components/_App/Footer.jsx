import React from 'react'
import Button from '../common/Button'
import SocialIcons from '../common/SocialIcons'
import Logo from '../common/Logo'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className='bg-[#292930] z-30 text-center md:text-start text-white border-t py-12'>

            <div className="flex flex-col md:flex-row gap-6 !max-w-[90rem] container justify-between items-center py-8">
                <h2 className="text-2xl lg:text-4xl font-semibold max-w-[40rem]">Register to List & <span className='leading-normal'>Grow Your</span> Amazing Website <span className='leading-normal'>using</span> Posts.Site.</h2>
                <Button text='Post Your Website now!' yellow />
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-between !max-w-[90rem] border-[#3b3b44] container border-t items-center py-8">
                <p className='text-lg font-medium'>Copyright &copy; 2022 Posts.site | All rights reserved.</p>
                <ul className=" flex underline gap-4 md:gap-12 items-center">
                    <li className='hidden sm:flex'>
                        <Link href='/about' legacyBehavior>
                            <a className=' hover:text-yellow-400 font-medium'>
                                About Us
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/privacy-policy' legacyBehavior>
                            <a className=' hover:text-yellow-400 font-medium'>
                                Privacy Policy
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/terms-conditions' legacyBehavior>
                            <a className=' hover:text-yellow-400 font-medium'>
                                Terms & Conditions
                            </a>
                        </Link>
                    </li>

                </ul>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-between  !max-w-[90rem] border-[#3b3b44] container border-t items-center pt-8">
                <Logo />
                <SocialIcons />
            </div>
        </footer>
    )
}

export default Footer