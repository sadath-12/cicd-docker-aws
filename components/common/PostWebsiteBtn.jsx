import React from 'react'
import Link from 'next/link'
import Button from './Button'

const PostWebsiteBtn = () => {
    return (
        <Link href='/post-service'>
            <Button text={'Post a Site'} />
        </Link>
    )
}

export default PostWebsiteBtn