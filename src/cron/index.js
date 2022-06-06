let cron = require('node-cron')
const Organization = require('../models/Organization')
const Decision = require('../models/Decision')
const Member = require('../models/Member')

async function returnRemaining() {

    console.log('***** returning unspent ******')

    const organizations = await Organization.find()

    await Promise.all(organizations.map(async(el, i) => {

        //get all organization members
        let members = await Member.find({ organization: el._id })

        if(members == null) return

        members = members.map(el => el.toJSON().unspent)

        //add all the unspent funds
        const unspent = members.reduce((a, b) => {
            return a + b
        }, 0)

        //update member balance
        await Member.updateMany({ organization: el._id }, {
            unspent: 0
        })

        //add to orgnaization balance
        const organization = (await Organization.findById(el._id)).toObject()

        const treasury = parseInt(organization.treasury - organization.circulation) + parseInt(unspent)

        await Organization.findByIdAndUpdate(el._id, {
            treasury
        }, {
            new: true
        })

    }))

    console.log('done')

}

async function generateVotingPower() {
    console.log('***** generating voting power ******')

    //get organizations
    const organizations = await Organization.find()

    //calculate the voting power of each member
    await Promise.all(organizations.map(async(el, i) => {

        //get all organization members
        const members = await Member.find({ organization: el._id }).lean()

        //calculate voting power
        const organization = (await Organization.findById(el._id)).toObject()

        await Organization.findByIdAndUpdate(el._id, {
            circulation: organization.treasury
        }, {
            new: true
        })

        const unspent = parseInt(organization.treasury)/parseInt(members.length)

        await Member.updateMany({ organization: el._id }, {
            unspent: unspent
        })

    }))

    console.log('done')

}

// async function dispenseFunds() {

//     // await Decision.find()

// }

cron.schedule('0 */1 * * *', async () => {
    console.log('cron job started')

    try {
        await returnRemaining()
        await generateVotingPower()
        // await dispenseFunds()
    } catch(e) {

        console.log(e)

    }
    
});
