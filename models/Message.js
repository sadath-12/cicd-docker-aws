import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
    {
        convoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation', required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true
        },
        message: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
)

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)
export default Message
