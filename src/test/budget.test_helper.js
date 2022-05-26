const Organization = require('../models/Organization')
const Budget = require('../models/Budget')

const initialOrganizations = [
	{
		name: 'Dao Mazen',
        slug: 'dao-mazen',
		image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
        creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
        joinCriteria: '6283762e2f335a6df2c71901',
        budgetCriteria: '6283762e2f335a6df2c71905',
        address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevrap',
        hash: '13467859453662759606374521637484558599684623349201647366263674748574478818345630322',
	}
]

const initialUsers = [

	{
		address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo'
	},
]


const organizationsInDb = async () => {
	const organizations = await Organization.find({})
	return organizations.map(org => org.toJSON())
}

const budgetsInDb = async () => {
    const budgets = await Budget.find({})
	return budgets.map(bud => bud.toJSON())
}

module.exports = {
	initialOrganizations,
	organizationsInDb,
	initialUsers,
    budgetsInDb
}