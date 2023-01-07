import mongoose from 'mongoose'

const ReqSchema = new mongoose.Schema(
    {
        user: {
            type: Object,
            required: true
        },
        description: {
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
    },
    {
        timestamps: true,
    }
)

const Requirement = mongoose.models.Requirement || mongoose.model('Requirement', ReqSchema)
export default Requirement
