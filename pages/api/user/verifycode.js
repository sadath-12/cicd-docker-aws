
import nc from 'next-connect'
import twilio from 'twilio';
const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const handler = nc()

handler.get(async (req, res) => {
    client
        .verify.v2
        .services(process.env.NEXT_PUBLIC_TWILIO_VERIFY_SERVICE_ID)
        .verificationChecks
        .create({
            to: `+${req.query.mobile}`,
            code: req.query.code
        })
        .then(data => {
            res.status(200).send(data);
        }).catch((error) => {
            return res
                .status(400)
                .json({ message: error.message });
        })
})

export default handler
