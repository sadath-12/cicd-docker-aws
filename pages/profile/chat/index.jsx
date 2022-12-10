import React, { useState } from 'react'
import Main from '../../../components/Pages/Chat/Main'
import Meta from '../../../components/_App/Meta'
import Sidebar from '../../../components/Pages/Chat/Sidebar'
import UserProfile from '../../../components/Pages/Chat/UserProfile'
import Layout from '../../../components/_App/Layout'
import axios from 'axios'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { relatedState, sellerState } from '../../../utils/atoms'
import { useRouter } from 'next/router'

const index = ({ user }) => {
    const [conversations, setConversations] = useState([])
    const [selected, setSelected] = useState({})
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
        })()
    }, [])
    return (
        <Layout noFooter={conversations.length != 0} user={user}>
            <Meta title='My Inbox' />
            {conversations.length > 0 ?
                <div className="grid container shadow-theme !px-0  rounded-xl overflow-hidden my-4 bg-white grid-cols-1 md:grid-cols-4">
                    <div className="col-span-1 border border-r-0 overflow-y-scroll rounded-l-xl chat_height">
                        <Sidebar setSelected={setSelected} conversations={conversations} selected={selected} user={user} />
                    </div>
                    <div className="hidden col-span-3 md:flex items-center justify-center flex-col gap-4 border chat_height overflow-y-scroll">
                        <svg width="221" height="164" viewBox="0 0 221 164" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M73.5 145h146m-218.346-.189h22.001m45.729-60.106a8.779 8.779 0 100-17.557 8.779 8.779 0 100 17.557z" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M83.725 113.941v8.305H47.341l2.114-8.305h34.27z" fill="#1DBF73" stroke="#1DBF73" stroke-width="1.5" stroke-miterlimit="10" /><path d="M72.205 67.805s-1.618 10.328-10.848 12.618c0 0-3.329-6.946 1.863-11.213 4.03-3.29 8.985-1.405 8.985-1.405z" fill="#1C1D1F" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M49.944 111.575l-7.062 28.992 30.812 4.244-2.199 17.312m12.23-51.937l.802 34.624" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M73.388 147.191c8.642.962 27.04 4.061 28.338 7.046.283.649-.061 1.817-2.863 1.252-2.801-.565-12.68-2.771-12.68-2.771" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M75.373 162.153H70.42c-3.642 0-13.093-.367-22.231-1.008-7.558-.526-14.75-.923-19.543-4.29-10.589-7.435-2.52-25.457 1.526-45.372 4.879-24.19 22.918-21.137 35.782-20.961 10.97.13 22.566.763 25.337 11.724 2.772 10.962 2.207 28.786 2.207 28.786" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M85.504 157.001s9.16 1.366 12.444 1.931c3.557.611 4.702 3.344.42 3.481-4.283.137-7.1 0-7.1 0s-11.131-.191-18.956-.26" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M98.863 155.489c2.741.832 3.817 1.405 3.604 2.58-.298 1.489-3.398 1.145-3.398 1.145m-5.572-28.181l9-19.916 16.33 6.481-9.78 27.213m11.414-40.655s8.619-4.199 11.046-5.588c2.428-1.39 2.779-3.282 1.573-3.694-1.206-.413-16.032 6.106-16.032 6.106s1.237-.763 3-1.893c3.596-2.29 5.108-4.168 4.459-4.954-.649-.786-2.237-.16-3.222.23 0 0-9.291 4.58-11.711 7.869a66.593 66.593 0 00-5.534 9.488m18.062-4.267s5.137-2.344 9.863-4.939c4.725-2.595 5.489-4.03 4.993-4.931-.764-1.435-2.711-.153-5.451.985" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M118.827 117.598l2.412-5.252s9.772-5.61 12.406-7.633c2.633-2.023 1.862-3.779.45-3.412m18.697 24.38c-2.031-.29-5.909 0-8.902-2.236-2.03-1.527-2.183-5.87-.969-10.305.901-3.275 2.565-5.733 5.634-6.672 3.695-1.13 9.161-.504 15.466 1.023a63.17 63.17 0 007.085-1.969.4.4 0 01.463.089.405.405 0 01.064.468 48.51 48.51 0 00-1.985 5.389c3.199 5.885.641 12.778-2.741 14.244-4.397 1.885-10.298.519-14.115-.031zm-5.825-11.867l18.383-1.71m-17.65 6.062l17.65-1.145m18.491-72.855a29.288 29.288 0 014.313-.763 28.57 28.57 0 0130.167 20.677 28.559 28.559 0 01-14.897 33.4 28.574 28.574 0 01-35.543-8.627 28.56 28.56 0 012.074-36.511l.305-.344" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M177.467 56.601a7.58 7.58 0 10-7.581-7.58 7.58 7.58 0 007.581 7.58z" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M166.893 87.485s3.191-11.305 12.268-18.114l-2.794-3.93 14.505-12.1 3.26 3.703s12.917-6.504 18.223-3.993c0 0 4.038 4.023 6.565 12.214 2.458 7.946.168 18.64-9.359 28.144-11.329 11.297-26.644 6.396-31.835 3.816a30.132 30.132 0 01-10.833-9.74zm4.871-43.419s5.726 9.42 12.978 7.046c0 0 1.863-5.985-3.748-8.756a7.547 7.547 0 00-9.23 1.71zm10.444-5.144a2.784 2.784 0 004.841 1.198c.45-.529.686-1.206.663-1.9.283.045.572.045.855 0a2.778 2.778 0 00-.191-5.473 2.289 2.289 0 00-1.848-4.069 2.55 2.55 0 00-.526.19 3.441 3.441 0 00-5.247-1.41 3.446 3.446 0 00-1.197 1.67 3.06 3.06 0 00-2.33-.283 3.06 3.06 0 00-1.849 1.448 3.075 3.075 0 00-.284 2.33 3.073 3.073 0 001.448 1.849h-.237a2.542 2.542 0 001.069 4.962" fill="#1C1D1F" /><path d="M182.208 38.922a2.784 2.784 0 004.841 1.198c.45-.529.686-1.206.663-1.9.283.045.572.045.855 0a2.778 2.778 0 00-.191-5.473 2.289 2.289 0 00-1.848-4.069 2.55 2.55 0 00-.526.19 3.441 3.441 0 00-5.247-1.41 3.446 3.446 0 00-1.197 1.67 3.06 3.06 0 00-2.33-.283 3.06 3.06 0 00-1.849 1.448 3.075 3.075 0 00-.284 2.33 3.073 3.073 0 001.448 1.849h-.237a2.542 2.542 0 001.069 4.962" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M179.948 43.578a3.084 3.084 0 100-6.168 3.084 3.084 0 000 6.168z" fill="#1C1D1F" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M88.56 54.695s-6.81.283-8.643-1.267c-1.832-1.55-1.366-4.473-1.359-7.519 0-3.397.405-7.068 2.733-9.16 2.107-1.923 8.077-1.9 14.291-1.595 6.711.336 12.979.465 14.673 3.343.955 1.634.283 4.87.168 7.633-.16 3.909-.58 7.275-3.496 8.756C103.873 56.413 95.285 56 95.285 56l-7.344 7.725a.122.122 0 01-.198-.017.122.122 0 01-.016-.074l.832-8.939zm-2.902-7.778h18.704m-18.704-4.923h18.704" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /></svg>
                        <h3 className='text-xl lg:text-2xl font-semibold'>Pick up where you left off
                        </h3>
                        <p>Select a conversation and chat away.</p>
                    </div>
                </div>
                :
                <div className="col-span-3 flex items-center justify-center flex-col gap-4 border chat_height overflow-y-scroll">
                    <div className="flex bg-white shadow-theme rounded-2xl w-full max-h-[30rem] max-w-2xl  items-center justify-center flex-col gap-4 border chat_height overflow-y-scroll">
                        <svg width="221" height="164" viewBox="0 0 221 164" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M73.5 145h146m-218.346-.189h22.001m45.729-60.106a8.779 8.779 0 100-17.557 8.779 8.779 0 100 17.557z" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M83.725 113.941v8.305H47.341l2.114-8.305h34.27z" fill="#1DBF73" stroke="#1DBF73" stroke-width="1.5" stroke-miterlimit="10" /><path d="M72.205 67.805s-1.618 10.328-10.848 12.618c0 0-3.329-6.946 1.863-11.213 4.03-3.29 8.985-1.405 8.985-1.405z" fill="#1C1D1F" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M49.944 111.575l-7.062 28.992 30.812 4.244-2.199 17.312m12.23-51.937l.802 34.624" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M73.388 147.191c8.642.962 27.04 4.061 28.338 7.046.283.649-.061 1.817-2.863 1.252-2.801-.565-12.68-2.771-12.68-2.771" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M75.373 162.153H70.42c-3.642 0-13.093-.367-22.231-1.008-7.558-.526-14.75-.923-19.543-4.29-10.589-7.435-2.52-25.457 1.526-45.372 4.879-24.19 22.918-21.137 35.782-20.961 10.97.13 22.566.763 25.337 11.724 2.772 10.962 2.207 28.786 2.207 28.786" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M85.504 157.001s9.16 1.366 12.444 1.931c3.557.611 4.702 3.344.42 3.481-4.283.137-7.1 0-7.1 0s-11.131-.191-18.956-.26" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M98.863 155.489c2.741.832 3.817 1.405 3.604 2.58-.298 1.489-3.398 1.145-3.398 1.145m-5.572-28.181l9-19.916 16.33 6.481-9.78 27.213m11.414-40.655s8.619-4.199 11.046-5.588c2.428-1.39 2.779-3.282 1.573-3.694-1.206-.413-16.032 6.106-16.032 6.106s1.237-.763 3-1.893c3.596-2.29 5.108-4.168 4.459-4.954-.649-.786-2.237-.16-3.222.23 0 0-9.291 4.58-11.711 7.869a66.593 66.593 0 00-5.534 9.488m18.062-4.267s5.137-2.344 9.863-4.939c4.725-2.595 5.489-4.03 4.993-4.931-.764-1.435-2.711-.153-5.451.985" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M118.827 117.598l2.412-5.252s9.772-5.61 12.406-7.633c2.633-2.023 1.862-3.779.45-3.412m18.697 24.38c-2.031-.29-5.909 0-8.902-2.236-2.03-1.527-2.183-5.87-.969-10.305.901-3.275 2.565-5.733 5.634-6.672 3.695-1.13 9.161-.504 15.466 1.023a63.17 63.17 0 007.085-1.969.4.4 0 01.463.089.405.405 0 01.064.468 48.51 48.51 0 00-1.985 5.389c3.199 5.885.641 12.778-2.741 14.244-4.397 1.885-10.298.519-14.115-.031zm-5.825-11.867l18.383-1.71m-17.65 6.062l17.65-1.145m18.491-72.855a29.288 29.288 0 014.313-.763 28.57 28.57 0 0130.167 20.677 28.559 28.559 0 01-14.897 33.4 28.574 28.574 0 01-35.543-8.627 28.56 28.56 0 012.074-36.511l.305-.344" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M177.467 56.601a7.58 7.58 0 10-7.581-7.58 7.58 7.58 0 007.581 7.58z" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M166.893 87.485s3.191-11.305 12.268-18.114l-2.794-3.93 14.505-12.1 3.26 3.703s12.917-6.504 18.223-3.993c0 0 4.038 4.023 6.565 12.214 2.458 7.946.168 18.64-9.359 28.144-11.329 11.297-26.644 6.396-31.835 3.816a30.132 30.132 0 01-10.833-9.74zm4.871-43.419s5.726 9.42 12.978 7.046c0 0 1.863-5.985-3.748-8.756a7.547 7.547 0 00-9.23 1.71zm10.444-5.144a2.784 2.784 0 004.841 1.198c.45-.529.686-1.206.663-1.9.283.045.572.045.855 0a2.778 2.778 0 00-.191-5.473 2.289 2.289 0 00-1.848-4.069 2.55 2.55 0 00-.526.19 3.441 3.441 0 00-5.247-1.41 3.446 3.446 0 00-1.197 1.67 3.06 3.06 0 00-2.33-.283 3.06 3.06 0 00-1.849 1.448 3.075 3.075 0 00-.284 2.33 3.073 3.073 0 001.448 1.849h-.237a2.542 2.542 0 001.069 4.962" fill="#1C1D1F" /><path d="M182.208 38.922a2.784 2.784 0 004.841 1.198c.45-.529.686-1.206.663-1.9.283.045.572.045.855 0a2.778 2.778 0 00-.191-5.473 2.289 2.289 0 00-1.848-4.069 2.55 2.55 0 00-.526.19 3.441 3.441 0 00-5.247-1.41 3.446 3.446 0 00-1.197 1.67 3.06 3.06 0 00-2.33-.283 3.06 3.06 0 00-1.849 1.448 3.075 3.075 0 00-.284 2.33 3.073 3.073 0 001.448 1.849h-.237a2.542 2.542 0 001.069 4.962" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M179.948 43.578a3.084 3.084 0 100-6.168 3.084 3.084 0 000 6.168z" fill="#1C1D1F" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /><path d="M88.56 54.695s-6.81.283-8.643-1.267c-1.832-1.55-1.366-4.473-1.359-7.519 0-3.397.405-7.068 2.733-9.16 2.107-1.923 8.077-1.9 14.291-1.595 6.711.336 12.979.465 14.673 3.343.955 1.634.283 4.87.168 7.633-.16 3.909-.58 7.275-3.496 8.756C103.873 56.413 95.285 56 95.285 56l-7.344 7.725a.122.122 0 01-.198-.017.122.122 0 01-.016-.074l.832-8.939zm-2.902-7.778h18.704m-18.704-4.923h18.704" stroke="#1C1D1F" stroke-width="1.5" stroke-miterlimit="10" /></svg>
                        <h3 className='text-xl lg:text-2xl font-semibold'>Start a conversation and it will appear here.
                        </h3>
                    </div>
                </div>
            }
        </Layout >
    )
}

export default index