import Head from 'next/head'

const Meta = ({
    title = 'Home Page',
    description = '',
    image = '/images/logo.png',
    keywords = ''
}) => {
    return (
        <Head>
            <title>{`${title} | Posts Site`}</title>
            <link rel="shortcut icon"
                href="/images/favicon.webp"
                type="image/x-icon" />
            <meta name="description" content={description} />
            <meta name="twitter:card" content="summary_large_image" />
            {/* <meta name="twitter:site" content="@lyricspell" /> */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta property="og:title" content={title} />
            <meta property="og:locale" content={'en_US'} />
            {/* <meta property="og:site_name" content={'Cinema Go'} /> */}
            <meta property="og:description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:image" content={image} />
            <link
                rel="icon"
                href="/images/favicon.webp"
            />
        </Head>
    )
}

export default Meta