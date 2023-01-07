
import nc from 'next-connect'
import User from '../../../models/User';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
    try {
        const users = await User.find();
        if (users) {
            return res.status(200).json({
                message:
                    "Users  found successfully.",
                users,
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
})

handler.put(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body._id })
        if (user) {
            const updated = await User.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    ...req.body
                }
            })
            await db.disconnect()
            if (updated) {
                return res
                    .status(200)
                    .json({ message: 'Updated Successfully!' });
            } else {
                return res
                    .status(400)
                    .json({ message: 'Something went wrong' });
            }
        } else {
            return res
                .status(400)
                .json({ message: 'User Not Found!' });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
})

handler.delete(async (req, res) => {
    try {
        if (req.query.id) {
            await User.findOneAndDelete({ _id: req.query.id })
            const users = await User.find();
            return res.status(200).json({
                message:
                    "Users  Deleted successfully.",
                users,
            });
        } else {
            return res
                .status(400)
                .json({ message: 'ID is required' });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
})

export default handler
