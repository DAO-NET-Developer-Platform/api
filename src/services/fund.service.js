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

        const transaction = await transactionService.checkTransaction(data.txHash)

        if(!transaction) throw createError.Unauthorized('Invalid hash')

        const current = transaction.outputs.find((el) => el.address == organization.address)

        if(!current) throw createError.Unauthorized('Invalid Transaction')

        if(parseInt(current.value) !== parseInt(data.amount)) throw createError.Unauthorized('Invalid Quantity')

        // console.log(res.data.outputs[0].amount.quantity != parseInt(organization))

        treasury += parseInt(data.amount)

        await Organization.findByIdAndUpdate(id, {
            treasury
        }, { new: true })

        res.data.type = 'Dao funding'
        res.data.amount = data.amount

        await Transaction.create(res.data)

        return
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

        const current = transaction.outputs.find((el) => el.address == budget.address)

        if(!current) throw createError.Unauthorized('Invalid Transaction')

        if(parseInt(current.value) !== parseInt(data.amount)) throw createError.Unauthorized('Invalid Quantity')

        transaction.amount = data.amount
        transaction.type = "Budget Funding"

        await Transaction.create(transaction)

        return

    }

}

module.exports = FundService