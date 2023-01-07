import nc from 'next-connect'
import Requirement from '../../../models/Requirement';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
    try {
        await db.connect()
        const newReq = new Requirement({
            ...req.body,
            user: req.user,
        })
        const reqToReturn = await newReq.save()
        if (reqToReturn) {
            return res.status(201).json({
                message:
                    "requirement created successfully.",
                requirement: reqToReturn,
            });
        }
        await db.disconnect()
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})
handler.get(async (req, res) => {
    try {
        await db.connect()
        const reqs = await Requirement.find()
        if (reqs) {
            return res.status(200).json({
                reqs,
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
