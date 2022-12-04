import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, user }) => {
    return (
        <div className='min-h-screen font-dm_Sans flex flex-col justify-betweeen'>
            <Navbar user={user} />
            <main className='flex-1'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout