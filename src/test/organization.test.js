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

    test('fetch organization with slug correctly', async() => {
        const res = await api
            .get('/organization/dao-mazen')

        expect((res._body.data.slug)).toBe('dao-mazen')
    }, 100000)
    
})

describe('organization creation', () => {

    test('organization should be created with post request', async () => {

        const data = {
            name: 'Dao Mazen',
            slug: 'dao-mazen',
            image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
            creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
            joinCriteria: '6283762e2f335a6df2c71901',
            budgetCriteria: '6283762e2f335a6df2c71905',
            address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevrap',
            hash: '13467859453662759606374521637484558599684623349201647366263674748574478818345630322',
        }
        
		await api
			.get('/organization')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	}, 100000)


})

afterAll(() => {
	return mongoose.connection.close()
})