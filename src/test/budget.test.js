const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Budget = require('../models/Budget')
const User = require('../models/User')
const { initialOrganizations, initialBudgets, budgetsInDb, organizationsInDb, initialUsers } = require('./budget.test_helper')
const Organization = require('../models/Organization')

const api = supertest(app)

beforeEach(async () => {
	await Budget.deleteMany({})
    await Organization.deleteMany({})
    await User.deleteMany({})
	//create an array of promises
	const organizations = initialOrganizations.map((el) => Organization.create(el))
    const users = initialUsers.map((el) => User.create(el))
    const budgets = initialBudgets.map((el) => Budget.create(el))

    await Promise.all(organizations, users, budgets)
	// //runs in order
	// for (let Organization of initialImages) {
	//     await Organization.create(Organization)
	// }
})


describe('when there is initially some organizations saved', () => {

	test('budgets are returned as json', async () => {
        const organization = await organizationsInDb()

		await api
			.get(`/budget/${organization[0].slug}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	}, 100000)

    // test('fetch organization with slug', async() => {
    //     await api
    //         .get('/organization/dao-mazen')
    //         .expect(200)
    //         .expect('Content-Type', /application\/json/)
    // }, 100000)

    // test('fetch organization with slug correctly', async() => {
    //     const res = await api
    //         .get('/organization/dao-mazen')

    //     expect((res._body.data.slug)).toBe('dao-mazen')
    // }, 100000)
    
})

describe('organization creation', () => {

    test('budget creation should fail if no such organization exists', async () => {

        // const organization = await organizationsInDb()

        const data = {
            title: "Failed budget",
            address: "addr04457283538647465672340856277365",
            creator: "addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo",
            deadline: '10',
            amount: 50,
            description: 'something new',
            hash: '12236636464662834823434363647364732647418232047483463476474734376634510647284187374572819174743248193403748291',
            image: 'cs94568499920034122233445',
            cid: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm'
        }
        
		// try {
        await api
        .post(`/budget/dao-slug`)
        .send(data)
        .expect(404, { status: false, message: 'No such organization' })
        // } catch(e) {
        //     console.log(e)
        // }

        const budgets = await budgetsInDb()
        expect(budgets).toHaveLength(initialBudgets.length)
			
	}, 100000)


    test('budget creation should be created when organization exists', async() => {

        const organization = await organizationsInDb()

        const data = {
            title: "Confirm budget",
            address: "addr04457283538647465672340856277365",
            creator: "addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo",
            deadline: '10',
            amount: 50,
            description: 'something new',
            hash: '12236636464662834823434363647364732647418232047483463476474734376634510647284187374572819174743248193403748291',
            image: 'cs94568499920034122233445',
            cid: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm'
        }
        
        await api
            .post(`/budget/${organization[0].slug}`)
            .send(data)
            // .expect(200)
       
    //    console.log(res)

        // const budgets = await budgetsInDb()
        // console.log(budgets)
        // expect(budgets).toHaveLength(initialBudgets.length)

    }, 100000)

})


afterAll(() => {
	return mongoose.connection.close()
})
