const Organization = require('../models/Organization');
// const LangOrganization = require('../models/LanguageOrganization')
const Member = require('../models/Member')
const randomString = require('randomstring')
const createError = require('http-errors')
const language = require('../services/language.service')
const User = require('../models/User')
const Budget = require('../models/Budget')
const LanguageBudget = require('../models/LanguageBudget')
const LanguageVote = require('../models/LanguageVote')
const Vote = require('../models/Vote')
const { uploadFile, retrieve } = require('../connectors/web3.storage')


class OrganizationService {

    static async find(id) {
        return Organization.findById(id).lean()
    }

    static async findBy(name, value) {

        const query = {}

        query[name] = value

        return await Organization.findOne(query).lean()

    }

    static async all() {

        const organizations = await Organization.find({}).populate('joinCriteria').populate('budgetCriteria').lean()

        return { organizations }

    }

    static async create(data) {

        // const { cid, image } = await uploadFile(data.image.tempFilePath)

        // data.cid = cid
        // data.image = image

        //make the creator the first member
        const user = await User.findOne({ address: data.creator }).select('_id').lean()

        const organization = await Organization.create(data)

        const memberData = {
            address: data.creator,
            user: user._id,
            organization: organization._id,
            amountInTreasury: 0
        }

        await Member.create(memberData)

        return organization

    }

    static async single(id, member) {

        const data = (await Organization.findOne({ _id: id }).populate('joinCriteria').populate('budgetCriteria')).toObject()

        data.isMember = member

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

        return await Promise.all([Organization.deleteMany(), Member.deleteMany(), User.deleteMany(), Budget.deleteMany(), LanguageBudget.deleteMany(), Vote.deleteMany(), LanguageVote.deleteMany()])

        // return await Vote.deleteMany()

    }

    static async join(data) {

        //check membership status

        const isMember = await this.checkMembership(data)

        if(isMember != null) {
            await Member.findByIdAndDelete(isMember._id)
            return
        }

        //check organization requirement
        const criteria = await this.getJoinCriteria(data.organization)

        await this.determineJoin(criteria, data)

        return

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

        data.status = 'active'

        if(criteria.criteria == 'Anyone who pays the entry fee') {

            if(!data.paymentHash) throw createError.Unauthorized('Please pay before joining Dao')

            data.amountInTreasury = 150

        } else if(criteria.criteria.includes(`members' approval`)) {
            //create a pending status for the user
            data.status = 'pending'
        }

        const user = await User.findOne({ address: data.address }).lean()

        data.user = user._id

        return await Member.create(data)

    }

    static async checkMembership(data) {

        const user = await User.findOne({ address: data.address }).lean()

        const { organization } = data

        return await Member.findOne({ $and: [ {user: user._id, organization} ]}).lean()

    }

    static async isMember(address, org_id) {

        //find user with address
        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Member.findOne({ $and: [ {user: user._id, organization: org_id} ] }).lean()

    }

}

module.exports = OrganizationService