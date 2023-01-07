import nc from 'next-connect'
import Website from '../../../models/Website';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
const handler = nc()
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
    try {
        await db.connect()
        const existWeb = await Website.findOne({ siteURL: req.body.siteURL })
        if (existWeb) {
            return res.status(422).json({
                message:
                    "Website already exists.",
            });
        }
        const newWebsite = new Website({
            ...req.body,
            user: req.body.userId,

        })
        const websiteToReturn = await newWebsite.save()
        if (websiteToReturn) {
            return res.status(201).json({
                message:
                    "Website created successfully.",
                website: websiteToReturn,
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
