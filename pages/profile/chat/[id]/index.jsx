import React, { useState } from 'react'
import Main from '../../../../components/Pages/Chat/Main'
import Meta from '../../../../components/_App/Meta'
import Sidebar from '../../../../components/Pages/Chat/Sidebar'
import UserProfile from '../../../../components/Pages/Chat/UserProfile'
import Layout from '../../../../components/_App/Layout'
import axios from 'axios'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { relatedState, sellerState } from '../../../../utils/atoms'
import { useRouter } from 'next/router'

const index = ({ id, user }) => {
    const [conversations, setConversations] = useState([])
    const [selected, setSelected] = useState({})
    const [active, setActive] = useState([])
    const [chats, setChats] = useState([])
    const [sellerSelected, setSellerSelected] = useRecoilState(sellerState)
    const [relatedToWebsite, setRelatedToWebsite] = useRecoilState(relatedState)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const conversations = await axios.get('/api/chat/conversation',
                {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setConversations(conversations.data.convos)
            setSelected(conversations.data.convos.filter(conv => conv._id === id)[0])
            if (sellerSelected?._id) {
                const payload = {
                    seller: sellerSelected,
                    senderId: user._id,
                    recieverId: sellerSelected?._id,
                    relatedTo: relatedToWebsite,
                    user
                }
                const resselected = await axios.post('/api/chat/conversation', payload,
                    {
                        headers: {
                            authorization: `Bearer ${user?.token}`,
                        },
                    }
                )
                const conversations = await axios.get('/api/chat/conversation',
                    {
                        headers: {
                            authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
                setConversations(conversations.data.convos)
                setSelected(resselected?.data?.convo)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (selected && selected._id) {
                const chatsRes = await axios.get('/api/chat/message?id=' + selected?._id,
                    {
                        headers: {
                            authorization: `Bearer ${user?.token}`,
                        },
                    }
                );
                setChats(chatsRes.data.msgs)
            }
        })()
    }, [selected])



    return (
        <Layout noFooter user={user}>
            <Meta title='My Inbox' />
            <div className="grid container shadow-theme !px-0  rounded-xl overflow-hidden my-4 bg-white grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <div className="col-span-1 border md:flex flex-col hidden border-r-0 overflow-y-scroll rounded-l-xl chat_height">
                    <Sidebar active={active} setActive={setActive} setSelected={setSelected} conversations={conversations} selected={selected} id={id} user={user} />
                </div>
                <div className="col-span-2 border  chat_height overflow-y-scroll">
                    <Main active={active} setActive={setActive} setChats={setChats} chats={chats} id={id} selected={selected} user={user} />
                </div>
                <div className="col-span-1 border hidden lg:flex border-l-0 rounded-r-xl chat_height">
                    <UserProfile selected={selected} id={id} user={user} />
                </div>
            </div>
        </Layout>
    )
}
export async function getServerSideProps({ params }) {
    const { id } = params

    return {
        props: {
            id: id
        },
    }
}
export default index