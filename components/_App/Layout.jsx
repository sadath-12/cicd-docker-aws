import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, user, noFooter }) => {
    return (
        <div className={noFooter ? 'h-screen font-dm_Sans flex flex-col justify-betweeen' : 'min-h-screen font-dm_Sans flex flex-col justify-betweeen'}>
            <Navbar user={user} />
            <main className='flex-1'>
                {children}
            </main>
            {!noFooter &&
                <Footer user={user} />

            }
        </div>
    )
}

export default Layout