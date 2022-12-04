import nc from 'next-connect'
import Website from '../../../models/Website';
import db from '../../../utils/db';
const handler = nc()

handler.get(async (req, res) => {
    try {
        await db.connect()
        const totalWeb = await Website.find()
        const websites = await Website.aggregate([
            { $skip: parseInt(req.query.skip) },
            { $match: {} }
        ])
        if (websites) {
            return res.status(200).json({
                websites,
                hasMore: parseInt(req.query.skip) < totalWeb.length
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
