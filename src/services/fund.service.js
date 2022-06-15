const Transaction = require('../models/Transaction')
const Organization = require('../models/Organization')
const Budget = require('../models/Budget')
const axios = require('axios')
const createError = require('http-errors')
const transactionService = require('../services/transaction.service')
const webhook = require('../services/webhook.service')

class FundService {

    static async getFunds() {

    }

    static async fundDao(id, data) {

        const organization = (await Organization.findById(id)).toObject()

        let treasury = parseInt(organization.treasury)

        // const txExist = await this.transactionExists(data.txHash)

        // console.log(txExist)

        // if(txExist != null) throw createError.Unauthorized('Invalid hash')

        // data.type = 'Dao funding'

        let transaction = await transactionService.checkTransaction(data.txHash)

        if(!transaction) throw createError.Unauthorized('Invalid transaction')

        let current = transaction.outputs.find((el) => el.address == organization.address)

        // if(!current) transaction.status == "pending"
        // await transactionService.createWebhook(webhookData)

        if(!current) {
            console.log('will try to validate later')
            setTimeout(async() => {

                transaction = await transactionService.checkTransaction(data.txHash)
                console.log(transaction)

                current = transaction.outputs.find((el) => el.address == organization.address)

                if(parseInt(current.value) !== parseInt(data.amount)) throw createError.Unauthorized('Invalid Quantity')

                treasury += parseInt(data.amount)

                await Organization.findByIdAndUpdate(id, {
                    treasury
                }, { new: true })

                transaction.type = 'Dao funding'
                transaction.amount = data.amount

                await Transaction.create(transaction)

                console.log('updated')

            }, 200000)

            return {
                message: 'Processing your payment'
            }
        }

        if(parseInt(current.value) !== parseInt(data.amount)) throw createError.Unauthorized('Invalid Quantity')

        console.log(res.data.outputs[0].amount.quantity != parseInt(organization))

        treasury += parseInt(data.amount)

        await Organization.findByIdAndUpdate(id, {
            treasury
        }, { new: true })

        transaction.type = 'Dao funding'
        transaction.amount = data.amount

        await Transaction.create(transaction)

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

        // const current = transaction.outputs.find((el) => el.address == budget.address)

        // if(!current) throw createError.Unauthorized('Invalid Transaction')

        // if(parseInt(current.value) !== parseInt(data.amount)) throw createError.Unauthorized('Invalid Quantity')

        transaction.amount = data.amount
        transaction.type = "Budget Funding"

        await Transaction.create(transaction)

        return

    }

}

module.exports = FundService