import mongoose from 'mongoose'


const webSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true
        },
        siteURL: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        time_of_delivery: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        site_stats: {
            type: Object,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const Website = mongoose.models.Website || mongoose.model('Website', webSchema)
export default Website
