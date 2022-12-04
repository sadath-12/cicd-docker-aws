import React from 'react'
import { Dialog } from '@mui/material'
import axios from 'axios'
import { MdOutlineContentCopy } from 'react-icons/md'
import { useState, useEffect } from 'react'

const VerifyForm = () => {
    const [siteURL, setSiteURL] = useState('')
    const [metaTag, setMetaTag] = useState('')
    const [randVal, setRandVal] = useState('')
    const [verified, setVerified] = useState(false)
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        const _num = await generateVal(24)
        setRandVal(_num)
        setMetaTag(`<meta name="paypost-site-verification" content="${_num}" />`)

    }

    const verifyByPayPost = async (e) => {
        e.preventDefault()
        if (validURL(siteURL)) {
            await generateRandomMeta()
        } else {
            alert('Please enter a valid URL')
        }
    }
    const verifySiteByHead = async (e) => {
        fetch(`${process.env.PROXY_URL}?quest=siteURL`)
            .then(res => res.text())
            .then(text => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, "text/html");
                console.log(doc)
                if (doc.querySelector("meta[name='paypost-site-verification']")) {
                    if (doc.querySelector("meta[name='paypost-site-verification']").getAttribute("content") === randVal) {
                        alert('verification done')
                    } else {
                        alert('verification not done, values did not match')
                    }
                } else {
                    alert('meta tag not found')
                }

            })
            .catch(err => console.log(err, 'nah err'));
    }

    useEffect(() => {
        console.log(metaTag, 'meta')

        if (metaTag.length > 0) {
            handleClickOpen()
        }
    }, [metaTag, randVal])


    const verifyByPayPostFile = async (e) => {
        e.preventDefault()
        setRandVal(generateVal(24))
        if (randVal.length > 0) {
            const res = await axios.post('/api/generateHTML', { randVal: randVal })
            console.log(res, 'res')
        }
    }
    return (
        <div>
            <form className="flex bg-gray-100 p-12 flex-col gap-6 w-full max-w-xl">
                <input onChange={(e) => setSiteURL(e.target.value)} required type="url" placeholder='enter site url' className="border p-3 bg-gray-50 focus:bg-white rounded-sm shadow-sm outline-none ring-4 ring-purple-200 focus:ring-purple-300" />
                <button onClick={verifyByPayPost} className="bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 focus:ring-4 ring-purple-300 rounded-md px-6 py-3 text-white font-semibold text-lg">Verify</button>
                {/* <p className="text-center uppercase font-bold opacity-80">or</p> */}
                {/* <button onClick={verifyByPayPostFile} className="bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 focus:ring-4 ring-purple-300 rounded-md px-6 py-3 text-white font-semibold text-lg">Verify by paypost file</button> */}
            </form>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="bg-white p-8 rounded-md flex w-full max-w-xl flex-col gap-6">
                    <h2 className="text-xl lg:text-2xl font-semibold">Copy and Paste below tag in your site's head.</h2>
                    <div className="flex rounded-md border">
                        <div className="p-6">
                            {metaTag}
                        </div>
                        <div onClick={() => navigator.clipboard.writeText(metaTag)} className="ml-auto p-2 border-l border-b rounded-bl-md hover:bg-gray-100 cursor-pointer h-fit mb-auto">
                            <MdOutlineContentCopy />
                        </div>

                    </div>
                    <button onClick={() => verifySiteByHead()} className="bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 focus:ring-4 ring-purple-300 rounded-md px-6 py-3 text-white font-semibold text-lg">Verify Now</button>
                </div>
            </Dialog>
        </div>
    )
}

export default VerifyForm