
import nc from 'next-connect'
import User from '../../../models/User';
import Website from '../../../models/Website';
import db from '../../../utils/db';
const handler = nc()

handler.get(async (req, res) => {
    try {
        if (req.query.id) {
            await db.connect()
            const user = await User.findOne({ _id: req.query.id })
            if (user) {
                if (req.query.websites === 'true') {
                    const websites = await Website.find({ user: req.query.id })
                    return res
                        .status(200)
                        .json({ user, websites });
                } else {
                    return res
                        .status(200)
                        .json({ user });
                }
            } else {
                return res
                    .status(400)
                    .json({ message: `${req.query.id} - has no user` });
            }
            await db.connect()
        } else {
            return res
                .status(400)
                .json({ message: `Id was not provided!` });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
})

export default handler
