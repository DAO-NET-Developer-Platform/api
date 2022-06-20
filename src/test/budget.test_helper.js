const Organization = require('../models/Organization')
const Budget = require('../models/Budget')

const initialOrganizations = [
	{
		name: 'Dao Mazen',
		description: 'something new',
        slug: 'dao-mazen',
		image: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm',
        creator: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo',
        joinCriteria: '6283762e2f335a6df2c71901',
        budgetCriteria: '6283762e2f335a6df2c71905',
        address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvsyrtwevrap',
        hash: '13467859453662759606374521637484558599684623349201647366263674748574478818345630322',
		cid: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm'
	}
]

const initialUsers = [

	{
		address: 'addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo'
	},
]

const initialBudgets = [
	{
		title: "new budget",
		address: "addr04457283538647465672340856277365",
		creator: "addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo",
		deadline: 10,
		amount: 50,
		description: 'something new',
		hash: '12236636464662834823434363647364732647418232047483463476474734376634510647284187374572819174743248193403748291',
		image: 'cs94568499920034122233445',
		cid: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm'
	},

	{
		title: "new test budget",
		address: "addr0445728353864746567234085627736748",
		creator: "addrXAr9aE1u84fkrXOHppzTUCVVgvmOTAvo",
		deadline: 10,
		amount: 50,
		description: 'something new',
		hash: '12236636464662834823434363647364732647418232047483463476474734376634510647284187374572819174743248193403748291',
		image: 'cs94568499920034122233478',
		cid: 'bafybeifuc3ozphi2rzaoytokkkft3zh2k4gkre7j3esw6w47t5enjh5wsm'
	}

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
    budgetsInDb,
	initialBudgets
}