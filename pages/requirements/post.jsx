
import axios from 'axios'
import Link from 'next/link'
import Router from 'next/router'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import Button from '../../components/common/Button'
import { categories, languages } from '../../components/dummy'
import Layout from '../../components/_App/Layout'

const index = ({ user }) => {
    const [data, setData] = useState({
        price: '',
        category: categories[0],
        time_of_delivery: "",
        language: "English",
        description: "",
    })
    const [state, setState] = useState({ processing: false, error: false, success: false })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        console.log(user)
        e.preventDefault();
        setState({ ...state, processing: true })
        try {
            const res = await axios.post('/api/requirement', data, {
                headers: {
                    authorization: `Bearer ${user?.token}`,
                },
            })
            if (res && res.status === 201) {
                setState({ success: true, processing: false, error: { show: false, message: '' } })
                Router.push('/requirements')
            } else {
                setState({ ...state, error: { show: true, message: 'Website already exist.' } })
            }
        } catch (e) {
            setState({ ...state, processing: false, error: { show: true, message: e.message } })
        }
    }
    return (
        <Layout user={user}>
            <div className="container !max-w-[60rem] py-8 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <h1 className='text-2xl lg:text-4xl font-semibold'>Post a Requirement</h1>
                    <div className="w-full h-1 max-w-[4rem] bg-themeColor"></div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="price">Price</label>
                            <CurrencyInput
                                maxLength={3}
                                prefix="$ "
                                required
                                className='input'
                                id="price"
                                name="price"
                                value={data.price}
                                placeholder="Please enter a Price"
                                defaultValue={0}
                                decimalsLimit={2}
                                onValueChange={(value) => setData({ ...data, price: value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="time_of_delivery">Time Of delivery</label>
                            <input required type="number" onChange={handleChange} className='input' name="time_of_delivery" id="time_of_delivery" placeholder='Time of Delivery' />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="category">Category</label>
                            <select required name="category" onChange={handleChange} className='input' id="category">
                                {categories.map((category, i) => (
                                    <option selected={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="language">Language</label>
                            <select required name="language" onChange={handleChange} className='input' id="language">
                                {languages.map((language, i) => (
                                    <option selected={language.name.toLowerCase() === 'english'} value={language.name}>
                                        {language.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="description">Description</label>
                        <textarea minLength={150} required placeholder='Something about your site' className='input' name="description" id="description" onChange={handleChange} cols="30" rows="7"></textarea>
                    </div>
                    <div className='relative grid py-3 gap-4 grid-cols-1 md:grid-cols-2 w-full'>
                        <div className={`${!state.processing ? "opacity-0 -z-10" : 'cursor-not-allowed opacity-70 z-20'} bg-white w-full absolute inset-0`}></div>
                        <button>
                            <Button fluid text='Create Post' />
                        </button>
                        <Link href='/' >
                            <Button gray fluid text='Discard' />
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default index