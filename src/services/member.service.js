const Member = require('../models/Member')


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
}

module.exports = MemberService