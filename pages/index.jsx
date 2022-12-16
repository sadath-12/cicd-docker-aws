import Hero from '../components/Pages/Home/Hero'
import Meta from '../components/_App/Meta'
import PostCard from '../components/common/PostCard'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../components/_App/Layout';
import Filters from '../components/common/Filters';
import axios from 'axios';

const filter_initial = {
  category: 'all',
  language: 'all',
  price_from: 0,
  price_to: 1000,
  year_to: 100,
  year_from: 0,
  da_from: 0,
  da_to: 100,
  pa_from: 0,
  pa_to: 100,
  dr_from: 0,
  dr_to: 100,
  traffic_from: 0,
  traffic_to: 1000000000,
  link_type: '',
}
const Home = ({ user }) => {
  const [filterData, setFilterData] = useState(filter_initial)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  const fetchPosts = async (dataSent) => {
    try {
      setLoading(true)
      const {
        price_from,
        price_to,
        year_to,
        category,
        language,
        year_from,
        da_from,
        da_to,
        pa_from,
        pa_to,
        dr_from,
        dr_to,
        traffic_from,
        traffic_to,
        link_type,
      } = dataSent ? dataSent : filterData
      const response = await axios.get(`/api/websites?price_from=${price_from}&price_to=${price_to}&year_from=${year_from}&year_to=${year_to}&da_from=${da_from}&da_to=${da_to}&pa_from=${pa_from}&pa_to=${pa_to}&dr_from=${dr_from}&dr_to=${dr_to}&traffic_from=${traffic_from}&traffic_to=${traffic_to}&link_type=${link_type}&category=${category}&language=${language}`)
      setPosts(response.data.websites);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log('Something went wrong')
    }
  }
  const applyFilters = async () => {
    await fetchPosts()
  }
  const clearFilters = async () => {
    setFilterData(filter_initial)
    await fetchPosts(filter_initial)
  }

  useEffect(() => {
    (async () => {
      fetchPosts()
    })()
  }, [])
  return (
    <Layout user={user}>
      <Meta
        title='Home Page'
      />
      <Hero user={user} />
      <div className="flex max-w-[100rem] mx-auto w-full">
        <div className="w-full  overflow-y-scroll pt-12 sticky inset-0 top-12 h-screen bg-white border-r max-w-sm">
          <Filters clearFilters={clearFilters} applyFilters={applyFilters} data={filterData} setData={setFilterData} />
        </div>
        <section id="posts" className='py-12  w-full flex-1 container lg:py-16 flex flex-col gap-8'>
          <div className="flex flex-col gap-2 text-center items-center">
            <h2 className="text-2xl lg:text-3xl font-semibold">Popular Posts</h2>
            <div className="mx-auto w-full max-w-[8rem] rounded h-[6px] bg-themeColor"></div>
          </div>
          {posts?.length > 0 || loading ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map(item => (
                <PostCard data={item} key={item._id} />
              ))}
            </div>
            :
            <LoaderComponent />}

        </section>
      </div>
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
