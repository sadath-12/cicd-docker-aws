import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Alert } from '@mui/material'
import Meta from '../components/_App/Meta'
import axios from 'axios'
import cookies from 'js-cookie'
import Layout from '../components/_App/Layout'
const Button = dynamic(() => import('../components/common/Button'), { ssr: false })

const initial = {
    processing: false, error: { show: false, message: '' }, success: false, email: '', password: ''
}
const login = ({ user }) => {
    const [state, setState] = useState(initial)
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, processing: true })
        try {
            if (state.email && state.password) {
                const res = await axios.post('/api/user/login', state)
                if (res && res.status === 200 && res.data) {
                    cookies.set('user', JSON.stringify(res?.data), { expires: 30 * 24 * 60 * 60 })
                    cookies.set('token', JSON.stringify(res?.data.token), { expires: 30 * 24 * 60 * 60 })
                    setState({ success: true, error: { show: false, message: '' }, processing: false })
                } else {
                    setState({ ...state, processing: false, error: { show: true, message: 'Invalid Email or Password!' } })
                }
            } else {
                setState({ ...state, error: { show: true, message: "All fields are required" }, processing: false })
            }
        } catch (err) {
            setState({ ...state, processing: false, error: { show: true, message: 'Invalid Email or Password!' } })
        }
    }

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                router.push('/')
            }, 1000)
        }
    }, [state])
    return (
        <Layout user={user}>
            <div className="w-full h-full flex items-center min-h-[90vh] bg-themeLightColor">
                <Meta title='Login' />
                <div className='container  py-12 lg:grid lg:grid-cols-2 !max-w-[70rem]'>
                    <div className="bg-themeColor  hidden lg:flex items-center justify-center p-10">
                        <img src="/images/login.png" alt="image" className='w-[80%] h-[80%] object-contain' />
                    </div>
                    <div className="flex bg-white max-w-[25rem] justify-center lg:max-w-full flex-col gap-6 py-12 px-4 lg:px-10 2xl:px-20 mx-auto w-full">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl lg:text-4xl text-themeColor font-semibold">Welcome Back!</h1>
                            <p className="text-base opacity-80">Enter Email and password to continue.</p>
                        </div>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">
                                    Email Address
                                </label>
                                <input onChange={handleChange} value={state.email} type="email" name="email" id="email" placeholder='Email Address' className='input' required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password">
                                    Enter Password


                                </label>
                                <input onChange={handleChange} value={state.password} type="password" name="password" id="password" placeholder='Password' className='input' required />
                            </div>
                            <div className="flex justify-between items-center">
                                <Link href='/reset-password' legacyBehavior>
                                    <a className='link'>Forgot Password?</a>
                                </Link>
                            </div>
                            {state.error.show &&
                                <Alert severity="error">{state.error.message}</Alert>
                            }
                            {state.success &&
                                <Alert severity="success">Logged In succesfully, Good Job!</Alert>
                            }
                            <button type='submit' className='!w-full' disabled={state.processing ? true : false}>
                                <Button fluid={true} text={state.processing ? 'Processing...' : 'Continue'} disabled={state.processing} />
                            </button>
                            <div className="flex justify-between items-center">
                                <p>Don't have an account?</p>
                                <Link href='/register' legacyBehavior>
                                    <a className='link'>Register</a>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default login