import { Divider } from '@mui/material'
import Image from 'next/image'
import PostCard from '../../common/PostCard'
import Link from 'next/link';
import React from 'react'

const UserProfile = ({ user, selected }) => {
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="flex flex-col w-full">

            {selected?.relatedTo &&
                <div className="p-6 w-full">
                    <PostCard data={selected?.relatedTo} notPost />

                </div>
            }
            <Divider />
            <div className="rounded bg-white w-full h-fit flex flex-col gap-6 p-6">
                <div className='relative mx-auto aspect-square max-w-[10rem] w-full h-full'>
                    <Image src='/images/user_default.png' alt='user_pic' fill />
                </div>
                <h3 className="text-xl text-center lg:text-2xl font-semibold">{selected?.user?._id === user._id ? selected?.seller?.username : selected?.user?.username}</h3>
                <Divider />
                <div className="flex flex-col gap-4">

                    <div className="flex items-center justify-between">
                        <span>
                            Email
                        </span>
                        <span className='truncate'>
                            {selected?.user?._id === user._id ? selected?.seller?.email : selected?.user?.email}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>
                            Country
                        </span>
                        <span className='truncate'>
                            {selected?.user?._id === user._id ? selected?.seller?.country : selected?.user?.country}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>
                            Joined On
                        </span>
                        <span className='truncate'>
                            {(new Date(selected?.user?._id === user._id ? selected?.seller?.createdAt : selected?.user?.createdAt?.createdAt).toLocaleDateString("en-US", options))}
                        </span>
                    </div>
                </div>
                <Divider />
            </div>
        </div>
    )
}

export default UserProfile