import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import Button from '../../../../components/common/Button'
import Layout from '../../../../components/_App/Layout'
import Meta from '../../../../components/_App/Meta';
import { relatedState, sellerState } from '../../../../utils/atoms';

const Id = ({ user, id }) => {
    const [website, setWebsite] = useState({})
    const [data, setData] = useState({})
    const [websiteOwner, setWebsiteOwner] = useState({})
    const [related, setRelated] = useRecoilState(relatedState)
    const [seller, setSeller] = useRecoilState(sellerState)
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const [admin, setAdmin] = useState(false)
    const router = useRouter()


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        (async () => {
            if (user && user._id) {
                const userData = await axios.get('/api/user/getUser?id=' + user._id)
                if (userData && userData.data.user.isAdmin) {
                    setAdmin(true)
                } else {
                    router.push('/')
                }
            } else {
                router.push('/')
            }
        })()
    }, [user])

    const getWebsite = async (id) => {
        const res = await axios.get(`/api/websites/${id.split('-')[0]}`);
        const websiteData = res.data.website || {}
        const userData = res.data.user || {}
        setWebsite(websiteData)
        setData(websiteData)
        setWebsiteOwner(userData)

    }
    useEffect(() => {
        (async () => {
            getWebsite(id)
        })()
    }, [id])

    const handleUpdateWebsite = async () => {
        const res = await axios.put(`/api/admin/website`, data, {
            headers: {
                authorization: `Bearer ${user?.token}`,
            },
        });
        if (res && res.status === 200) {
            alert('Changes made successfully!')
        } else {
            alert('Something went wrong!')
        }
    }

    return (
        <>
            <Meta title={website?.siteURL?.replace('https://', '') + ' by @' + websiteOwner?.username} />
            <Layout user={user}>
                <div className="bg-gray-50 justify-center flex gap-4 py-6 min-h-screen">
                    <div className="container !max-w-[60rem] md:!px-4 !px-0 flex flex-col">
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
                                <textarea name="description" className='input' id="description" onChange={handleChange} cols="30" rows="20" value={data?.description}></textarea>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="status">Status</label>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="status"
                                    id="status"
                                    value={'both'}
                                    onChange={(e) => setData({ ...data, status: e.target.value })}
                                >
                                    <FormControlLabel checked={data.status === 'do_follow'} value="do_follow" control={<Radio />} label="Do Follow" />
                                    <FormControlLabel checked={data.status === 'no_follow'} value="no_follow" control={<Radio />} label="No Follow" />
                                    <FormControlLabel checked={data.status === 'both'} value="both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </div>
                            <Divider />
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={handleUpdateWebsite}>
                                    <Button fluid text='Save Changes' />
                                </button>
                                <Link href='/admin/dashboard/'>
                                    <Button fluid text='Discard' gray />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </Layout>
        </>
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