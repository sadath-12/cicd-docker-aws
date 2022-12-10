import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'

const Sidebar = ({ user, selected, setSelected, conversations, id }) => {
    const router = useRouter()
    const [searchedText, setSearchedText] = useState('')
    const [conversationToShow, setConversationsToShow] = useState([])
    useEffect(() => {
        if (searchedText.trim().length > 0) {
            const filtered = conversations.filter(conv => conv.seller.username.includes(searchedText) || conv.user.username.includes(searchedText))
            setConversationsToShow(filtered)
        } else {
            setConversationsToShow(conversations)
        }
    }, [searchedText, selected])

    return (
        <div className="h-full flex flex-col">
            <div className="sticky inset-0 z-10 w-full bg-white p-2 border-b shadow-sm">
                <input onChange={(e) => setSearchedText(e.target.value)} type="search" placeholder='Search for a username' className='input w-full' />
            </div>
            <div className='h-full flex flex-col'>
                {conversationToShow?.map((convo, index) => (
                    <div onClick={() => { setSelected(convo), router.push(`/profile/chat/${convo._id}`) }} key={index} className='cursor-pointer'>
                        <a className={`${convo._id === selected?._id ? 'bg-blue-100 cursor-pointer hover:bg-blue-100' : 'bg-white'} py-3 flex hover:bg-gray-100 items-center gap-3 px-6 bg-white border-b`}>
                            <div className='relative aspect-square max-w-[3rem] w-full h-fit'>
                                <Image src='/images/user_default.png' alt='user_pic' fill />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className='text-base font-semibold'>{convo?.seller?._id === user._id ? convo?.user?.username : convo?.seller?.username}</p>
                                <p className='text-sm'>{convo?.messages?.length > 0 ? convo?.messages[convo?.messages?.length].message : 'Start by clicking here.'}</p>
                            </div>
                        </a>
                    </div>
                ))}

            </div>
        </div>
    )
}
export default Sidebar