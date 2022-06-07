const Organization = require('../models/Organization')
const Vote = require('../models/Vote')
const Budget = require('../models/Budget')
const { uploadFile, retrieve } = require('../connectors/web3.storage')

module.exports = async function(req, res, next) {

    // const data = crypto.Hmac('SHA256', 'What a testing').update('I love cupcakes').digest('hex');

    console.log("********** running organizations ***********")

    const organizations = await Organization.find({})

    await Promise.all(organizations.map(async (el, i) => {

        try {

            const image = await retrieve(el.image)

            await Organization.findByIdAndUpdate(el._id, {
                image,
                cid: el.image
            }, { new: true })

        } catch(e) {
            console.log(e)
        }

    }))

    console.log("********** running votes ***********")

    const votes = await Vote.find({})

    await Promise.all(votes.map(async (el, i) => {

        try {
            const image = await retrieve(el.image)

            await Vote.findByIdAndUpdate(el._id, {
                image,
                cid: el.image
            }, { new: true })
        } catch (e) {
            console.log(e)
        }

    }))

    console.log("********** running budgets ***********")

    const budgets = await Budget.find({})

    await Promise.all(budgets.map(async (el, i) => {


        try {

            const image = await retrieve(el.image)

            await Budget.findByIdAndUpdate(el._id, {
                image,
                cid: el.image
            }, { new: true })

        }catch(e) {
            console.log(e)
        }

    }))

    console.log('done')


    res.status(200).json({
        status: true,
        message: 'Images Updated successfully'
    })
}