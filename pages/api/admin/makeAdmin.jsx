import nc from 'next-connect'
import User from '../../../models/User'
const handler = nc()

handler.get(async (req, res) => {
    try {
        if (req.query.key && req.query.id && req.query.key === process.env.JWT_SECRET) {
            const updated = await User.findOneAndUpdate({ _id: req.query.id },
                {
                    $set: { isAdmin: true }
                },
                {
                    new: true
                }
            )
            return res.status(200).json({
                message:
                    "User is Now an admin",
            });
        } else {
            res.status(400).json({
                message: 'You are not allowed to do this!',
            });
        }

    } catch (err) {
        res.status(400).json({
            message: e.message,
        });
    }
})

export default handler
