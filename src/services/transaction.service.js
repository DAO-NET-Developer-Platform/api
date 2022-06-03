const Transaction = require('../models/Transaction')
const Organization = require('../models/Organization')
const axios = require('axios')
const createError = require('http-errors')

class TransactionService {

    static async createTransaction(data, id) {

        const organization = (await Organization.findById(id)).toObject()

        let treasury = parseInt(organization.treasury)

        treasury += parseInt(data.amount)

        await Organization.findByIdAndUpdate(id, {
            treasury
        }, { new: true })

        await Transaction.create(data)

    }

    static async checkTransaction(hash, id) {

        const txExist = await this.transactionExists(hash)

        if(txExist != null) throw createError.Unauthorized('Invalid hash')

        try {
        const res = await axios(`${process.env.BLOCKFROST_URL}${hash}/utxos`, {
            method: "GET",
            headers: {
                'Authorization': `${process.env.BLOCKFROST_ApiKeyAuth}`,
                'project_id': `${process.env.BLOCKFROST_PROJECT_ID}`
            },
        })

        return res.data

        } catch(e) {
            throw createError.Unauthorized('Invalid hash')
        }

    }

    static async transactionExists(hash) {
        const transaction = await Transaction.findOne({ hash }).lean()

        return transaction
    }

}

module.exports = TransactionService