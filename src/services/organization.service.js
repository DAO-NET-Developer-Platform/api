const Organization = require('../models/Organization');
const { MerkleTreeNode, MerkleTreeNodeDocument, MerkleTreeRootBatch, MerkleTreeZero } = require("@interep/db")
// const LangOrganization = require('../models/LanguageOrganization')
const Member = require('../models/Member')
const randomstring = require('randomstring')
const createError = require('http-errors')
const language = require('../services/language.service')
const User = require('../models/User')
const Budget = require('../models/Budget')
const LanguageBudget = require('../models/LanguageBudget')
const LanguageVote = require('../models/LanguageVote')
const Vote = require('../models/Vote');
const appendLeaf = require('./appendLeaf');
const deleteLeaf = require('./deleteLeaf')
const crypto = require('crypto')
const slug = require('slugify')
const transactionService = require('./transaction.service')



class OrganizationService {

    static async find(id) {
        return Organization.findById(id).lean()
    }

    static async findBy(name, value) {

        const query = {}

        query[name] = value

        return await Organization.findOne(query).lean()

    }

    static async slugify(name) {

        const org = await this.findBy('name', name)

        if(org == null) return slug(name, {
            lower: true
        })

        const random = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });

        return slug(`${name} ${random}`, {
            lower: true
        })

    }

    static async all(query) {

        // const { page } = query

        let page

        if(query) {
            page = query.page
        }

        if(query.criteria) return await this.search(query)

        if(!page) return await Organization.find({}).populate('joinCriteria').populate('budgetCriteria').lean()

        const data = await Organization.paginate({}, { 
            page,
            limit: 12,
            populate: ['budgetCriteria', 'joinCriteria'],
            lean: true,
            sort: { createdAt: 'desc' }
        })

        return data.docs

    }

    static async me(address) {

        const orgs = await Member.find({ address }).populate('organization').lean()

        return orgs.map((el) => el.organization)

    }

    static async create(data) {

        data.slug = await this.slugify(data.name)

        //make the creator the first member
        const user = await User.findOne({ address: data.creator }).select('_id').lean()

        const organization = await Organization.create(data)

        const memberData = {
            address: data.creator,
            user: user._id,
            organization: organization._id,
            amountInTreasury: 0,
            status: 'active',
            identityCommitment: data.identityCommitment
        }

        await Member.create(memberData)

        //create merkleRootbatch and append leaf ..use hash as provider
        const rootBatch = new MerkleTreeRootBatch({
            group: {
                provider: organization._id,
                name: organization.name
            },
        })

        await rootBatch.save()

        //last option is for identityCommitment
        await appendLeaf(organization._id, organization.name, data.identityCommitment)

        return organization

    }

    static async single(id, member, status) {

        const data = (await Organization.findOne({ _id: id }).populate('joinCriteria').populate('budgetCriteria')).toObject()

        data.isMember = member
        data.status = status

        return data

    }

    // static async update(id, data) {

    //     await Organization.findByIdAndUpdate(id, data, {
    //         new: true
    //     }).toObject()

    // }

    static async delete(id) {

        return await Promise.all([Organization.deleteMany(), Member.deleteMany(), User.deleteMany(), Budget.deleteMany(), LanguageBudget.deleteMany(), Vote.deleteMany(), LanguageVote.deleteMany()])

        // return await Vote.deleteMany()

    }

    static async join(data) {

        //check membership status
        const isMember = await this.checkMembership(data)

        if(isMember != null) {

            const organization = await this.find(data.organization)
            await deleteLeaf(organization._id, organization.name, data.identityCommitment)

            await Member.findByIdAndDelete(isMember._id)
            
            return `removed successfully`
        }

        //check organization requirement
        const criteria = await this.getJoinCriteria(data.organization)

        await this.determineJoin(criteria, data)

        return `Join requested successfully`

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

        const organization = await this.find(data.organization)

        if(criteria.criteria == 'Anyone who pays the entry fee') {

            if(!data.txHash) throw createError.Unauthorized('Please pay before joining Dao')

            //call to transaction services to check
            const transaction = await transactionService.checkTransaction(data.txHash)

            if(transaction == null) throw createError.Unauthorized('Invalid Hash')

            //get organization address
            const current = transaction.outputs.find((el) => el.address == organization.address)

            if(current < 0) throw createError.Unauthorized('Invalid Transaction')

            if(parseInt(current.value) !== parseInt(criteria.amount * 1000000)) throw createError.Unauthorized('Invalid Quantity')

            transaction.type = 'Joining fee'
            transaction.amount = criteria.amount * 1000000

            await transactionService.createTransaction(transaction, data.organization)


        } else if(criteria.criteria.includes(`members' approval`)) {
            //create a pending status for the user
            data.status = 'pending'
        }

        const user = await User.findOne({ address: data.address }).lean()

        data.user = user._id 

        if(data.status == 'active') await appendLeaf(organization._id, organization.name, data.identityCommitment)

        const member = await Member.create(data)

        return member

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

        return await Member.findOne({ $and: [ {user: user._id, organization: org_id, status: 'active' } ] }).lean()

    }

    static async search(data) {

        const criterias = [ 'all', 'joined' ]

        let { search, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        search = search == null ? '' : search

        //search all organizations
        if(criteria == 'all') {

            results = await Organization.paginate(
                {
                    name: { $regex: new RegExp(`${search}`), $options: 'i'}
                }, {
                    page,
                    limit: 12,
                    populate: ['budgetCriteria', 'joinCriteria'],
                    lean: true,
                    sort: { createdAt: 'desc' }
                }
            )

            return results.docs
        }

        //search joined organizations
        results = await Member.paginate({ address }, {
            page,
            limit: 12,
            populate: {
                path:'organization',
                match: {
                    name: { $regex: new RegExp(`${search}`), $options: 'i'}
                }
            },
            lean: true,
            sort: { createdAt: 'desc' }
        })

        // return results

        results.docs.map((el, i) => {
            el.organization != null ? results.docs[i] = el.organization : delete results.docs[i]
        })

        results = results.docs.filter((el, i) => {
            return el != null
        })
        
        return results
    }

}

module.exports = OrganizationService