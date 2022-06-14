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
        const res = await axios(`${process.env.TANGO_BASE_URL}${hash}/utxos`, {
            method: "GET",
            headers: {
                'x-api-key': `${process.env.TANGO_API_KEY}`,
            },
        })

        console.log(res.data)
        console.log(res.data.outputs)

        return res.data

        } catch(e) {
            console.log(e)
            throw createError.Unauthorized('Invalid hash')
        }

    }

    static async transactionExists(hash) {
        const transaction = await Transaction.findOne({ hash }).lean()

        return transaction
    }

    static async createWebhook(data) {

        const res = await axios(`${process.env.TANGO_WEBHOOK_URL}`, {
            method: "POST",
            headers: {
                'x-api-key': `${process.env.TANGO_API_KEY}`,
            },
            data
        })

        console.log(res.data)

        return

    }

}

module.exports = TransactionService