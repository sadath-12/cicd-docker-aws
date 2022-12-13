import nc from 'next-connect'
import Website from '../../../models/Website';
import db from '../../../utils/db';
const handler = nc()

handler.get(async (req, res) => {
    try {
        await db.connect()
        const siteExist = await Website.findOne({ siteURL: req.query.siteURL })
        if (siteExist) {
            res.status(200).json({
                message: 'site exists',
            });
        } else {
            res.status(200).json({
                message: 'site not exists',
            });
        }
        await db.disconnect()
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})

export default handler
