import React, { useEffect, useState } from 'react'
import Layout from '../components/_App/Layout';
import { Dialog, LinearProgress } from '@mui/material'
import axios from 'axios'
import { MdOutlineContentCopy } from 'react-icons/md'
import Button from '../components/common/Button';
import CurrencyInput from 'react-currency-input-field';
import { languages, categories } from '../components/dummy';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import Image from 'next/image';
import { parseCookies } from "nookies";
import cookies from 'js-cookie'
import Meta from '../components/_App/Meta';
import { useRouter } from 'next/router';

const initial = {
    siteURL: '',
    price: '',
    category: categories[0],
    time_of_delivery: "",
    image: "",
    language: "English",
    status: "both",
    description: "",
    site_stats: {}
}
const PostService = ({ user }) => {
    const [siteURL, setSiteURL] = useState('')
    const [state, setState] = useState({ processing: false, error: { show: false, message: '' }, success: false })
    const [metaTag, setMetaTag] = useState('')
    const [image, setImage] = useState('')
    const [randVal, setRandVal] = useState('')
    const [verified, setVerified] = useState(false)
    const [data, setData] = useState(initial)
    const [errorState, setErrorState] = useState({ url: false, metaNotFound: false, differentVal: false })
    const [open, setOpen] = useState(false);

    const router = useRouter()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrorState({ ...errorState, metaNotFound: false, differentVal: false })
    };

    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    function generateVal(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()<>?';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    const generateRandomMeta = async () => {
        const { _generatedMeta_Already } = parseCookies()
        if (_generatedMeta_Already) {
            const cookieMeta = JSON.parse(_generatedMeta_Already)
            setMetaTag(cookieMeta.metaTag)
            setRandVal(cookieMeta.randVal)
            console.log(cookieMeta)
        } else {
            const _num = await generateVal(24)
            setMetaTag(`<meta name="paypost-site-verification" content="${_num}" />`)
            setRandVal(_num)
            const cookieData = {
                siteURL: siteURL,
                metaTag: `<meta name="paypost-site-verification" content="${_num}" />`,
                randVal: _num
            }
            cookies.set('_generatedMeta_Already', JSON.stringify(cookieData), { expires: 1 * 24 * 60 * 60 })
        }
    }

    const verifyByPayPost = async (e) => {
        e.preventDefault()
        if (validURL(siteURL)) {
            await generateRandomMeta()
        } else {
            setErrorState({ ...errorState, url: true })
        }
    }
    const verifySiteByHead = async (e) => {
        fetch(`https://api.codetabs.com/v1/proxy?quest=${siteURL}`)
            .then(res => res.text())
            .then(text => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, "text/html");
                console.log(doc)
                if (doc.querySelector("meta[name='paypost-site-verification']")) {
                    console.log(randVal, 'rand')
                    if (doc.querySelector("meta[name='paypost-site-verification']").getAttribute("content") === randVal) {
                        setVerified(true)

                    } else {
                        setErrorState({ ...errorState, differentVal: true, metaNotFound: false })
                    }
                } else {
                    setErrorState({ ...errorState, metaNotFound: true, differentVal: false })
                }

            })
            .catch(err => alert('Something went wrong, please try again later.'));
    }
    const getSiteStats = async () => {
        const response = await axios.get(`/api/websites/get_stats?url=${siteURL}`)
        if (response && response.data.stats && response.data.stats.da) {
            setData({ ...data, site_stats: response.data.stats })
            return response.data.stats
        } else {
            alert("website stats not found")
        }
    }

    const getWebsiteImage = async () => {
        try {
            const response = await axios.get(`https://shot.screenshotapi.net/screenshot?token=${process.env.NEXT_PUBLIC_SCREENSHOT_API_KEY}&url=${siteURL}`)
            if (response && response.data.screenshot) {
                setImage(response.data.screenshot)
            } else {
                alert('Image Not Found!')
            }
        } catch (e) {
            alert('Something went wrong!')
        }
    }



    useEffect(() => {
        if (siteURL.length > 0) {
            setData({ ...data, siteURL: siteURL })
            if (validURL(siteURL)) {
                setErrorState({ ...errorState, url: false })
            } else {
                setErrorState({ ...errorState, url: true })
            }
        } else {
            setErrorState({ ...errorState, url: false })
        }
    }, [siteURL])



    useEffect(() => {
        if (verified) {
            (async () => {
                await getWebsiteImage()
                await getSiteStats()
                handleClose()
            })()
            console.log(data)
        }
    }, [verified])

    useEffect(() => {
        if (metaTag.length > 0) {
            handleClickOpen()
        }
    }, [metaTag, randVal])


    const handleChangeFormData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleCreateSite = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/websites/new', { ...data, image }, {
                headers: {
                    authorization: `Bearer ${user?.token}`,
                },
            })
            if (res && res.status === 200) {
                setState({ success: true, processing: false, error: { show: false, message: '' } })
                router.push('/')
            } else {
                setState({ ...state, error: { show: true, message: 'Website already exist.' } })
            }
        } catch (e) {
            setState({ ...state, processing: false, error: { show: true, message: e.message } })
        }
    }


    return (
        <Layout user={user}>
            <Meta title='Post a New Website' />
            <div className="container !max-w-[60rem] py-8 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <h1 className='text-2xl lg:text-4xl font-semibold'>Post a Site</h1>
                    <div className="w-full h-1 max-w-[4rem] bg-themeColor"></div>
                </div>
                <form className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="siteURL">Website URL*</label>
                        <input readOnly={verified} onChange={(e) => setSiteURL(e.target.value)} required type="url" id="siteURL" className="input" placeholder='https://www.example.com' />
                        {errorState.url ?
                            <p className="text-red-500 font-semibold">Please enter a valid URL</p>
                            :
                            ''
                        }
                    </div>
                    <button disabled={verified ? true : false} onClick={verifyByPayPost} ><Button disabled={verified} fluid text='Verify by Paypost' /></button>
                </form>
                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <div className="bg-white relative p-8 rounded-md flex w-full max-w-xl flex-col gap-6">
                        <h2 className="text-xl lg:text-2xl font-semibold">Copy and Paste below tag in your site's head.</h2>
                        <div className="flex rounded-md border">
                            <div className="p-6">
                                {metaTag}
                            </div>
                            <div onClick={() => navigator.clipboard.writeText(metaTag)} className="ml-auto p-2 border-l border-b rounded-bl-md hover:bg-gray-100 cursor-pointer h-fit mb-auto">
                                <MdOutlineContentCopy />
                            </div>
                        </div>
                        {verified &&
                            <div className="absolute w-full h-full inset-0 bg-white opacity-70 z-20">
                                <LinearProgress />
                            </div>
                        }
                        {verified ?
                            <p className="text-green-600 font-semibold">Verification Successfull, Great Job!</p>
                            :
                            ''
                        }
                        {errorState.differentVal ?
                            <p className="text-red-500 font-semibold">Verification failed, meta tag did not match with above meta tag, please copy and paste exact value. </p>
                            :
                            ''
                        }
                        {errorState.metaNotFound ?
                            <p className="text-red-500 font-semibold">Verification failed, Meta tag was not added. Please add above meta tag and try again. </p>
                            :
                            ''
                        }
                        <button onClick={() => verifySiteByHead()} ><Button fluid text='Verify Now' /></button>
                        <button onClick={handleClose} ><Button fluid text='Cancel' gray /></button>
                    </div>
                </Dialog>
                <div className="flex flex-col gap-8 relative" title={!verified && 'Please verify your website first'}>
                    <div className={`${verified ? "opacity-0 -z-10" : 'cursor-not-allowed opacity-70 z-20'} bg-white w-full absolute inset-0`}></div>
                    <form onSubmit={handleCreateSite} className="flex flex-col gap-4 relative py-6" >
                        <div className="flex flex-col gap-3">
                            <h1 className='text-xl lg:text-3xl font-semibold'>Your Website Details</h1>
                            <div className="w-full h-1 max-w-[4rem] bg-themeColor"></div>
                        </div>
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
                                    defaultValue={1000}
                                    decimalsLimit={2}
                                    onValueChange={(value) => setData({ ...data, price: value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="time_of_delivery">Time Of delivery</label>
                                <input required type="number" onChange={handleChangeFormData} className='input' name="time_of_delivery" id="time_of_delivery" placeholder='Time of Delivery' />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="language">Language</label>
                                <select required name="language" onChange={handleChangeFormData} className='input' id="language">
                                    {languages.map((language, i) => (
                                        <option selected={language.name.toLowerCase() === 'english'} value={language.name}>
                                            {language.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="category">Category</label>
                                <select required name="category" onChange={handleChangeFormData} className='input' id="category">
                                    {categories.map((category, i) => (
                                        <option selected={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="status">Status</label>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="status"
                                id="status"

                                value={data.status}
                                onChange={(e) => setData({ ...data, status: e.target.value })}
                            >
                                <FormControlLabel value="do_follow" control={<Radio />} label="Do Follow" />
                                <FormControlLabel value="no_follow" control={<Radio />} label="No Follow" />
                                <FormControlLabel value="both" control={<Radio />} label="Both" />
                            </RadioGroup>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description">Description</label>
                            <textarea required placeholder='Something about your site' className='input' name="description" id="description" onChange={handleChangeFormData} cols="30" rows="7"></textarea>
                        </div>
                        {verified &&
                            <>
                                <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden relative">
                                    <Image src={image} className='object-cover object-top ' alt='img' fill />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Details site_stats={data.site_stats} />
                                </div>
                            </>
                        }
                        <div className='relative grid py-3 gap-4 grid-cols-1 md:grid-cols-2 w-full'>
                            <div className={`${state.processing ? "opacity-0 -z-10" : 'cursor-not-allowed opacity-70 z-20'} bg-white w-full absolute inset-0`}></div>
                            <button>
                                <Button fluid text='Create Post' />
                            </button>
                            <Link href='/' >
                                <Button gray fluid text='Discard' />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
const Details = ({ site_stats }) => {
    return (
        <div className='flex flex-col gap-6'>
            <div className="grid grid-cols-2 md:grid-cols-3  2xl:grid-cols-3 gap-6">
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.da || 'N/A'}</h3>
                    <Button text='Site Page Authority' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.pa || 'N/A'}</h3>
                    <Button text='Site Domain Authority' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.mozrank || 'N/A'}</h3>
                    <Button text='Site Moz Rank' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.fb_shares || 'N/A'}</h3>
                    <Button text='Fb Shares' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.fb_reac || 'N/A'}</h3>
                    <Button text='Fb Reactions' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.fb_comments || 'N/A'}</h3>
                    <Button text='Fb Comments' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.links || 'N/A'}</h3>
                    <Button text='Links In' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.equity || 'N/A'}</h3>
                    <Button text='Equity' fluid notBtn />
                </div>
                <div className="flex border bg-white  flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_hlinks || 'N/A'}</h3>
                    <Button text='Semrush hostname Links' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_costs || 'N/A'}</h3>
                    <Button text='Semrush Costs' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_dlinks || 'N/A'}</h3>
                    <Button text='Semrush Domain Links' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_kwords || 'N/A'}</h3>
                    <Button text='Semrush Keywords Number' fluid notBtn />
                </div>

                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_rank || 'N/A'}</h3>
                    <Button text='Semrush Rank' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_traffic || 'N/A'}</h3>
                    <Button text='Semrush Traffic' fluid notBtn />
                </div>
                <div className="flex border bg-white flex-col gap-2 p-2 rounded-xl">
                    <h3 className="text-2xl text-center lg:text-4xl font-bold">{site_stats?.sr_ulinks || 'N/A'}</h3>
                    <Button text='Semrush URL Links' fluid notBtn />
                </div>
            </div>
        </div>
    )
}
export default PostService