const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Organization = require('../models/Organization')
const { initialOrganizations, nonExistingId, organizationsInDb } = require('./organization.test_helper')

const api = supertest(app)

beforeEach(async () => {
	await Organization.deleteMany({})
	//create an array of promises
	const organizations = initialOrganizations.map((el) => Organization.create(el))

    await Promise.all(organizations)
	// //runs in order
	// for (let Organization of initialImages) {
	//     await Organization.create(Organization)
	// }
}, 100000)


describe('when there is initially some organizations saved', () => {
    
	test('organizations are returned as json', async () => {
		await api
			.get('/organization')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	}, 100000)

    test('fetch organization with slug', async() => {
        await api
            .get('/organization/dao-mazen')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)
})

afterAll(() => {
	return mongoose.connection.close()
})