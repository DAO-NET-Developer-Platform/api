const Transaction = require('../models/Transaction')
const Organization = require('../models/Organization')
const axios = require('axios')

class FundService {

    static async getFunds() {

    }

    static async fundDao(id, data) {

        const organization = (await Organization.findById(id)).toObject()

        let treasury = parseInt(organization.treasury)

        //verify amount with blockfrost


        treasury += parseInt(data.amount)

        await Organization.findByIdAndUpdate(id, {
            treasury
        }, { new: true })

    }

}

module.exports = FundService