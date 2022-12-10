import mongoose from 'mongoose'

const convoSchema = new mongoose.Schema(
    {
        user: {
            type: Object,
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation', required: true
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation', required: true
        },
        seller: {
            type: Object,
            required: true
        },
        relatedTo: {
            type: Object,
            required: true
        },
    },
    {
        timestamps: true,
    }
)

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', convoSchema)
export default Conversation
