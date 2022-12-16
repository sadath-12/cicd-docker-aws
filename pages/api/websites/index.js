import nc from 'next-connect'
import Website from '../../../models/Website';
import db from '../../../utils/db';
const handler = nc()

handler.get(async (req, res) => {
    try {
        await db.connect()
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
        } = req.query

        const websites = await Website.find()
        if (websites) {
            const getWebTraffic = (site_stats) => {
                const traffic = site_stats.sr_traffic === 'notfound' || 'unknown' ? 0 : site_stats.sr_traffic
                return traffic
            }
            const returnToData = websites.filter(website => (price_to >= parseInt(website.price) && price_from <= parseInt(website.price) && da_from <= website.site_stats.da && da_to >= website.site_stats.da && pa_from <= website.site_stats.pa && pa_to >= website.site_stats.pa && traffic_from <= getWebTraffic(website.site_stats) && traffic_to >= getWebTraffic(website.site_stats) && year_from <= (new Date().getFullYear() - new Date(website.createdAt).getFullYear()) && website.language === (language === 'all' ? website.language : language) && website.category === (category === 'all' ? website.category : category)))

            return res.status(200).json({
                websites: returnToData,
                // price_from,
                // price_to,
                // year_to,
                // category,
                // language,
                // year_from,
                // da_from,
                // da_to,
                // pa_from,
                // pa_to,
                // dr_from,
                // dr_to,
                // traffic_from,
                // traffic_to,
                // link_type,
            })
        }
        await db.disconnect()
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})

export default handler
