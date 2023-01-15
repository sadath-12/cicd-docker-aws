import React from 'react'
import Button from '../../common/Button'
import Link from 'next/link'

const Hero = ({ user }) => {
    return (
        <div className='min-h-[25rem] md:min-h-[35em]  w-full relative overflow-hidden' >
            <video loop muted autoPlay className="absolute w-full h-full object-cover" >
                <source src='/images/hero_video.mp4' />
            </video>
            <div style={{ background: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))' }} className="absolute items-center h-full flex flex-col justify-center min-h-[25rem] md:min-h-[35em] z-20 inset-0 text-center gap-6">
                <h1 className='text-3xl lg:text-5xl font-semibold text-white max-w-[60rem]'>{user && user.token ? '' : 'Register to'} List & Grow Your Amazing Website using <span className='leading-normal'>Our website</span></h1>
                <p className="text-white hidden md:flex text-base lg:text-lg text-center  max-w-[50rem]">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure perspiciatis tempore magnam. Obcaecati tempore dolore ut praesentium architecto eius distinctio iste autem repudiandae consectetur? Maiores rerum quibusdam.
                </p>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <Link href='/#posts' legacyBehavior>
                        <a >
                            <Button gray text='View Posts' />
                        </a>
                    </Link>
                    <Link href='/post-service' legacyBehavior>
                        <a >
                            <Button yellow text='List My Website' />
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Hero