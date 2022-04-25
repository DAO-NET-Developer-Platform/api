const Organization = require('../models/Organization');
const Member = require('../models/Member')
const randomString = require('randomstring')
const createError = require('http-errors')

class OrganizationService {

    static async all() {

        const organizations = await Organization.find({}).populate('joinCriteria').populate('budgetCriteria').lean()

        return organizations

    }

    static async create(data) {

        data.image = `https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`

        //make the creator the first member
        await Member.create()


        return await Organization.create(data)

    }

    static async single(id) {

        const data = (await Organization.findOne({ _id: id }).populate('joinCriteria').populate('budgetCriteria')).toObject()

        return data

    }

    static async update(id, data) {

        await Organization.findByIdAndUpdate(id, data, {
            new: true
        }).toObject()

    }

    static async search (data) {

    }

    static async delete(id) {

        return await Organization.findByIdAndDelete(id)

    }

    static async join(data) {

        //check membership status

        const isMember = await this.checkMembership(data.user, data.organization)

        if(isMember != null) {
            await Member.findByIdAndDelete(isMember._id)
            return
        }

        //check organization requirement
        const criteria = await this.getJoinCriteria(data.organization)

        await this.determineJoin(criteria, data)

        return

        //generate address
        // data.address = `#addr${randomString.generate(32)}`

        // data.amountInTreasury = 150

        // //joining organization
        // return await Member.create(data)

    }

    static async leave(id, member_id) {

        await Member.findByIdAndDelete(member_id)

        return

    }

    static async getJoinCriteria(id) {

        const organization = (await Organization.findById(id).populate('joinCriteria')).toObject()

        return { criteria: organization.joinCriteria.criteria, amount: organization.joinCriteriaAmount }

    }

    static async determineJoin(criteria, data) {


        if(criteria.criteria.includes(`members' approval`)) {

            //create a vote for the the request

        }

        if(criteria.criteria == 'Anyone who pays the entry fee') {

            if(!data.paymentHash) throw createError.Unauthorized('Please pay before joining Dao')

            data.amountInTreasury = 150

        }
    
        data.address = `#addr${randomString.generate(32)}`

        console.log(data.address)
        // return

        return await Member.create(data)

    }

    static async checkMembership(user_id, org_id) {

        return await Member.findOne({ $and: [ {user: user_id, organization: org_id} ] }).lean()

    }

}

module.exports = OrganizationService