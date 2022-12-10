import { Divider } from '@mui/material'
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import Button from '../../../components/common/Button'
import Layout from '../../../components/_App/Layout'
import Meta from '../../../components/_App/Meta';
import { relatedState, sellerState } from '../../../utils/atoms';

const Id = ({ user, id }) => {
    const [website, setWebsite] = useState({})
    const [websiteOwner, setWebsiteOwner] = useState({})
    const [related, setRelated] = useRecoilState(relatedState)
    const [seller, setSeller] = useRecoilState(sellerState)
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

    const router = useRouter()
    const getWebsite = async (id) => {
        const res = await axios.get(`/api/websites/${id.split('-')[0]}`);
        const websiteData = res.data.website || {}
        const userData = res.data.user || {}
        setWebsite(websiteData)
        setWebsiteOwner(userData)
    }
    useEffect(() => {
        (async () => {
            getWebsite(id)
        })()
    }, [id])

    const goToInbox = () => {
        setRelated(website)
        setSeller(websiteOwner)
        router.push(user && user.token ? `/profile/chat/${websiteOwner._id}` : '/login')
    }

    return (
        <>
            <Meta title={website?.siteURL?.replace('https://', '') + ' by @' + websiteOwner?.username} />
            <Layout user={user}>
                <div className="bg-gray-50 justify-center flex gap-4 py-6 min-h-screen">
                    <div className="container md:!px-4 !px-0 flex flex-col lg:grid lg:grid-cols-6 gap-6">
                        <div className="lg:col-span-4 flex flex-col gap-6 shadow-theme rounded p-3 md:p-8 bg-white">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl lg:text-2xl font-semibold">{website?.siteURL}</h1>
                                <span className='truncate'>
                                    {(new Date(website?.createdAt).toLocaleDateString("en-US", options))}
                                </span>
                            </div>
                            <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden relative">
                                <Image src={website?.image || '/images/dummy.png'} className='object-cover object-top ' alt='img' fill />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="text-lg lg:text-xl font-semibold">Description:</h4>
                                <p className="text-base">
                                    {website?.description}
                                </p>
                            </div>
                            <Details website={website} />
                        </div>
                        <div className="col-span-2 h-fit rounded lg:sticky flex flex-col gap-6 top-24 right-0">
                            <div className="rounded bg-white shadow-theme w-full h-full flex flex-col gap-6 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="py-2 px-8 bg-themeColor rounded-full text-white">
                                        Active
                                    </div>
                                    <span className="text-2xl lg:text-4xl font-bold">$ {website?.price}.00</span>
                                </div>
                                <Divider />
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-lg lg:text-xl font-semibold">Extra:</h4>
                                    <p className="text-base">
                                        There are no extra services for this site.
                                    </p>
                                </div>
                                <Divider />
                                <button onClick={goToInbox}  >
                                    <Button text='Contact User' fluid />
                                </button>
                            </div>

                            <div className="rounded bg-white shadow-theme w-full h-full flex flex-col gap-6 p-6">
                                <div className='relative mx-auto aspect-square max-w-[10rem] w-full h-full'>
                                    <Image src='/images/user_default.png' alt='user_pic' fill />
                                </div>
                                <h3 className="text-xl text-center lg:text-2xl font-semibold">{websiteOwner?.username}</h3>
                                <Divider />
                                <div className="flex flex-col gap-4">

                                    <div className="flex items-center justify-between">
                                        <span>
                                            Email
                                        </span>

                                        <span className='truncate'>
                                            {websiteOwner?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Country
                                        </span>
                                        <span className='truncate'>
                                            {websiteOwner?.country}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Joined On
                                        </span>
                                        <span className='truncate'>
                                            {(new Date(websiteOwner?.createdAt).toLocaleDateString("en-US", options))}
                                        </span>
                                    </div>
                                    <Divider />
                                    <Link href='/profile/[id]' as={`/profile/${websiteOwner._id}-${websiteOwner.username}`}>
                                        <Button text='View My Profile' fluid />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

const Details = ({ website }) => {
    return (
        <div className='flex flex-col gap-6'>
            <div className="grid gap-4 grid-cols-2">
                <Button text={`Do follow - ${website?.status === 'both' || 'do_follow' ? 'Yes' : 'No'}`} />
                <Button text={`No follow - ${website?.status === 'both' || 'no_follow' ? 'Yes' : 'No'}`} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3  2xl:grid-cols-3 gap-6">
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.da || 'N/A'}</h3>
                    <Button text='Site Page Authority' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.pa || 'N/A'}</h3>
                    <Button text='Site Domain Authority' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.mozrank || 'N/A'}</h3>
                    <Button text='Site Moz Rank' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.fb_shares || 'N/A'}</h3>
                    <Button text='Fb Shares' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.fb_reac || 'N/A'}</h3>
                    <Button text='Fb Reactions' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.fb_comments || 'N/A'}</h3>
                    <Button text='Fb Comments' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.links || 'N/A'}</h3>
                    <Button text='Links In' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.equity || 'N/A'}</h3>
                    <Button text='Equity' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_hlinks || 'N/A'}</h3>
                    <Button text='Semrush hostname Links' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_costs || 'N/A'}</h3>
                    <Button text='Semrush Costs' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_dlinks || 'N/A'}</h3>
                    <Button text='Semrush Domain Links' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_kwords || 'N/A'}</h3>
                    <Button text='Semrush Keywords Number' fluid notBtn />
                </div>

                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_rank || 'N/A'}</h3>
                    <Button text='Semrush Rank' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_traffic || 'N/A'}</h3>
                    <Button text='Semrush Traffic' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{website?.site_stats?.sr_ulinks || 'N/A'}</h3>
                    <Button text='Semrush URL Links' fluid notBtn />
                </div>
            </div>
        </div>
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

export default Id