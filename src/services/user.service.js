const randomstring = require("randomstring")
const createError = require('http-errors')
const User = require('../models/User')

require('dotenv').config()

class userService {

    static async createUser(data) {

        const { address } = data

        const user = await User.findOne({ address }).lean()

        if(user !== null) return

        return await User.create(data)

    }

    static async all() {

        return User.find({}).lean()

    }

}

module.exports = userService;
