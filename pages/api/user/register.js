import nc from 'next-connect'
import bcrypt from 'bcryptjs'
import User from '../../../models/User'
import db from '../../../utils/db'
import { signToken } from '../../../utils/auth'

const handler = nc()

handler.post(async (req, res) => {
    try {
        await db.connect()
        const userExist = await User.findOne({ email: req.body.email })
        if (userExist) {
            return res
                .status(422)
                .json({ message: `User already exist with email ${req.body.email}` });
        } else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                mobile: req.body.mobile,
                otp: req.body.otp,
                country: req.body.country,
                password: bcrypt.hashSync(req.body.password),
            })
            const user = await newUser.save()
            let result
            if (user) {
                const token = signToken(user)
                result = res.status(201).send({
                    token,
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    mobile: user.mobile,
                    country: user.country
                })

            } else {
                return res
                    .status(400)
                    .json({ message: `Something went wrong, please try again later.` });
            }
            await db.disconnect()
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }

})

export default handler
