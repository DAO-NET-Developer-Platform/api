const Member = require('../models/Member')
const User = require('../models/User')
const Approval = require('../models/Approval')
const organization = require('../services/organization.service')
const createError = require('http-errors')
const appendLeaf = require('./appendLeaf')


class MemberService {

    static async getMembers(id, address) {
        
        const members = await Member.find({ organization: id }).populate('user').lean()

        members.map((el, i) => {
            if(el.address == address) {
                members[i].me = true
            }
        })

        return members
    }

    static async approve(organization_id, data) {

        /**
         * create a middleware to check membership
         */

        data.type = 'Member'
        data.organization = data.organization_id

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
            await Member.findByIdAndUpdate(member, {
                status: 'active'
            }, {
                new: true
            })

            const organizationData = await organization.find(data.organization)

            //appendLeaf to merkle root
            await appendLeaf(organizationData._id, organization.name, '18903181363824143898991577644926413440129187799018291116511855593047705855895')         
        }

        return

    }

    static async isMember(org_id, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Member.findOne({ $and: [ {user: user._id, organization: org_id} ] }).lean() 

    }

    static async isPending(org_id, member) {

        return await Member.findOne({ $and: [ { member, organization: org_id, status: 'pending' } ] }).lean()

    }

    static async decided(member, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Approval.findOne({ $and: [ { member, user: user._id } ] }).lean()

    }
}

module.exports = MemberService