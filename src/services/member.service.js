const Member = require('../models/Member')
const User = require('../models/User')
const Approval = require('../models/Approval')
const organization = require('../services/organization.service')
const createError = require('http-errors')
const appendLeaf = require('./appendLeaf')
const Decision = require('../models/Decision')
const hasLeaf = require('./hasLeaf')


class MemberService {

    static async getMembers(id, query) {

        let members

        let page, address

        if(query) {
            page = query.page
            address = query.address
        }  

        if(!page) {
            members =  await Member.find({ organization: id }).populate('user').lean()
        } else {
            const data = query.criteria ? await this.search(id, query) : await Member.paginate({ organization: id }, {
                page,
                limit: 10,
                populate: 'user',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            members = data.docs != null ? data.docs : data
        }

        await Promise.all(members.map(async (el, i) => {
            const decisions = await Decision.find({ organization: id, member: el._id }).lean()
            members[i].decisions = decisions.length

            if(el.address == address) {
                members[i].me = true
            }
        }))

        return members
    }

    static async approve(organization_id, data) {

        /**
         * create a middleware to check membership
         */

        data.type = 'Member'
        data.organization = organization_id

        //create approval

        await Approval.create(data)

        const { type, member } = data

        //find all membership approvals for member
        const approvals = await Approval.find({ $and: [ { type, member } ] })

        // console.log(approvals.length)
    
        //find organization membership criteria
        const { criteria, amount } = await organization.getJoinCriteria(organization_id)

        let members = await this.getMembers(organization_id, null)

        members = members.filter((el) => el.status == "active")

        //check if criteria is met and approve accodingly
        let treshold = amount

        if(criteria.includes('By percentage')) {

            treshold = Math.round(members.length * Number(amount)/100)

        }

        if(approvals.length >= treshold) {

            const organizationData = await organization.find(data.organization)

            //appendLeaf to merkle root
            await appendLeaf(organizationData._id, organization.name, approvedMember.identityCommitment)  

            const approvedMember = await Member.findByIdAndUpdate(member, {
                status: 'active'
            }, {
                new: true
            })
            
            await this.calculateVotingPower(organizationData._id)
        }

        return

    }

    static async isMember(org_id, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Member.findOne({ $and: [ {user: user._id, organization: org_id, status: 'active'} ] }).lean() 

    }

    static async isPending(org_id, member) {

        return await Member.findOne({ $and: [ { _id: member, organization: org_id, status: 'pending' } ] }).lean()

    }

    static async decided(member, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Approval.findOne({ $and: [ { member, user: user._id } ] }).lean()

    }

    static async verifyMember(data) {

        return await hasLeaf(data)

    }

    static async search(id, data) {

        const criterias = [ 'all', 'active', 'pending', 'approved' ]

        let { search, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid Criteria')

        let results

        search = search == null ? '' : search

        if(criteria == 'all') {

            results = await Member.paginate({  $and: [{
                    organization: id, address: { $regex: new RegExp(`${search}`), $options: 'i'}
                }]
            }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results.docs

        }

        if(criteria == 'active') {

            results = await Member.paginate({  $and: [{
                organization: id, status: 'active', address: { $regex: new RegExp(`${search}`), $options: 'i'}
            }]
            }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results.docs

        }

        if(criteria == 'pending') {

            results = await Member.paginate({  $and: [{
                organization: id, status: 'pending', address: { $regex: new RegExp(`${search}`), $options: 'i'}
            }]
        }, {
            page,
            limit: 12,
            lean: true,
            sort: { createdAt: 'desc' }
        })

        return results.docs

        }

        if(criteria == 'approved') {

            results = await Approval.paginate({ organization: id,
            }, {
                page,
                limit: 12,
                populate: {
                    path: 'member',
                    match: {
                        address: { $regex: new RegExp(`${search}`), $options: 'i'}
                    }
                },
                lean: true,
                sort: { createdAt: 'desc' }
            })

            //filter
            results.docs.map((el, i) => {
                el.member != null ? results.docs[i] = el.member : delete results.docs[i]
            })
    
            results = results.docs.filter((el, i) => {
                return el != null
            })
            
            return results

        }

    }
}

module.exports = MemberService