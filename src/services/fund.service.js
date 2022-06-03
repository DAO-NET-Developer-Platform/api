const Transaction = require('../models/Transaction')
const Organization = require('../models/Organization')
const Budget = require('../models/Budget')
const axios = require('axios')
const createError = require('http-errors')
const transactionService = require('../services/transaction.service')

class FundService {

    static async getFunds() {

    }

    static async fundDao(id, data) {

        const organization = (await Organization.findById(id)).toObject()

        let treasury = parseInt(organization.treasury)

        const txExist = await this.transactionExists(data.txHash)

        // console.log(txExist)

        if(txExist != null) throw createError.Unauthorized('Invalid hash')

        // data.type = 'Dao funding'

        //verify amount with blockfrost
        try {

            const res = await axios(`${process.env.BLOCKFROST_URL}${data.txHash}/utxos`, {
                method: "GET",
                headers: {
                    'Authorization': `${process.env.BLOCKFROST_ApiKeyAuth}`,
                    'project_id': `${process.env.BLOCKFROST_PROJECT_ID}`
                },
            })

            // console.log(res.data.outputs[0].amount.quantity != parseInt(organization))

            treasury += parseInt(data.amount)

            await Organization.findByIdAndUpdate(id, {
                treasury
            }, { new: true })

            res.data.type = 'Dao funding'
            res.data.amount = data.amount

            await Transaction.create(res.data)

            // if(res.data.input) {}
        } catch(e) {
            // console.log(e.errors.hash.properties)
            throw createError.Unauthorized('Invalid hash')
        }

        // console.log(res)

    }

    static async transactionExists(hash) {

        const transaction = await Transaction.findOne({ hash }).lean()

        return transaction

    }

    static async fundBudget(id, data) {

        const budget = await Budget.findById(id).lean()

        if(budget == null) throw createError.NotFound('No such budget item')

        const transaction = await transactionService.checkTransaction(data.txHash)

        if(!transaction) throw createError.Unauthorized('Invalid hash')

        if(budget.address != transaction.outputs[0].address) throw createError.Unauthorized('Invalid address')

        if(parseInt(transaction.outputs[0].amount[0].quantity) != parseInt(data.amount)) throw createError.Unauthorized('Invalid hash')

        transaction.amount = data.amount
        transaction.type = "Budget Funding"

        await Transaction.create(transaction)

        return

    }

}

module.exports = FundService