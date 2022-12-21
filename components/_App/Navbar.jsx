import React, { useState } from 'react'
import { MdMenu, MdClose } from 'react-icons/md'
import Logo from '../common/Logo'
import Button from '../common/Button'
import PostWebsiteBtn from '../common/PostWebsiteBtn'
import Link from 'next/link'
import Image from 'next/image'
import { Router, useRouter } from 'next/router'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CgProfile } from 'react-icons/cg';
import { HiOutlineMail } from 'react-icons/hi';
import { BiAddToQueue } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material'
import cookie from "js-cookie";


const Navbar = ({ user }) => {
    const [open, setOpen] = useState(false)

    const [anchorEl, setAnchorEl] = React.useState(null);
    const profileDrop = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const router = useRouter()
    Router.events.on('routeChangeStart', () => setOpen(false));
    const handleLogout = () => {
        cookie.remove("user");
        cookie.remove("token");
        router.push('/')
    };
    return (
        <>
            <div style={{ boxShadow: ' -4px 8px 19px -3px rgb(168 182 218 / 32%)' }} className={`fixed md:hidden bg-white h-fit w-full z-50 ${!open ? 'top-[-70%]' : 'top-20'} border-t transition-all duration-500 black`}>
                <nav className='flex flex-col w-full'>
                    <ul className='flex flex-col w-full'>
                        <li >
                            <Link href='/' legacyBehavior>
                                <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                    Home
                                </a>
                            </Link>
                        </li>
                        <li >
                            <Link href='/' legacyBehavior>
                                <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                    About Us
                                </a>
                            </Link>
                        </li>
                        <li >
                            <Link href='/' legacyBehavior>
                                <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                    Contact Us
                                </a>
                            </Link>
                        </li>
                        {user && user?.email && user?.token ?
                            <>
                                <li>
                                    <Link href='/post-service' legacyBehavior>
                                        <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                            Post a Site
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/post-service' legacyBehavior>
                                        <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                            Profile
                                        </a>
                                    </Link>
                                </li>
                                <li onClick={handleLogout}>
                                    <a className='p-6 hover:bg-gray-100 border-b block !min-w-full active:bg-gray-100 font-medium'>
                                        Logout
                                    </a>
                                </li>
                            </>
                            :
                            <li className='grid grid-cols-2 gap-4 px-4 py-2.5'>
                                <Link href='/login' legacyBehavior>
                                    <a className="block">
                                        <Button fluid gray text='Login' />
                                    </a>
                                </Link>
                                <Link href='/register' legacyBehavior>
                                    <a className="block">
                                        <Button fluid text='Register' />
                                    </a>
                                </Link>
                            </li>
                        }
                    </ul>
                </nav>
            </div>
            <div className={`sticky inset-0 bg-white ${open ? 'shadow-none' : 'shadow-theme'} z-50 `}>
                <header className='py-3 !max-w-[100rem] container relative flex items-center justify-between'>
                    <Logo />
                    <div className="flex gap-4">
                        <nav className='hidden md:flex items-center'>
                            <ul className='flex items-center gap-10 pr-4'>
                                <li>
                                    <Link href='/' legacyBehavior>
                                        <a className='link font-medium'>
                                            Home
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/' legacyBehavior>
                                        <a className='link font-medium'>
                                            About Us
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/' legacyBehavior>
                                        <a className='link font-medium'>
                                            Contact Us
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className="md:flex items-center gap-4 hidden">
                            {user && user?.email && user?.token ?
                                <>
                                    <Link href={`/profile/chat`} legacyBehavior>
                                        <a className='w-[50px] flex items-center justify-center hover:bg-themeColor cursor-pointer hover:text-white text-xl h-[50px] border rounded-md shadow-theme bg-white'>
                                            <HiOutlineMail />
                                        </a>
                                    </Link>
                                    <PostWebsiteBtn />
                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={profileDrop ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={profileDrop ? 'true' : undefined}>
                                                <Image alt="image" width={50} height={50} src="/images/user_default.png" />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={profileDrop}
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: 'visible',
                                                    minWidth: 200,
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                    mt: 1.5,
                                                    '& .MuiAvatar-root': {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                    '&:before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'background.paper',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem >
                                                <Link href='/profile/dashboard' legacyBehavior>
                                                    <a className='flex items-center gap-3'><CgProfile className='text-xl' /> <span>{'Profile'}</span></a>
                                                </Link>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem >

                                                <Link href='/profile/chat' legacyBehavior>
                                                    <a className='flex items-center gap-3'><HiOutlineMail className='text-xl' /> <span>{'My Inbox'}</span></a>
                                                </Link>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem >

                                                <Link href='/post-service' legacyBehavior>
                                                    <a className='flex items-center gap-3'><BiAddToQueue className='text-xl' /> <span>{'Post a Site'}</span></a>
                                                </Link>
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleLogout}>
                                                <a className='flex items-center gap-3'><MdLogout className='text-xl' /> <span>{'Logout'}</span></a>
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </>
                                :
                                <>
                                    <Link href='/login' legacyBehavior>
                                        <a className='hidden md:flex'>
                                            <Button gray text='Login' />
                                        </a>
                                    </Link>
                                    <Link href='/register' legacyBehavior>
                                        <a className='hidden md:flex'>
                                            <Button text='Register' />
                                        </a>
                                    </Link>
                                </>
                            }
                        </div>
                        {user && user?.email && user?.token &&
                            <Link href={`/profile/chat`} legacyBehavior>
                                <a className='w-[50px] flex md:hidden items-center justify-center hover:bg-themeColor cursor-pointer hover:text-white text-xl h-[50px] border rounded-md shadow-theme bg-white'>
                                    <HiOutlineMail />
                                </a>
                            </Link>
                        }
                        <div onClick={() => setOpen(!open)} className="w-[50px] flex md:hidden items-center justify-center hover:bg-themeColor cursor-pointer hover:text-white text-2xl h-[50px] rounded-md shadow-theme bg-white">
                            {open ? <MdClose /> : <MdMenu />}
                        </div>
                    </div>
                </header>
            </div >
        </>
    )
}

export default Navbar