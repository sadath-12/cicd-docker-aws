import nc from 'next-connect'
import Conversation from '../../../models/Conversation'
const handler = nc()
import { isAuth } from '../../../utils/auth';
handler.use(isAuth)

handler.post(async (req, res) => {
    try {
        const conversationThere = await Conversation.findOne(
            {
                $or: [{ senderId: req.user._id, recieverId: req.body.seller._id },
                { senderId: req.body.seller._id, recieverId: req.user._id }]
            }
        )
        if (conversationThere) {
            if (req.body.relatedTo) {
                if (req.body.relatedTo === conversationThere.relatedTo) {
                    return res.status(200).json({
                        message:
                            "Conversation Exists",
                        convo: conversationThere,
                    });
                } else {
                    const updated = await Conversation.findOneAndUpdate({
                        $or: [{ senderId: req.user._id, recieverId: req.body.seller._id },
                        { senderId: req.body.seller._id, recieverId: req.user._id }]
                    },
                        {
                            $set: { relatedTo: req.body.relatedTo }
                        },
                        {
                            new: true
                        }
                    )
                    return res.status(200).json({
                        message:
                            "Conversation Exists",
                        convo: updated,
                    });
                }
            } else {
                return res.status(200).json({
                    message:
                        "Conversation Exists",
                    convo: conversationThere,
                });
            }
        } else {
            const newConvo = new Conversation(req.body)
            const createdConvo = await newConvo.save()
            if (newConvo) {
                return res.status(201).json({
                    message:
                        "Conversation Created",
                    convo: createdConvo,
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong!!',
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            message: e.message,
        });
    }
})

handler.get(async (req, res) => {
    try {
        const conversationsThere = await Conversation.find({ $or: [{ senderId: req.user._id }, { recieverId: req.user._id }] })
        if (conversationsThere) {
            return res.status(200).json({
                convos: conversationsThere,
            });
        }

    } catch (err) {
        res.status(400).json({
            message: e.message,
        });
    }
})

export default handler
