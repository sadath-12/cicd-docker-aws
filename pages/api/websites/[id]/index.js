import nc from 'next-connect'
import User from '../../../../models/User';
import Website from '../../../../models/Website';
import db from '../../../../utils/db';
const handler = nc()

handler.get(async (req, res) => {
    try {
        await db.connect()
        const website = await Website.findOne({ _id: req.query.id })
        if (website) {
            const user = await User.findOne({ _id: website.user })
            return res.status(200).json({
                website,
                user,
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
