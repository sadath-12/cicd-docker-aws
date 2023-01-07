import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai'
import { BsTrashFill } from 'react-icons/bs'

const PostCard = ({ data, adminPage, handleDelete, notPost }) => {
    return (
        adminPage ?
            <div className='flex flex-col pb-4 rounded-md gap-4'>
                <div className="aspect-[1.9] bg-gray-300 overflow-hidden rounded-xl relative w-full h-sull">
                    <Image src={data?.image || '/images/dummy.png'} className='object-cover hover:scale-105 transition-all duration-300' alt={data?.title} fill />
                    <div className="absolute w-full h-full inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.041), rgba(0,0,0,0.1))' }}></div>
                </div>
                <div className="flex items-center justify-between">
                    <Link href={data?.siteURL} legacyBehavior target={'_blank'}>
                        <a target={'_blank'} className="text-lg lg:text-xl truncate font-semibold">{data?.siteURL?.replace("https://", "")}</a>
                    </Link>
                    {!notPost && <div className="flex gap-1 pl-3 opacity-90 items-center">
                        <AiFillEye className='text-xl' />
                        <span className='font-semibold '>{data?.site_stats?.sr_traffic === 'notfound' || 'unknown' ? 0 : data?.site_stats?.sr_traffic}</span>
                    </div>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="w-full bg-themeColor text-white rounded-3xl py-2 px-6 text-center font-semibold">
                        $ {data?.price}.00
                    </div>
                    <div onClick={() => handleDelete(data)} className="w-full flex cursor-pointer gap-2 items-center bg-red-500 text-white rounded-3xl py-2 px-6 text-center font-semibold">
                        <BsTrashFill /> <span>Delete</span>
                    </div>
                    <Link href={`/admin/website/[id]`} as={`/admin/website/${data?._id}-${data?.siteURL.replace('https://', '')}`} legacyBehavior>
                        <a className="w-full flex gap-2 items-center bg-gray-200 rounded-3xl active:bg-gray-400 hover:bg-gray-300 py-2 px-6 text-center font-semibold">
                            <AiOutlineEdit />  <span>Edit</span>
                        </a>
                    </Link>
                </div>
            </div >
            :
            <div className='flex flex-col pb-4 rounded-md gap-4'>
                <div className="aspect-[1.9] bg-gray-300 overflow-hidden rounded-xl relative w-full h-sull">
                    <Image src={data?.image || '/images/dummy.png'} className='object-cover hover:scale-105 transition-all duration-300' alt={data?.title} fill />
                    <div className="absolute w-full h-full inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.041), rgba(0,0,0,0.1))' }}></div>
                </div>
                <div className="flex items-center justify-between">
                    <Link href={data?.siteURL} legacyBehavior target={'_blank'}>
                        <a target={'_blank'} className="text-lg lg:text-xl truncate font-semibold">{data?.siteURL?.replace("https://", "")}</a>
                    </Link>
                    {!notPost && <div className="flex gap-1 pl-3 opacity-90 items-center">
                        <AiFillEye className='text-xl' />
                        <span className='font-semibold '>{data?.site_stats?.sr_traffic === 'notfound' || 'unknown' ? 0 : data?.site_stats?.sr_traffic}</span>
                    </div>}
                </div>
                {!notPost ?
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full bg-themeColor text-white rounded-3xl py-2 px-6 text-center font-semibold">
                            $ {data?.price}.00
                        </div>
                        <Link href={`/website/[id]`} as={`/website/${data?._id}-${data?.siteURL.replace('https://', '')}`} legacyBehavior>
                            <a className="w-full bg-gray-200 rounded-3xl active:bg-gray-400 hover:bg-gray-300 py-2 px-6 text-center font-semibold">
                                View Details
                            </a>
                        </Link>
                    </div> :
                    <Link href={`/website/[id]`} as={`/website/${data?._id}-${data?.siteURL.replace('https://', '')}`} legacyBehavior>
                        <a className="w-full bg-gray-200 rounded-3xl active:bg-gray-400 hover:bg-gray-300 py-2 px-6 text-center font-semibold">
                            View Details
                        </a>
                    </Link>
                }
            </div >
    )
}

export default PostCard