const { User } = require('../data/user.model');
const { Bank, validateBankDetails, addOwnerToBankDetails } = require('../data/bankDetails.model');
const config = require('config');
const Stripe = require('stripe')
const stripe = Stripe(config.get('stripeSecretKey'));


module.exports.subscribePackage = async (req, res) => {
    try {

        const {
            user: { _id },
            body: { amount, source, receipt_email, subscriptionPlan }
        } = req;

        const charge = await stripe.charges.create({
            amount: parseInt(amount) * 100,
            currency: 'PKR',
            source,
            receipt_email
        })

        if (!charge) throw new Error('charge unsuccessful')

        const bank = await Bank.create({
            amount,
            source,
            receiptEmail: receipt_email
        })

        const subscribedUser = await User.updateOne(
            { _id, isDeleted: false },
            { subscribed: true, bankDetail: true, subscriptionPlan },
            { new: true, upsert: false })


        console.log(subscribedUser);

        await addOwnerToBankDetails(_id, bank._id);

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
