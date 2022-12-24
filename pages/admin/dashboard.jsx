import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Layout from '../../components/_App/Layout'
import PostCard from '../../components/common/PostCard'

const dashboard = ({ user }) => {
    const router = useRouter()
    const [posts, setPosts] = useState([])
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
    }, [user])

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
            <div className=" mt-8 flex flex-col gap-2 text-center items-center">
                <h2 className="text-2xl lg:text-3xl font-semibold">All Posts</h2>
                <div className="mx-auto w-full max-w-[8rem] rounded h-[6px] bg-themeColor"></div>
            </div>
            <div className="grid my-8 grid-cols-3 gap-6 container">
                {posts.map(item => (
                    <PostCard handleDelete={handleDelete} data={item} adminPage />
                ))}
            </div>
        </Layout>
    )
}

export default dashboard