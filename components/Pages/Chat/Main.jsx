import { IconButton } from '@mui/material'
import { BsChevronLeft } from 'react-icons/bs'
import axios from 'axios'
import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import io from "socket.io-client";
import Image from 'next/image'
import { MdOutlineRefresh } from 'react-icons/md'

const Main = ({ selected, getChats, active, setActive, setChats, user, chats }) => {
    const [initialized, setInitialized] = useState(false)
    const [incomingMsg, setIncomingMsg] = useState(null)
    const [acc, setAcc] = useState(null)
    const [message, setMessage] = useState('')
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const messagesEndRef = useRef(null)
    let socket = useRef()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView()
    }

    const socketInitializer = async () => {
        await fetch("/api/socket");
        socket.current = io();
        setInitialized(true)
    };
    useEffect(() => {
        socketInitializer();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim().length > 0) {
            const msgSent = await axios.post('/api/chat/message', { recieverId: user._id === selected?.seller?._id ? selected?.user?._id : selected?.seller?._id, senderId: user._id, message, convoId: selected?._id },
                {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setMessage('')
            if (msgSent) {
                socket.current.emit('sendMessage', msgSent.data.messageCreated)
                setIncomingMsg(
                    msgSent.data.messageCreated
                )
            }
        } else {
            //
        }
    }

    useEffect(() => {
        if (initialized) {
            const userData = selected?.user?._id === user._id ? selected?.user : selected?.seller
            socket.current.emit('addUsers', userData)
            socket.current.on('getUsers', users => {
                setActive(users)
            })
        }
    }, [selected, initialized])

    useEffect(() => {
        scrollToBottom()
    }, [chats])
    useEffect(() => {
        console.log(active)
    }, [active])



    useEffect(() => {
        initialized && socket.current.on('getMessage', data => {
            setIncomingMsg({
                ...data, createdAt: new Date()
            })
        })
    }, [initialized])

    useEffect(() => {
        incomingMsg && selected?._id === incomingMsg.convoId && setChats(prev => [...prev, incomingMsg])
        console.log(incomingMsg)
    }, [incomingMsg, selected])
    useEffect(() => {
        setAcc(selected?.user?._id === user._id ? selected?.seller : selected?.user)
    }, [selected])

    return (
        <div className='flex flex-col h-full'>
            <div className="w-full items-center flex justify-start border-b bg-white z-20 shadow-sm sticky inset-0 px-2 md:px-[18px] py-[7px]">
                <div className="flex md:hidden">
                    <Link href={`/profile/chat`}>
                        <IconButton>
                            <BsChevronLeft />
                        </IconButton>
                    </Link>
                </div>
                <div className="flex gap-4 w-full items-center">
                    <div className='relative aspect-square w-12 h-12'>
                        <Image src='/images/user_default.png' alt='user_pic' fill />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl text-center font-semibold">{selected?.seller?._id === user?._id ? selected?.user?.username : selected?.seller?.username}</h2>
                        <small>
                            {active?.find(user => user._id === acc?._id) ? <p className='text-green-500 font-semibold'>Online</p> : <p className='text-red-500 font-semibold'>Offline</p>}
                            <div></div>
                        </small>
                    </div>
                    <button onClick={getChats} className="ml-auto flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-md border">
                        <span className='text-sm'>Refresh</span>
                        <MdOutlineRefresh className='text-xl' />

                    </button>

                </div>
            </div>
            <div className="flex justify-end flex-col flex-1 px-4 gap-2 py-6">
                <div className="pb-4 hidden md:flex items-center gap-2">
                    <div className="border-t w-full"></div>
                    <span className='flex-1 whitespace-nowrap'>{selected?.user?.username} started this conversation on &nbsp;
                        {(new Date(selected?.createdAt).toLocaleDateString("en-US", options))}
                    </span>
                    <div className="border-t w-full"></div>
                </div>
                {chats.map((item, index) => (
                    <Message senderId={item.senderId} chats={chats} idx={index} key={index} incoming={item.senderId != user._id} msg={item.message} time={item.createdAt} />
                ))}
                <div ref={messagesEndRef} ></div>
            </div>
            <div className="sticky inset-0 z-10 w-full bg-white p-2 border-t shadow-sm">
                {/* <input type="text" placeholder='Search for a username' className='input w-full' /> */}
                <form onSubmit={handleSendMessage} className="flex items-center justify-between w-full border-gray-300">
                    <input value={message} onChange={(e) => setMessage(e.target.value)} required type="text" placeholder="Start typing..."
                        className={`block w-full py-2 pl-4 mx-2 bg-gray-100 rounded-md border outline-none focus:text-gray-700`}
                        name="message" />
                    <button type="submit">
                        <IconButton>
                            <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </IconButton>
                    </button>
                </form>
            </div>
        </div >
    )
}

const Message = ({ incoming, chats, msg, idx, senderId, time }) => {
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <div className="flex flex-col gap-4">
            {new Date(chats[idx - 1]?.createdAt).getDate() != new Date(time).getDate() &&
                <div className="w-fit mx-auto py-1 px-3 rounded-md bg-gray-200 text-sm" >{new Date(time).toLocaleDateString("en-IN")}</div>
            }
            <div className={`flex whitespace-wrap text-sm items-end relative  gap-1 py-2.5  p-3 rounded-md   ${incoming ? 'bg-gray-200 text-black opacity-90 mr-auto' : 'bg-themeColor  text-white ml-auto'}`}>
                {msg}
                <div className="w-12"></div>
                {incoming ? <span className='absolute right-2 bottom-1'><small className='text-xs whitespace-nowrap h-fit !mt-2 opacity-90 right-2 !text-black ml-auto pl-2'>{formatAMPM(new Date(time))}</small></span> : <span className='absolute right-2 bottom-1'><small className='text-xs whitespace-nowrap h-fit !mt-2 opacity-90 right-2 !text-white ml-auto pl-2'>{formatAMPM(new Date(time))}</small></span>}
            </div>
        </div>
    )
}
export default Main