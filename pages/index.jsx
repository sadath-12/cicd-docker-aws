import Hero from '../components/Pages/Home/Hero'
import Meta from '../components/_App/Meta'
import PostCard from '../components/common/PostCard'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../components/_App/Layout';
import axios from 'axios';

const Home = ({ user }) => {
  const [hasMore, setHasMore] = useState(true)
  const [slicingInd, setSlicingInd] = useState(0)
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/websites?skip=${slicingInd}`)
      setSlicingInd(slicingInd + 9)
      if (response.data.moreThere) {
        setHasMore(true)
      } else {
        setHasMore(false)
      }
      setPosts(posts.concat(response.data.websites));
      console.log(response)
    } catch (err) {
      console.log('Something went wrong')
    }
  }
  useEffect(() => {
    (async () => {
      fetchPosts()
    })()
  }, [])
  return (
    <Layout user={user}>
      <Meta title='Home Page' />
      <Hero />
      <section id="posts" className='py-12 container lg:py-16 flex flex-col gap-8'>
        <div className="flex flex-col gap-2 text-center items-center">
          <h2 className="text-2xl lg:text-3xl font-semibold">Popular Posts</h2>
          <div className="mx-auto w-full max-w-[8rem] rounded h-[6px] bg-themeColor"></div>
        </div>
        <InfiniteScroll
          dataLength={posts.length} //This is important field to render the next data
          next={fetchPosts}
          hasMore={hasMore}
          loader={<LoaderComponent />}
          endMessage={
            <p className='text-center py-6'>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map(item => (
              <PostCard data={item} key={item._id} />
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </Layout>
  )
}

const LoaderComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className='flex flex-col pb-4 rounded-md gap-4'>
        <div className="aspect-[1.4] bg-gray-300 animate-pulse overflow-hidden rounded-xl relative w-full h-sull">
        </div>
        <div className="flex items-center justify-between">
          <div className="h-9 rounded w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
        </div>
      </div>
      <div className='flex flex-col pb-4 rounded-md gap-4'>
        <div className="aspect-[1.4] bg-gray-300 animate-pulse overflow-hidden rounded-xl relative w-full h-sull">
        </div>
        <div className="flex items-center justify-between">
          <div className="h-9 rounded w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
        </div>
      </div>
      <div className='flex flex-col pb-4 rounded-md gap-4'>
        <div className="aspect-[1.4] bg-gray-300 animate-pulse overflow-hidden rounded-xl relative w-full h-sull">
        </div>
        <div className="flex items-center justify-between">
          <div className="h-9 rounded w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
          <div className="h-9 rounded-3xl w-full bg-gray-300 animate-pulse">

          </div>
        </div>
      </div>
    </div>
  )
}


export default Home
