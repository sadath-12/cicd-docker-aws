import nc from 'next-connect'
import bcrypt from 'bcryptjs'
import User from '../../../models/User'
import db from '../../../utils/db'
import { signToken } from '../../../utils/auth'
const handler = nc()

handler.post(async (req, res) => {
    try {
        await db.connect()
        const user = await User.findOne({ email: req.body.email })
        await db.disconnect()
        if (user) {
            if (user && bcrypt.compareSync(req.body.password, user.password)) {
                const token = signToken(user)
                return res.status(200).json({
                    token,
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    mobile: user.mobile,
                    country: user.country
                })
            } else {
                res.status(401).json({ message: "Invalid Email or Password!" });
            }
        } else {
            res.status(401).json({ message: "Invalid Email or Password!" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });

    }

})

export default handler
