import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Alert, CircularProgress } from '@mui/material'
import { countriesHelper } from '../components/dummy'
import Meta from '../components/_App/Meta'
const Button = dynamic(() => import('../components/common/Button'), { ssr: false })
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import axios from 'axios'
import Layout from '../components/_App/Layout'
import { useRouter } from 'next/router'
import cookies from 'js-cookie'

const state_initial = {
    processing: false,
    error: { show: false, message: '' },
    success: false,
}
const data_initial = {
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    mobile: '',
    country: '',
}

const register = ({ user }) => {
    const initial_country = countriesHelper.filter(ctry => ctry.name === 'India')[0].name
    const [state, setState] = useState(state_initial)
    const [resent, setResent] = useState({ did: false, attempts: 0 })
    const [data, setData] = useState(data_initial)
    const [otpState, setOtpState] = useState({ sent: false, processing: false, error: { show: false, message: null }, verified: false, otp: null })
    const [mobile, setMobile] = useState('')
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, processing: true })
        try {
            if (data.password === data.confirm_password) {
                setState({ ...state, processing: true })
                if (data?.mobile?.length > 9) {
                    setState(state_initial)
                    const res = await axios.get(`/api/user/getcode?mobile=${data.mobile}&channel=sms`)
                    if (res && res.status === 200 && res.data.to === mobile && res.data.status === 'pending') {
                        setState({ ...state, processing: true })
                        setOtpState({ ...otpState, sent: true })
                    } else {
                        setState({ ...state, error: { show: true, message: "Please re-check mobile number or try again later." }, processing: false })
                    }
                } else {
                    setState({ ...state, error: { show: true, message: "Enter a Valid Mobile Number" }, processing: false })
                }
            } else {
                setState({ ...state, error: { show: true, message: "Password should match confirm Password!" }, processing: false })
            }
        } catch (err) {
            setState({ ...state, error: { show: true, message: err.message }, processing: false })
        }
    }

    useEffect(() => {
        setData({ ...data, mobile: mobile?.replace('+', '') })
    }, [mobile])

    const handleSubmitOTP = async (e) => {
        e.preventDefault();
        setOtpState({ ...otpState, processing: true })
        try {
            if (otpState.otp.length < 6) {
                setOtpState({ ...otpState, error: { show: true, message: 'OTP Must be 6 digits' }, processing: false })
            } else {
                const res = await axios.get(`/api/user/verifycode?mobile=${data.mobile}&code=${otpState.otp}`)
                if (res && res.status === 200 && res.data.status === 'approved' && res.data.valid) {
                    setOtpState({ ...otpState, error: { show: false, message: 'Mobile Number Verified' }, processing: false, verified: true })
                    setState({ ...state, processing: true })
                    const res2 = await axios.post('/api/user/register', { ...data, otp: otpState.otp })
                    if (res2 && res2.status === 201 && res2.data) {
                        cookies.set('user', JSON.stringify(res2?.data), { expires: 30 * 24 * 60 * 60 })
                        cookies.set('token', JSON.stringify(res2?.data.token), { expires: 30 * 24 * 60 * 60 })
                        setState({ success: true, error: { show: false, message: '' }, processing: false })
                    } else if (res2.status === 101) {
                        setState({ success: false, error: { show: true, message: 'User Already Exists' }, processing: false })
                    } else if (res2.status === 400) {
                        setState({ success: false, error: { show: true, message: 'Something went wrong!' }, processing: false })
                    }
                } else {
                    setOtpState({ ...otpState, error: { show: true, message: 'Invalid OTP' }, processing: false })
                }

            }
        } catch (err) {
            setOtpState({ ...otpState, error: { show: true, message: err.message }, processing: false })
        }
    }

    const resendOTP = async () => {
        try {
            if (resent.attempts < 2) {
                const res = await axios.get(`/api/user/getcode?mobile=${data.mobile}&channel=sms`)
                if (res && res.status === 200 && res.data.to === mobile && res.data.status === 'pending') {
                    setOtpState({ ...otpState, sent: true })
                    setResent({ did: true, attempts: resent.attempts + 1 })
                } else {
                    setOtpState({ ...otpState, error: { show: true, message: 'Something went wrong, please try again later.' } })
                }
            } else {
                setOtpState({ ...otpState, error: { show: true, message: 'You attempted more than 3 times, please try again later.' } })
            }
        } catch (err) {
            setOtpState({ ...otpState, error: { show: true, message: err.message } })
        }

    }
    useEffect(() => {
        setData({ ...data, country: initial_country })
    }, [])


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
                <Meta title='Register' />
                <div className='container  py-6 lg:grid lg:grid-cols-2 !max-w-[70rem]'>
                    <div className="bg-themeColor text-white hidden lg:flex flex-col items-stretch p-10">
                        <h2 className="text-4xl font-semibold">Register to List & Grow Your Amazing Website using Posts.Site.</h2>
                        <img src="/images/login.png" alt="image" className='max-w-[20rem] mt-auto ml-auto object-contain' />

                    </div>
                    <div className="flex relative overflow-hidden bg-white max-w-[30rem] justify-center lg:max-w-full flex-col gap-6 py-12 px-4 lg:px-10 2xl:px-20 mx-auto w-full">
                        <div className={`${state.processing ? 'flex' : '!bg-transparent hidden'} z-10 top-0 w-full h-full transition-all duration-500 absolute flex items-center justify-center`} style={{ background: 'linear-gradient(rgba(255,255,255,.6),rgba(255,255,255,0.6))' }}>

                        </div>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl lg:text-4xl text-themeColor font-semibold">Lets get started!</h1>
                        </div>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email">
                                    Email Address
                                </label>
                                <input onChange={handleChange} value={state.email} type="email" name="email" id="email" placeholder='Email Address' className='input' required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="username">
                                    Username
                                </label>
                                <input onChange={handleChange} value={state.username} type="text" name="username" id="username" placeholder='Username' className='input' required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password">
                                    Enter Password
                                </label>
                                <input onChange={handleChange} value={state.password} type="password" name="password" id="password" placeholder='Password' className='input' required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="confirm_password">
                                    Confirm Your Password
                                </label>
                                <input onChange={handleChange} value={state.confirm_password} type="password" name="confirm_password" id="confirm_password" placeholder=' Confirm Password' className='input' required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="mobile">
                                    Mobile Number
                                </label>

                                {/* <input onChange={handleChange} value={state.mobile} type="number" name="mobile" id="mobile" placeholder=' +XX XXX XXX XXXX' className='input' required /> */}
                                <div className="input focus-within:border-themeColor">
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        placeholder="Enter phone number"
                                        value={mobile}
                                        onChange={setMobile} />
                                </div>
                            </div>



                            <div className="flex flex-col gap-2">
                                <label htmlFor="country">
                                    Select Your Country
                                </label>
                                <select onChange={handleChange} className='input' name="country" id="country">
                                    {countriesHelper.map(({ code, name }) => (
                                        <option selected={name === 'India'} value={name} className='flex items-center justify-between'>
                                            {`${name} (${code})`}
                                        </option>
                                    ))}
                                </select>
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
                                <p>Already have an account?</p>
                                <Link href='/login' legacyBehavior>
                                    <a className='link'>Login</a>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={`${otpState.sent && !otpState.verified ? 'top-[0%]' : 'top-[-100%]'} z-50 w-full h-screen transition-all duration-500 fixed flex items-center justify-center`} style={{ background: 'linear-gradient(rgba(255,255,255,.6),rgba(255,255,255,0.6))' }}>
                    <div className="w-full max-w-xl flex flex-col gap-4 p-10 bg-white shadow-theme relative z-20">
                        <h2 className='text-2xl lg:text-3xl font-semibold'>Enter OTP</h2>
                        <p>OTP sent to +{data.mobile.slice(0, 2)}xxxxxx{data.mobile.slice(8, 12)}</p>
                        <form className='flex flex-col gap-6'>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="otp">
                                    One Time password
                                </label>
                                <input
                                    onChange={(e) => setOtpState({ ...otpState, otp: e.target.value })} value={otpState.otp} type="number" name="otp" id="otp" placeholder='Enter OTP.' className='input' required />
                            </div>
                            {resent.did && data.attempts < 2 &&
                                <Alert severity="success">OTP sent to +{data.mobile.slice(0, 2)}xxxxxx{data.mobile.slice(8, 12)}!</Alert>
                            }
                            <div className="flex justify-between items-center">
                                <p>Didn't Recieve a code?</p>
                                <div onClick={resendOTP} className='underline text-themeColor cursor-pointer' >
                                    <a>Resend Code</a>
                                </div>
                            </div>
                            {otpState.error.show &&
                                <Alert severity="error">{otpState.error.message}</Alert>
                            }
                            {otpState.verified &&
                                <Alert severity="success">Mobile Number Verified, Well done!</Alert>
                            }

                            <button onClick={handleSubmitOTP} type='submit' className='!w-full' disabled={otpState.processing ? true : false}>
                                <Button fluid={true} text={otpState.processing ? 'Processing...' : 'Continue'} disabled={otpState.processing} />
                            </button>
                            <p className="uppercase text-center font-semibold opacity-80">OR</p>
                            <button onClick={() => { setOtpState({ ...otpState, sent: false }), setState({ ...state, processing: false }) }} className='!w-full' >
                                <Button gray fluid={true} text={'Change Mobile Number'} disabled={state.processing} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default register