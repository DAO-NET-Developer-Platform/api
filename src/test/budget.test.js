// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const Organization = require('../models/Budget')
// const User = require('../models/User')
// const { initialOrganizations, nonExistingId, organizationsInDb, initialUsers } = require('./organization.test_helper')

// const api = supertest(app)

// beforeEach(async () => {
// 	await Budget.deleteMany({})
//     await User.deleteMany({})
// 	//create an array of promises
// 	const organizations = initialOrganizations.map((el) => Organization.create(el))
//     const users = initialUsers.map((el) => User.create(el))

//     await Promise.all(organizations, users)
// 	// //runs in order
// 	// for (let Organization of initialImages) {
// 	//     await Organization.create(Organization)
// 	// }
// }, 100000)


// afterAll(() => {
// 	return mongoose.connection.close()
// })