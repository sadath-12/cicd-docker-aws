import nc from 'next-connect'
import Website from '../../../models/Website';
const handler = nc()
import { isAuth, isAdmin } from '../../../utils/auth';
handler.use(isAuth, isAdmin);


handler.put(async (req, res) => {
    try {
        const site = await Website.findById(req.body._id)
        if (site) {
            const updated = await Website.findOneAndUpdate({ _id: req.body._id }, { $set: { ...req.body } },
                {
                    new: true
                }
            )
            if (updated) {
                res.status(200).json(
                    updated
                );
            } else {
                res.status(400).json({
                    message: 'something went wrong',
                });
            }
        } else {
            res.status(400).json({
                message: 'website not exists',
            });
        }
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})

handler.delete(async (req, res) => {
    try {
        const site = await Website.findById(req.query.id)
        if (site) {
            const deleted = await Website.findByIdAndDelete(req.query.id)
            if (deleted) {
                res.status(200).json(
                    deleted
                );
            } else {
                res.status(400).json({
                    message: 'something went wrong',
                });
            }
        } else {
            res.status(400).json({
                message: 'website not exists',
            });
        }
    } catch (e) {
        res.status(400).json({
            message: e.message,
        });
    }
})


export default handler
