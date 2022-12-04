import axios from 'axios';
import nc from 'next-connect'
import cors from 'cors'
const handler = nc()
handler.use(cors())

handler.get(async (req, res) => {
    try {
        await fetch(`https://seo-rank.my-addr.com/api2/moz+sr+fb/${process.env.NEXT_PUBLIC_SEO_RANK_API_KEY}/${req.query.url}`).then((response) => response.json())
            .then((data) => {
                return res.status(200).json({
                    stats: data,
                })
            }).catch(e => {
                return res.status(400).json({
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
