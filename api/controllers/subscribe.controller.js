const { User } = require('../data/user.model');
const { Bank, validateBankDetails, addOwnerToBankDetails } = require('../data/bannkDetails.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


module.exports.subscribePackage = async (req, res) => {
    try {

        const {
            user: { _id },
            body: { amount, source, receipt_email }
        } = req;

        const charge = await stripe.charges.create({
            amount,
            currency: 'pkr',
            source,
            receipt_email
        })

        if (!charge) throw new Error('charge unsuccessful')


        await Bank.create({
            amount,
            source,
            receiptEmail: receipt_email
        })

        const subscribedUser = await User.updateOne({ subscribed: true, bankDetail: true }, { _id: _id, isDeleted: false })

        await addOwnerToBankDetails(_id, Bank._id);

        res.status(200).json({
            charge,
            message: 'Subscribed Successfully successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
