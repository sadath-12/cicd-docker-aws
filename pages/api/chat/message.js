import nc from 'next-connect'
import Message from '../../../models/Message';
const handler = nc()
import { isAuth } from '../../../utils/auth';
handler.use(isAuth)

handler.post(async (req, res) => {
    try {
        const newMsg = new Message({ ...req.body });
        const messageCreated = await newMsg.save();
        return res.status(201).json({
            messageCreated
        });
    } catch (err) {
        res.status(400).json({
            message: e.message,
        });
    }
})

handler.get(async (req, res) => {
    try {
        const msgs = await Message.find({ convoId: req.query.id });
        return res.status(200).json({
            msgs
        });
    } catch (err) {
        res.status(400).json({
            message: e.message,
        });
    }
})


export default handler
