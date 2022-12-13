import nc from 'next-connect'
import cors from 'cors'
const handler = nc()
handler.use(cors())

handler.get(async (req, res) => {
    try {
        Promise.all([
            fetch(`https://seo-rank.my-addr.com/api2/moz+sr+fb/${process.env.NEXT_PUBLIC_SEO_RANK_API_KEY}/${req.query.url}`).then((seo_data) => seo_data.json()),
            fetch(`https://domdetailer.com/api/checkDomain.php?domain=${req.query.url}&app=DomDetailer&apikey=${process.env.NEXT_PUBLIC_MAJESTIC_API_KEY}&majesticChoice=root`).then((majestic_data) => majestic_data.json()),
        ]).then(([seo_data, majestic_data]) => {
            const fullData = { ...seo_data, ...majestic_data }
            return res.status(200).json({
                stats: fullData,
            })
        }).catch(e => {
            res.status(400).json({
                message: e.message,
            });
        })
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})
export default handler

