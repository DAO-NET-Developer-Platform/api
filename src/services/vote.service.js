const Vote = require('../models/Vote')

class VoteService {

    static async all(id) {

        return await Vote.find({organization: id}).lean()

    }

    static async create(data) {

        data.image = `https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`
        
        return await Vote.create(data)

    }

    static async single(id) {

        return await Vote.findById(id).lean()

    }

    static async update(id, data) {

    }
    
    static async delete(id) {

    }
}

module.exports = VoteService