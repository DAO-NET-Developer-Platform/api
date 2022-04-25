const Member = require('../models/Member')


class MemberService {
    static async getMembers(id) {
        
        return await Member.find({ organization: id }).populate('user').lean()

    }
}

module.exports = MemberService