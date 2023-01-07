
import nc from 'next-connect'
import User from '../../../models/User';
import db from '../../../utils/db';
const handler = nc()
import bcrypt from 'bcryptjs'

handler.put(async (req, res) => {
    try {
        await db.connect()
        const user = await User.findOne({ _id: req.body._id })
        if (user) {
            const updated = await User.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    password: bcrypt.hashSync(req.body.password),
                }
            })
            await db.disconnect()
            if (updated) {
                return res
                    .status(200)
                    .json({ message: 'Password Updated Successfully!' });
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

export default handler
