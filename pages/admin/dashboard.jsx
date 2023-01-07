import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Layout from '../../components/_App/Layout'
import PostCard from '../../components/common/PostCard'
import Create from '../../components/Pages/Admin/Create'
import Users from '../../components/Pages/Admin/Users'

const dashboard = ({ user }) => {
    const router = useRouter()
    const [posts, setPosts] = useState([])
    const [selected, setSelected] = useState('posts')
    const [loading, setLoading] = useState(true)
    const [admin, setAdmin] = useState(false)
    useEffect(() => {
        (async () => {
            if (user && user._id) {
                const userData = await axios.get('/api/user/getUser?id=' + user._id)
                if (userData && userData.data.user.isAdmin) {
                    const response = await axios.get(`/api/websites?price_from=0&price_to=10000&year_from=0&year_to=100&da_from=0&da_to=100&pa_from=0&pa_to=100&dr_from=0&dr_to=100&traffic_from=0&traffic_to=1000000000&link_type=&category=all&language=all`)
                    setPosts(response.data.websites);
                    setAdmin(true)

                } else {
                    router.push('/')
                }
            }
            else {
                router.push('/')
            }

        })()
    }, [user, selected])

    const handleDelete = async (data) => {
        if (
            user && user?.token && confirm('Do you really want to delete this post? site-> ' + data.siteURL)
        ) {
            const response = await axios.delete(`/api/admin/website?id=${data._id}`, {
                headers: {
                    authorization: `Bearer ${user?.token}`,
                },
            })
            if (response && response.status === 200) {
                alert('deleted Successfully')
                let postArr = posts.filter(post => post._id != data._id)
                setPosts(postArr)
            } else {
                alert('Something Went wrong')
            }
        }

    }


    return (
        <Layout user={user}>
            <div className="container bg-white border-y mt-2 flex items-center">
                <a onClick={() => setSelected('posts')} className={`cursor-pointer text-base ${selected === 'posts' ? 'border-r bg-gray-100 ' : 'bg-white border-none'} p-6`}>Posts</a>
                <a onClick={() => setSelected('users')} className={`cursor-pointer text-base ${selected === 'users' ? 'border-r bg-gray-100 ' : 'bg-white border-none'} p-6`}>Users</a>
                <a onClick={() => setSelected('create')} className={`cursor-pointer text-base ${selected === 'create' ? 'border-r bg-gray-100 ' : 'bg-white border-none'} p-6`}>Create A Post</a>
            </div>
            {selected === 'posts' ?
                <div className="grid my-8 grid-cols-3 gap-6 container">
                    {posts.map(item => (
                        <PostCard handleDelete={handleDelete} data={item} adminPage />
                    ))}
                </div>
                : selected === 'users' ?
                    <Users user={user} />
                    :
                    <Create user={user} />
            }
        </Layout>
    )
}

export default dashboard