import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import Layout from '../components/_App/Layout'
import 'react-phone-number-input/style.css'
import Button from '../components/common/Button'
import { Alert } from '@mui/material'
import Link from 'next/link'
import Router from 'next/router'

const reset = ({ user }) => {
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [cpass, setCpass] = useState('')
    const [otp, setOtp] = useState('')
    const [userFetched, setUserFetched] = useState({})
    const [time, setTime] = useState()
    const [state, setState] = useState({ processing: false, error: { show: false, message: '' }, success: false })
    const [otpState, setOtpState] = useState({ sent: false, processing: false, error: { show: false, message: null }, verified: false, otp: null })
    const [passState, setPassState] = useState({ processing: false, error: { show: false, message: '' }, success: false })


    const sendOTP = async (e) => {
        try {
            setState({ processing: true, error: false, success: { show: false, message: null } })
            e.preventDefault()
            if (email.length > 8 && mobile.length > 9) {
                const res = await axios.get(`/api/user/getUser?email=${email}&mobile=${mobile}`)
                if (res && res.data?.user && res.data?.user.email) {
                    setUserFetched(res.data?.user)
                    if (mobile.length > 9) {
                        const res = await axios.get(`/api/user/getcode?mobile=${mobile}&channel=sms`)
                        if (res && res.status === 200 && res.data?.to === mobile && res.data?.status === 'pending') {
                            setOtpState({ ...otpState, sent: true })
                        } else {
                            setState({ ...state, error: { show: true, message: "Please re-check mobile number or try again later." }, processing: false })
                        }
                    } else {
                        setState({ ...state, processing: false, error: { show: true, message: `Please Enter a valid mobile number!` } })
                    }
                } else {
                    setState({ ...state, processing: false, error: { show: true, message: `There is no user with ${email}` } })
                    console.log('here')
                }
            } else {
                setState({ ...state, processing: false, error: { show: true, message: `All fields required!` } })
            }
        } catch (err) {
            setState({ ...state, processing: false, error: { show: true, message: 'No User found!' } })

        }
    }

    useEffect(() => {
        console.log(userFetched)
    }, [userFetched])

    const handleSubmitOTP = async (e) => {
        e.preventDefault();
        setOtpState({ ...otpState, processing: true })
        try {
            if (otpState?.otp?.length < 6) {
                setOtpState({ ...otpState, error: { show: true, message: 'OTP Must be 6 digits' }, processing: false })
            } else {
                const res = await axios.get(`/api/user/verifycode?mobile=${mobile}&code=${otpState.otp}`)
                if (res && res.status === 200 && res.data?.status === 'approved' && res.data?.valid) {
                    setOtpState({ ...otpState, error: { show: false, message: 'Mobile Number Verified' }, processing: false, verified: true })
                } else {
                    setOtpState({ ...otpState, error: { show: true, message: 'Invalid OTP' }, processing: false })
                }

            }
        } catch (err) {
            setOtpState({ ...otpState, error: { show: true, message: err.message }, processing: false })
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setPassState({ ...otpState, processing: true })
        try {
            if (password === cpass && otpState.verified) {
                const payload = {
                    _id: userFetched._id,
                    password
                }
                const res = await axios.put(`/api/user/update`, payload)
                if (res && res.status === 200 && res.data.message === 'Password Updated Successfully!') {
                    setPassState({ success: true, error: { show: false, message: '' }, processing: false })
                    Router.push('/login')
                } else {
                    setPassState({ success: false, error: { show: true, message: 'Something went wrong!' }, processing: false })
                }
            } else {
                setPassState({ success: false, error: { show: true, message: 'Passwords do not match!' }, processing: false })

            }
        } catch (err) {
            setPassState({ ...otpState, error: { show: true, message: err.message }, processing: false })
        }
    }


    return (
        <Layout user={user}>
            <div className={`w-full py-12 min-h-[70vh] h-fit flex justify-center items-center bg-gray-50`}>
                <div className={`${!otpState.sent ? 'flex scale-100' : 'hidden scale-50'} w-full  max-w-md bg-white shadow-theme my-auto border p-4 lg:p-8 flex transition-all duration-300  flex-col gap-3`}>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl lg:text-3xl font-semibold">Reset Password!</h1>
                    </div>
                    <form onSubmit={sendOTP} className='flex flex-col gap-4 pt-4'>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">
                                Email Address
                            </label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" placeholder='Email Address' className='input' required />
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
                        <button type='submit' className='!w-full' disabled={state.processing ? true : false}>
                            <Button fluid={true} text={state.processing ? 'Processing...' : 'Continue'} disabled={state.processing} />
                        </button>
                        <Link href='/login' legacyBehavior>
                            <a className='text-themeColor underline'>Back to Login</a>
                        </Link>
                        {state.error.show &&
                            <Alert severity="error">{state.error.message}</Alert>
                        }
                    </form>
                </div>
                <div className={`w-full max-w-md  transition-all duration-300 flex flex-col gap-4 p-10 bg-white shadow-theme relative z-20 ${otpState.sent && !otpState.verified ? 'flex scale-100' : 'hidden scale-50'}`}>
                    <h2 className='text-2xl lg:text-3xl font-semibold'>Enter OTP</h2>
                    <p>OTP sent to {mobile?.slice(0, 2)}xxxxxx{mobile?.slice(8, 12)}</p>
                    <form className='flex flex-col gap-6'>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="otp">
                                One Time password
                            </label>
                            <input
                                onChange={(e) => setOtpState({ ...otpState, otp: e.target.value })} value={otpState.otp} type="number" name="otp" id="otp" placeholder='Enter OTP.' className='input' required />
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
                            <Button gray fluid={true} text={'Change Mobile Number'} disabled={otpState.processing} />
                        </button>
                    </form>
                </div>
                {/*  */}
                <div className={`${otpState.sent && otpState.verified ? 'flex scale-100' : 'hidden scale-50'} w-full max-w-md  transition-all duration-300 flex flex-col gap-4 p-10 bg-white shadow-theme relative z-20 `}>
                    <h2 className='text-2xl lg:text-3xl font-semibold'>Enter New Passowrd</h2>
                    <form className='flex flex-col gap-6'>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email">
                                Email Address
                            </label>
                            <input readOnly value={email} type="email" name="email" id="email" placeholder='Email Address' className='input' required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password">
                                Enter Password
                            </label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" id="password" placeholder='Password' className='input' required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm_password">
                                Confirm Your Password
                            </label>
                            <input onChange={(e) => setCpass(e.target.value)} value={cpass} type="password" name="confirm_password" id="confirm_password" placeholder=' Confirm Password' className='input' required />
                        </div>
                        {passState.error.show &&
                            <Alert severity="error">{passState.error.message}</Alert>
                        }
                        {passState.success &&
                            <Alert severity="success">Password Changed Successfully!</Alert>
                        }

                        <button onClick={handleChangePassword} type='submit' className='!w-full' disabled={passState.processing ? true : false}>
                            <Button fluid={true} text={passState.processing ? 'Processing...' : 'Update Password'} disabled={passState.processing} />
                        </button>

                    </form>
                </div>

            </div>
        </Layout>
    )
}

export default reset