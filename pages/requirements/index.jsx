import { Divider } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { GrLanguage } from 'react-icons/gr'
import { useState } from 'react'
import Button from '../../components/common/Button'
import Layout from '../../components/_App/Layout'
import { useRecoilState } from 'recoil'
import { relatedState, sellerState } from '../../utils/atoms'
import { useRouter } from 'next/router'

const index = ({ user }) => {
    const [requirements, setRequirements] = useState([])
    const router = useRouter()
    const [related, setRelated] = useRecoilState(relatedState)
    const [seller, setSeller] = useRecoilState(sellerState)
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('/api/requirement', {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                })
                setRequirements(res.data.reqs)
            } catch (error) {
                alert(error.message)
            }
        })();
    }, [])

    const goToInbox = (req) => {
        setRelated(req)
        setSeller(req.user)
        router.push(user && user.token ? `/profile/chat/${req.user._id}?source=requirements` : '/login')
    }

    return (
        <Layout user={user}>
            <div className="flex flex-col gap-4 container  py-6">
                <div className="flex flex-col gap-3">
                    <h1 className='text-2xl lg:text-4xl font-semibold'>Requirements</h1>
                    <div className="w-full h-1 max-w-[4rem] bg-themeColor"></div>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requirements.map(req => (
                        <div className="flex flex-col gap-2 p-4 border shadow-md bg-white" key={req._id}>
                            <div className="flex items-center gap-3">
                                <div className='relative aspect-square w-12 h-12'>
                                    <Image src='/images/user_default.png' alt='user_pic' fill />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-xl text-center font-semibold">{req.user.username}</h2>
                                </div>
                                <span className='ml-auto'>{new Date(req.createdAt).toLocaleDateString("en-IN")}</span>
                            </div>
                            <p className="text-base">{req.description.slice(0, 200)}...</p>
                            <div className="flex flex-col">
                                <div className=" pb-2 flex flex-wrap gap-2">
                                    <div className="bg-gray-200 flex items-center gap-2 rounded-full p-1 px-3 text-base">
                                        <span> <GrLanguage /></span>
                                        <span> {req.language}</span>
                                    </div>
                                    <div className="bg-gray-200 text-black flex items-center gap-2 rounded-full p-1 px-3 text-base">
                                        <span>Price: $ {req.price}</span>
                                    </div>
                                    <div className="bg-gray-200 text-black flex items-center gap-2 rounded-full p-1 px-3 text-base">
                                        <span>Delivery: {req.time_of_delivery} days</span>
                                    </div>
                                    <div className="bg-gray-200 text-black flex items-center gap-2 rounded-full p-1 px-3 text-base">
                                        <span>Category: {req.category}</span>
                                    </div>
                                </div>
                                {req.user._id === user._id ? '' :
                                    <button onClick={() => goToInbox(req)} >
                                        <Button fluid text='Contact User' />
                                    </button>
                                }

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default index