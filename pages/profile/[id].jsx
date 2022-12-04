import { Divider } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import PostWebsiteBtn from '../../components/common/PostWebsiteBtn'
import Layout from '../../components/_App/Layout'
import PostCard from '../../components/common/PostCard'
import axios from 'axios'

const dashboard = ({ user, id }) => {
    const [websites, setWebsites] = useState([])
    const [websiteOwner, setWebsiteOwner] = useState({})
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

    const getData = async (id) => {
        const res = await axios.get(`/api/user/getUser?id=${id}&&websites=true`);
        const websiteData = res.data.websites || []
        const userData = res.data.user || {}
        setWebsites(websiteData)
        setWebsiteOwner(userData)
    }

    useEffect(() => {
        (async () => {
            getData(id)
        })()
    }, [id])
    return (
        <Layout user={user}>
            <div className="flex flex-col bg-gray-50 py-6 gap-6">

                <div className="container">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 md:col-span-3 lg:col-span-2 h-fit md:sticky md:top-24 md:left-0">
                            <div className="rounded bg-white shadow-theme w-full h-full flex flex-col gap-6 p-6">
                                <div className='relative mx-auto aspect-square max-w-[10rem] w-full h-full'>
                                    <Image src='/images/user_default.png' alt='user_pic' fill />
                                </div>
                                <h3 className="text-xl text-center lg:text-2xl font-semibold">aman_pandey</h3>
                                <Divider />
                                <div className="flex flex-col gap-4">

                                    <div className="flex items-center justify-between">
                                        <span>
                                            Email
                                        </span>

                                        <span className='truncate'>
                                            amanpandey@gmail.com
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Country
                                        </span>
                                        <span className='truncate'>
                                            India
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Joined On
                                        </span>
                                        <span className='truncate'>
                                            Fri, December 2, 2022
                                        </span>
                                    </div>
                                    <div className="py-2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-3 lg:col-span-4 flex flex-col gap-6">
                            <div className="flex px-5 py-2 items-center justify-between bg-white shadow-theme">
                                <h3 className='text-xl lg:text-2xl font-semibold'>Aman's Websites</h3>
                                <PostWebsiteBtn />
                            </div>
                            <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-theme">
                                {websites?.map(item => (
                                    <PostCard data={item} key={item._id} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
export async function getServerSideProps({ params }) {
    const { id } = params
    return {
        props: {
            id: id.split('-')[0],
        },
    }
}

export default dashboard